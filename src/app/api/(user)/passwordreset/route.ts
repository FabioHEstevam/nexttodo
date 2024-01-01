import prisma from "@/app/prismadb"
import { NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer"
import { randomUUID } from "crypto";
import bcrypt from "bcrypt"

const ForgetPasswordSchema = z.object({
    email: z.string().email().refine(value => !! value, {
        message: 'E-mail is mandatory and should be a valid e-mail'
    })
})

export async function POST(request: Request) {
    const body = await request.json()
    const { email } = body
    
    if(ForgetPasswordSchema.safeParse(body).success === false){
        return NextResponse.error()
    }

    const userExist = await prisma.user.findUnique({
        where:{
            email
        }
    })

    if(!userExist){
        return NextResponse.json({ErrorMessage: "User not found"})
    }

    var transport = nodemailer.createTransport({
        pool: true,
        host: "mail.fabioestevam.com.br",
        port: 465,
        secure: true, // use TLS
        auth:{
            user:process.env.USER_MAIL,
            pass:process.env.USER_PASSWORD
        }
    })

    var token = `${randomUUID()}${randomUUID()}`.replace(/-/g,'');
    var hashToken = await bcrypt.hash(token, 10);

    try{
        const forgetPasswordToken = await prisma.user.update({
            where:{
                email
            },
            data:{
                forgetpasswordtoken: hashToken//`${randomUUID()}${randomUUID()}`.replace(/-/g,''),
            }
        })

        const options = {
            from: process.env.USER_MAIL,
            to: userExist.email as string,
            subject: "Password change request",
            html:`<a href="${process.env.NEXT_URL}/passwordreset/${userExist.id}/${token}">Click here to reset your password</a>`
        }

        transport.verify(function (error, success){
            if(error){
                console.log(error)
            }
        })

        await transport.sendMail(options)

        return NextResponse.json("Sucessfully send the password change email to user")
    
    } catch (error) {
        
        return NextResponse.error();

    }
}

export async function PATCH(request: Request){
    
    const { id, token , newpassword } = await request.json();

    try {
        const userExist = await prisma.user.findUnique({
            where: {
                id
            }
        })

        if (!userExist){
            return NextResponse.error()
        }

       const validToken = await bcrypt.compare(token,userExist.forgetpasswordtoken as string);

        if (!validToken){
            return NextResponse.error()
        }

        const hashednewpassword = await bcrypt.hash(newpassword, 10);

        const changepassword = await prisma.user.update({
            where:{
                id:userExist.id
            },
            data:{
                password:hashednewpassword,
                forgetpasswordtoken:null
            }
        })

        return NextResponse.json(changepassword, {status: 200})

    } catch (error) {
        console.log(error);
        return NextResponse.json("Error while changing password", {status:500})
    }

}
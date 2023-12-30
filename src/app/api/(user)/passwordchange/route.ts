import prisma from "@/app/prismadb"
import { getServerSession } from "next-auth/next"
import { options } from "../../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt"
import nodemailer from "nodemailer"
import { randomUUID } from "crypto";

export async function PATCH(request: Request){

    const session = await getServerSession(options);
    const { password, newpassword } = await request.json();

    try{
        if(!session?.user?.email){
            return NextResponse.error()
        }

        const user = await prisma?.user.findUnique({
            where:{
                email: session.user.email,
            },
        })

        if(!user || !user.email || !user.password){
            return NextResponse.error()
        }

        const passwordMatch = await bcrypt.compare(password,user.password)

        if(!passwordMatch){
            return NextResponse.error()
        }

        var transport = nodemailer.createTransport({
            pool: true,
            host: "mail.fabioestevam.com.br",
            port: 465,
            secure: true,
            auth:{
                user:process.env.USER_MAIL,
                pass:process.env.USER_PASSWORD,
            }
        })

        var token = `${randomUUID()}${randomUUID()}`.replace(/-/g,'');
        var hashToken = await bcrypt.hash(token, 10);

        const verificationtoken = await prisma.user.update({
            where:{
                email: user.email,
            },
            data:{
                forgetpasswordtoken: hashToken,
            }
        })

        const options = {
            from: process.env.USER_MAIL,
            to: user.email as string,
            subject: "Your password has been changed",
            html:`
            Your password has been changed, 
            if you do not recognize this change 
            <a href="${process.env.NEXT_URL}/passwordreset/${user.id}/${token}">
            click here to reset your password.
            </a>
            `
        }

        const hashednewpassword = await bcrypt.hash(newpassword,10)

        const changepassword = await prisma.user.update({
            where:{
                id:user.id
            },
            data:{
                password:hashednewpassword,
                forgetpasswordtoken:hashToken
            }
        })

        transport.verify(function(error, success){
            if(error){
                console.log(error)
            }else{
                console.log("Server is good to send email")
            }
        })

        await transport.sendMail(options)

        return NextResponse.json(changepassword, {status: 200})
    
    }catch (error){
        console.log(error);
        return NextResponse.json("Error while changing password", {status:500})
    }

}
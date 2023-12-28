import { NextRequest, NextResponse } from "next/server";
import prisma from '@/app/prismadb'
import { redirect } from "next/navigation";

export async function GET(request: NextRequest, { params }: { params: { token: string } }) {

    const { token } = params;

    const user = await prisma.user.findFirst({
        where: {
            ActivateToken: {
                some: {
                    AND: [
                        {
                            token: {
                                equals: token
                            }
                        }
                    ]
                }
            }
        }
    })

    const usertoken = await prisma.activateToken.findUnique({
        where: {
            token
        }
    })

    console.log(user)

    if (!user) {
        //throw new Error('Invalid Token')
        return NextResponse.json('Invalid URL')
    }

    if (usertoken) {
        if (usertoken.activatedAt) {
            return NextResponse.json('Email has been verified')
        }

        if (usertoken.createdAt < new Date(Date.now() - 24 * 60 * 60 * 1000)) {
            return NextResponse.json('URL expired')
        }
    }


    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            verified_user: true,
        }
    })

    await prisma.activateToken.update({
        where: {
            token: token
        },
        data: {
            activatedAt: new Date(Date.now())
        }
    })

    return NextResponse.json('Sucessfuly verified user')

}
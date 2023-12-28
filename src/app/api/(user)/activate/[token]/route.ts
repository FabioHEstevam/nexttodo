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
                            activatedAt: null
                        },
                        {
                            createdAt:
                            {
                                gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
                            }
                        },
                        {
                            token
                        }
                    ]
                }
            }
        }
    })

    if (!user) {
        throw new Error('Invalid Token')
    }

    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            verified_user: true
        }
    })

    redirect('/')

    return NextResponse.json('Sucessfuly verified user')

}
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next"
import { options } from "../../auth/[...nextauth]/options";
import { Storage } from "@google-cloud/storage";
import { randomUUID } from "crypto";
import prisma from "@/app/prismadb";

const storage = new Storage({
    projectId: process.env.GCS_PROJECT_ID,
    credentials: {
        client_email: process.env.GCS_CLIENT_EMAIL,
        private_key: process.env.GCS_PRIVATE_KEY?.split(String.raw`\n`).join("\n"),
    },
});

export async function POST(request: NextRequest) {

    const session = await getServerSession(options);

    const data = await request.formData();

    const file: File | null = data.get('image') as unknown as File;
    const username: string | null = data.get('username') as unknown as string;


    try {
        if (!session?.user?.email) {
            return NextResponse.error()
        }

        let user = await prisma.user.findUnique({
            where: {
                email: session.user.email,
            }
        })

        if (!user) {
            return NextResponse.error()
        }

        if (username) {
            user.name = username
        }

        if (file) {

            const currentProfilePic = user.image

            const splitedFile = file.name.split('.')
            const fileExtention = splitedFile[splitedFile.length - 1]
            const fileName = randomUUID().replace(/-/g, '') + "." + fileExtention

            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const bucket = storage.bucket("discof")

            bucket.file(fileName).save(buffer, (err) => {
                if (!err) {
                    console.log("Success")
                } else {
                    console.log("Error " + err)
                }
            })

            const publicUrl = bucket.file(fileName).publicUrl()

            user.image = publicUrl;

            const profilePicName = currentProfilePic?.split('/')[currentProfilePic?.split('/').length - 1]

            if (profilePicName) {
                const oldPicPublicUrl = bucket.file(profilePicName)
                oldPicPublicUrl.delete({ ignoreNotFound: true }, (err) => {
                    if (!err) {
                        console.log("Success")
                    } else {
                        console.log("Error " + err)
                    }
                })
            }
        }

        await prisma?.user.update({
            where: {
                email: session.user.email,
            },
            data: {
                ...user
            }
        })

        return NextResponse.json({username: user.name, image: user.image});

    } catch (error) {
        console.log(error);
        return NextResponse.json("Error while changing username", { status: 500 })
    }

}

/* 
            Para salvar em um diretório local 
            
            const path = join(process.cwd() + '/public/tmp', file.name);
            await writeFile(path, buffer);
        
            Para salvar um arquivo de um diretório local no google cloud storage
            const bucket = storage.bucket("discof")
            bucket.upload(path, function (err, file, apiResponse) { });
            */
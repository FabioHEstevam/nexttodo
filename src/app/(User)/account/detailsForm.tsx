'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import { useState } from "react";
import { useSession, getSession } from "next-auth/react"
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";


type Props = {}


function DetailsForm(props: Props) {

    const { data: Session, status, update } = useSession()

    const [image, setImage] = useState<File>();
    const [username, setUserName] = useState(Session?.user?.name)

    const router = useRouter()

    async function onSubmit() {

        const formData = new FormData();

        if (image) {
            formData.append('image', image);;
        }

        if (username) {
            if (Session?.user?.name != username) {
                formData.append('username', username);
            }
        }

        try {
            const response = await axios.post('/api/update', formData).then(() => {
                update().then(async () => {
                    toast({
                        description: "User data updated"
                    })
                     setTimeout(()=>location.reload(),2000);
                });
            })
        } catch (error) {
            console.log(error)
            toast({
                description: "Something went wrong"
            })
        }

    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>
                    Make changes to your account here. Click save when you're done.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="space-y-1">
                    <Label htmlFor="username">Profile name</Label>
                    <Input id="username" defaultValue={Session?.user?.name as string} onChange={(e) => setUserName(e.target.value)} />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="image">Profile picture</Label>
                    <Input id="image" type="file" onChange={(e) => e.target.files && setImage(e.target.files[0])} />
                </div>

            </CardContent>
            <CardFooter>
                <Button onClick={() => onSubmit()}>Save changes</Button>
            </CardFooter>
        </Card>
    )
}
export default DetailsForm;
'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import { useState } from "react";
import { useSession, getSession } from "next-auth/react"
import { unknown, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

type Props = {}

const MAX_FILE_SIZE = 2000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const UpdateSchema = z.object({

    username: z.union(
        [
            z.string().min(3, { message: "Username must be at least 3 characters long" }),
            z.string().length(0)
        ])
        .optional()
        .transform(e => e === "" ? undefined : e),

    image: z.any()
        .refine((file) =>
            file?.size <= MAX_FILE_SIZE, `Max image size is 2MB.`)
        .refine((file) =>
            ACCEPTED_IMAGE_TYPES.includes(file?.type),
            "Only .jpg, .jpeg, .png and .webp formats are supported."
        )
        .optional()
})

function DetailsForm(props: Props) {

    const { data: Session, update } = useSession()

    const username = Session?.user?.name as string;

    const form = useForm<z.infer<typeof UpdateSchema>>({
        resolver: zodResolver(UpdateSchema),
        defaultValues: {
            username: '',
        }
    })

    async function onSubmit(values: z.infer<typeof UpdateSchema>) {

        const formData = new FormData();

        const username = values.username;
        const image = values.image;

        if (image) {
            formData.append('image', image);;
        }

        if (username) {
            if (Session?.user?.name != username) {
                formData.append('username', username);
            }
        }

        if (username && image) {
            try {
                const response = await axios.post('/api/update', formData).then(() => {
                    update().then(async () => {
                        toast({
                            description: "User data updated"
                        })
                        setTimeout(() => location.reload(), 2000);
                    });
                })
            } catch (error) {
                console.log(error)
                toast({
                    description: "Something went wrong"
                })
            }
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
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>User name:</FormLabel>
                                    <FormControl>
                                        <Input placeholder={username} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Profile picture:</FormLabel>
                                    <FormControl>
                                        <Input type="file"
                                            onChange={(e) => e.target.files && form.setValue('image', e.target.files[0])}
                                            name={field.name}
                                            onBlur={field.onBlur}
                                            ref={field.ref}
                                            disabled={field.disabled} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        <div className="flex flex-row justify-center w-full">
                            <Button typeof="submit" className="">Submit</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
export default DetailsForm;
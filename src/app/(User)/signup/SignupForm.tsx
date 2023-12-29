'use client'
import { SignUpSchema } from "@/ZodSchema/UserSchema";
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import axios from "axios"
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { useSession } from 'next-auth/react'
import { useRouter } from "next/navigation";

type Props = {};

function SignUpForm(props: Props) {

    const { toast } = useToast();
    const { data: Session, status } = useSession();
    const router = useRouter();

    const form = useForm<z.infer<typeof SignUpSchema>>({
        resolver: zodResolver(SignUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmpassword: "",
        },
    })

    async function onSubmit(values: z.infer<typeof SignUpSchema>) {

        try {
            const response = await axios.post('/api/signup', {
                username: values.username,
                email: values.email,
                password: values.password,
                confirmpassword: values.confirmpassword
            })
            toast({
                description: "User Registered Successfully",
            })

        } catch (error) {
            console.log(error)
            toast({
                description: "Something went wrong",
            })
        }
    }

    useEffect(() => {
        if (Session) {
            router.push('/task')
        }
    })

    return (
        <div className="mt-4 max-w-[1280px] mx-auto">
            <Card className="p-5 max-w-[600px] mx-auto">
                <CardHeader className="text-2xl font-semibold text-center">
                    Sign up
                </CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>User name:</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Username" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>E-mail:</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="email@email.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password:</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        <FormField
                            control={form.control}
                            name="confirmpassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password:</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        <div className="flex flex-row justify-center w-full">
                            <Button type="submit" className="">Submit</Button>
                        </div>
                    </form>
                </Form>
            </Card>
        </div>
    )
}

export default SignUpForm;
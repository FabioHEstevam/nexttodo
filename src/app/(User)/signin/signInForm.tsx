'use client'
import { SignInSchema } from "@/ZodSchema/UserSchema";
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { signIn, useSession } from 'next-auth/react'
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

type Props = {};

function SignInForm(props: Props) {
    const { toast } = useToast()
    const { data: Session, status } = useSession()
    const router = useRouter()

    const form = useForm<z.infer<typeof SignInSchema>>({
        resolver: zodResolver(SignInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof SignInSchema>) {

        try {
            const response = await signIn('credentials', {
                email: values.email,
                password: values.password,
                redirect: false,
            })
            if (response?.status == 200) {
                toast({
                    description: "SignIn Successfully",
                })
                router.push('/task')
            } else {
                toast({
                    description: "Password or User wrong",
                })
            }

        } catch (error) {
            console.log(error)
            toast({
                description: "Something error happpended",
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
            <Card className="p-5 max-w-[600px] mx-auto space-y-4">
                <CardHeader className="text-2xl font-semibold text-center">
                    Sing in
                </CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>E-mail:</FormLabel>
                                    <FormControl>
                                        <Input placeholder="email@email.com" {...field} />
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
                        <div className="flex flex-row justify-center w-full">
                            <Button type="submit" className="">Submit</Button>
                        </div>
                    </form>
                </Form>

                <Separator />

                <h1 className="text-lg font-semibold text-center">Sing in with:</h1>

                <div className="flex flex-row justify-center w-full">
                    <Button onClick={() => signIn('facebook',{callbackUrl:'/task'})} type='button' variant='ghost'>
                        <Image src={"/facebook.svg"} alt="Facebook Logo" width={100} height={100} className="h-5 w-5" />
                    </Button>
                    <Button onClick={() => signIn('google',{callbackUrl:'/task'})} type='button' variant='ghost'>
                        <Image src={"/google.svg"} alt="Google Logo" width={100} height={100} className="h-5 w-5" />
                    </Button>
                    <Button onClick={() => signIn('linkedin',{callbackUrl:'/task'})} type='button' variant='ghost'>
                        <Image src={"/linkedin.svg"} alt="LinkedIn Logo" width={100} height={100} className="h-5 w-5" />
                    </Button>
                </div>

                <Separator />

                <div className="flex flex-row justify-center w-full text-sm text-center">
                    <Link className={buttonVariants({ variant: "link" }) + " "} href={"/forgotpassword"}>
                        Forgot your password?
                    </Link>
                </div>
            </Card>
        </div>
    )
}

export default SignInForm;
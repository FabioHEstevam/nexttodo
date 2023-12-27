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
import Link from "next/link";
import Image from "next/image";

type Props = {};

function SignInForm(props: Props) {

    const form = useForm<z.infer<typeof SignInSchema>>({
        resolver: zodResolver(SignInSchema),
        defaultValues: {
            email: "",
        },
    })

    async function onSubmit(values: z.infer<typeof SignInSchema>) {
        console.log(values)
    }

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
                    <Button onClick={() => console.log("Ma oi")/*signIn('google')*/} type='button' variant='ghost'>
                        <Image src={"facebook.svg"} alt="Facebook Logo" width={100} height={100} className="h-5 w-5" />
                    </Button>
                    <Button onClick={() => console.log("Ma oi")/*signIn('google')*/} type='button' variant='ghost'>
                        <Image src={"google.svg"} alt="Google Logo" width={100} height={100} className="h-5 w-5" />
                    </Button>
                    <Button onClick={() => console.log("Ma oi")/*signIn('google')*/} type='button' variant='ghost'>
                        <Image src={"linkedin.svg"} alt="LinkedIn Logo" width={100} height={100} className="h-5 w-5" />
                    </Button>
                </div>

            </Card>
        </div>
    )
}

export default SignInForm;
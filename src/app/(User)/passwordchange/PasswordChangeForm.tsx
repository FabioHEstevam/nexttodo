'use client'
import { PasswordSchema } from "@/ZodSchema/UserSchema"
import { Button } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"

type Props = {
    token: string,
}

type PasswordT = z.infer<typeof PasswordSchema>

function PasswordChangeForm({ token }: Props) {

    const [success, setSuccess] = useState(false);

    const form = useForm<PasswordT>({
        resolver: zodResolver(PasswordSchema),
        defaultValues: {

        }
    });

    const router = useRouter();

    const { toast } = useToast();

    const onSubmit: SubmitHandler<PasswordT> = async (data) => {
        try {
            const response = await axios.patch('/api/passwordchange', {
                token,
                newpassword: data.password
            })
            toast({
                description: "Password changed successfuly",
            })
            router.push('/signin')
        } catch (error) {
            console.log(error)
            toast({
                description: "Error changing password"
            })
        }
    }

    return (
        <div className="mt-4 max-w-[1280px] mx-auto">
            <Card className="p-5 max-w-[600px] mx-auto">
                <CardHeader className="text-2xl font-semibold text-center">
                    Reset password
                </CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">Enter your new password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmpassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">Enter your new password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button size='lg' type="submit">Submit</Button>
                    </form>
                </Form>
            </Card>
        </div>
    )
}

export default PasswordChangeForm;
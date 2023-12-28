'use client'

import { Button } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useForm } from "react-hook-form"
import { z } from "zod"

type Props = {}

const ForgetPasswordSchema = z.object({
    email: z.string().email().refine(value => !!value, {
        message: "E-mail is mandatory and should be a valid e-mail address",
    })
})

function ForgotPasswordForm(props: Props) {

    const { toast } = useToast();

    const form = useForm<z.infer<typeof ForgetPasswordSchema>>({
        resolver: zodResolver(ForgetPasswordSchema),
        defaultValues: {
            email: "",
        }
    })

    async function onSubmit(values: z.infer<typeof ForgetPasswordSchema>) {
        console.log(values);
        try {
            const response = await axios.post('/api/passwordchange', {
                email: values.email,
            })
            toast({
                description: "E-mail sent to your registered email",
            })
            console.log(response);
        } catch (error) {
            console.log('Error', error)
            toast({
                description: "Error while sendind e-mail to your registered e-mail"
            })
        }
    }

    return (
        <div className="mt-4 max-w-[1280px] mx-auto">
            <Card className="p-5 max-w-[600px] mx-auto">
                <CardHeader className="text-2xl font-semibold text-center">
                    Forgot yor password?
                </CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">E-mail</FormLabel>
                                    <FormControl>
                                        <Input type="email" autoComplete="off" placeholder="email@email.com" {...field} />
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

export default ForgotPasswordForm
'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DetailsForm from "./detailsForm";
import { useToast } from "@/components/ui/use-toast";
import { useSession, signOut } from 'next-auth/react'
import { useForm } from "react-hook-form";
import { ChangePasswordSchema } from "@/ZodSchema/UserSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

type Props = {}

function PasswordForm(props: Props) {

    const { toast } = useToast();
    const { data: Session, status } = useSession();

    const form = useForm<z.infer<typeof ChangePasswordSchema>>({
        resolver: zodResolver(ChangePasswordSchema),
        defaultValues: {
            password: "",
            newpassword: "",
            confirmnewpassword: "",
        }
    })

    async function onSubmit(values: z.infer<typeof ChangePasswordSchema>) {
        try {
            const response = await axios.patch('/api/passwordchange', {
                password: values.password,
                newpassword: values.newpassword,
            }).then(()=>{
                toast({
                    description: "Password changed"
                })
                signOut();
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
                <CardTitle>Password</CardTitle>
                <CardDescription>
                    Change your password here. After saving, you'll be logged out.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                            name="newpassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Enter your new password:</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        <FormField
                            control={form.control}
                            name="confirmnewpassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm your new password:</FormLabel>
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
            </CardContent>
        </Card>
    )
}
export default PasswordForm;
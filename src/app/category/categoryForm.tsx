'use client'
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { createCategory, updateCategory } from "@/lib/data";
import { Category } from "@/lib/definitions";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { unknown, z } from "zod";


type Props = {
    category: Category | undefined,
    setCategory: Dispatch<SetStateAction<Category | undefined>>,
}


const CategorySchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long")
})

function CategoryForm(props: Props) {

    //const [category, setCategory] = useState<Category>()

    const router = useRouter();

    const [open, setOpen] = useState(false);

    const form = useForm<z.infer<typeof CategorySchema>>({
        resolver: zodResolver(CategorySchema),
        defaultValues: {
            name: '',
        }
    })

    useEffect(() => {
        if (props.category) {
            form.setValue("name", props.category.name);
            setOpen(true);
        } else {
            form.resetField("name")
        }

    }, [props.category])

    useEffect(() => {
        if (!open) {
            props.setCategory(undefined)
        }
    }, [open]
    )

    async function onSubmit(values: z.infer<typeof CategorySchema>) {
        try {
            if (!props.category) {
                await createCategory(values.name)
                router.refresh()
                setOpen(false);
            }
            else{
                let category = props.category;
                category.name = values.name;
                await updateCategory(category);
                router.refresh();
                setOpen(false);
            }
        } catch (error) {
            console.log(error)
            toast({
                description: "Something went wrong",
            })
        }
    }

    return (

        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <PlusCircle className="mr-2" />
                    Add category
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit category</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category name:</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Category name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        <div className="flex flex-row justify-center w-full">
                            <Button type="submit" className="">Submit</Button>
                        </div>
                    </form>
                </Form>

            </DialogContent>
        </Dialog>

    )
}

export default CategoryForm;
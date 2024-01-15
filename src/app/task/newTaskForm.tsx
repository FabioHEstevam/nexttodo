import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { createTask, findAllCategories, updateTask } from "@/lib/data"
import { Category, Task } from "@/lib/definitions"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

type Props = {
    task: Task | undefined,
    setTask: Dispatch<SetStateAction<Task | undefined>>,
    categories: Category[],
}

const TaskSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long"),
    description: z.optional(z.string()),
    categoryId: z.optional(z.string()),
})

function TaskForm(props: Props) {

    const router = useRouter()

    const [open, setOpen] = useState(false)

    const form = useForm<z.infer<typeof TaskSchema>>({
        resolver: zodResolver(TaskSchema),
        defaultValues: {
            title: '',
            description: '',
            categoryId: '',
        }
    })

    useEffect(() => {
        if (props.task) {
            form.setValue("title", props.task.title)
            form.setValue("description", props.task.description as string)
            form.setValue("categoryId", props.task.categoryId as string)
            setOpen(true)
        }
        else {
            form.reset()
        }
    }, [props.task])

    useEffect(() => {
        if (!open) {
            props.setTask(undefined)
        }
    }, [open]
    )

    async function onSubmit(values: z.infer<typeof TaskSchema>) {
        try {
            if(!props.task){
                await createTask(
                    values.title,
                    values.description as string,
                    values.categoryId as string
                )
                router.refresh()
                setOpen(false)
            }
            else{
                let task = props.task;
                task.title = values.title;
                task.description = values.description as string;
                task.categoryId = values.categoryId as string;
                await updateTask(task);
                router.refresh();
                setOpen(false);
            }
        }
        catch (error) {
            console.log(error)
            toast({
                description: "Something went wrong",
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="">
                    <PlusCircle className="mr-2" />
                    Add task
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit task</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title:</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description:</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="Description" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category:</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {props.categories.map((category: Category) => (
                                                    <SelectItem
                                                        value={category.id}
                                                        key={category.id}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        {/*<Input placeholder="Category" {...field} />*/}
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex flex-row justify-end w-full gap-2">
                            <Button variant={"outline"} type="button" onClick={(e) => setOpen(false)} className="">Cancel</Button>
                            <Button type="submit" className="">Save</Button>
                        </div>
                    </form>
                </Form>

            </DialogContent>
        </Dialog>
    )
}
export default TaskForm

/*

*/
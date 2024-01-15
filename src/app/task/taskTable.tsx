'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Category, Task } from "@/lib/definitions"
import { useRouter } from "next/navigation";
import TaskCard from "./taskCard";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { completeTask, deleteTask } from "@/lib/data";
import { useState } from "react";
import TaskForm from "./newTaskForm";
import { cp } from "fs";

type Props = {
    tasks: Task[],
    categories: Category[],
}

function TaskTable(props: Props) {

    const route = useRouter();

    const [task, setTask] = useState<Task>()

    async function handleDelete(taskId: string) {
        const result = await deleteTask(taskId);
        route.refresh();
    }

    async function handleEdit(task: Task) {
        setTask(task);
    }

    async function handleComplete(taskId: string) {
        const result = await completeTask(taskId);
        route.refresh();
    }


    return (
        <div className="mt-4 maw-w-[1280px] w-full mx-auto ">

            <div className="text-center text-2xl font-medium mb-8">
                Tasks
            </div>

            <TaskForm task={task} setTask={setTask} categories={props.categories} />

            <div className="grid md:grid-cols-2 xl:grid-cols-3 w-full gap-4 my-4">
                {props.tasks?.map((task) => (
                    <TaskCard task={task} key={task.id} handleDelete={handleDelete} handleEdit={handleEdit} handleComplete={handleComplete}/>
                ))}
            </div>

        </div>
    )

}

export default TaskTable;

/*


*/
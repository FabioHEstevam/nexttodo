'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Task } from "@/lib/definitions"
import { useRouter } from "next/navigation";
import TaskCard from "./taskCard";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { deleteTask } from "@/lib/data";

type Props = {
    tasks: Task[],
}

function TaskTable(props: Props) {

    const route = useRouter();

    async function handleDelete(taskId: string) {
        const result = await deleteTask(taskId);
        route.refresh();
    }


    return (
        <div className="mt-4 maw-w-[1280px] w-full mx-auto ">

            <div className="text-center text-2xl font-medium mb-8">
                Tasks
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 w-full gap-4">
                {props.tasks?.map((task) => (
                    <TaskCard task={task} key={task.id} handleDelete={handleDelete} />
                ))}
            </div>

        </div>
    )

}

export default TaskTable;

/*


*/
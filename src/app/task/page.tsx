import { findAllTasks } from "@/lib/data";
import { Task } from "@/lib/definitions";
import TaskTable from "./taskTable";

type Props = {};

async function Page(props: Props) {

    const tasks = await findAllTasks() as unknown as Task[];

    return (
        <div className='max-w-[1280px] mx-auto'>
            <div className='flex items-center py-4 gap-10 justify-between'>
                <TaskTable tasks={tasks}/>
            </div>
        </div>
    )
}

export default Page;

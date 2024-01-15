import { findAllCategories, findAllTasks } from "@/lib/data";
import { Category, Task } from "@/lib/definitions";
import TaskTable from "./taskTable";

type Props = {};

async function Page(props: Props) {

    const tasks = await findAllTasks() as unknown as Task[];
    const categories = await findAllCategories() as unknown as Category[]

    return (
        <div className='max-w-[1280px] mx-auto'>
            <div className='flex items-center py-4 gap-10 justify-between'>
                <TaskTable tasks={tasks} categories={categories}/>
            </div>
        </div>
    )
}

export default Page;

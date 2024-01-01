import CategoryTable from "./categoryTable";

import { Category } from "@/lib/definitions";
import { deleteCategory, findAllCategories } from "@/lib/data";

type Props = {};

async function Page(props: Props) {

    const categories = await findAllCategories() as unknown as Category[]

    return (
        <div className='max-w-[1280px] mx-auto'>
            <div className='flex items-center py-4 gap-10 justify-between'>
                <CategoryTable categories={categories}/>
            </div>
        </div>
    )
}

export default Page;
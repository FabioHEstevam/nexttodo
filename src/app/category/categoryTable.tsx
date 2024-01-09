'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CategoryForm from "./categoryForm";
import { deleteCategory, findAllCategories } from "@/lib/data";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Delete, Edit } from "lucide-react";
import { Category } from "@/lib/definitions";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
    categories: Category[],
}

function CategoryTable(props: Props) {

    const route = useRouter();

    const [category, setCategory] = useState<Category>()

    async function handleDelete(categoryId: string) {
        const result = await deleteCategory(categoryId);
        route.refresh();
    }

    async function handelEdit(category: Category) {
        setCategory(category);
    }

    return (
        <div className="mt-4 max-w-[1280px] w-full mx-auto">

            <div className="text-center text-2xl font-medium mb-8">
                Categories
            </div>

            <div className="flex flex-wrap flex-row justify-start gap-2">
                <CategoryForm category={category} setCategory={setCategory} />
                {props.categories?.map((category) => (
                    <div key={category.id} className="group flex flex-row justify-between h-9 px-4 py-2 border border-input bg-background shadow-sm  items-center whitespace-nowrap rounded-md text-sm font-medium">
                        {category.name}
                        <button className="ml-4 hidden hover:bg-accent rounded-md group-hover:block" onClick={(x) => { handelEdit(category) }}>
                            <Edit className="w-4 h-4 hidden group-hover:block" />
                        </button>

                        <button className="ml-4 hidden hover:bg-accent rounded-md group-hover:block" onClick={(x) => { handleDelete(category.id) }}>
                            <Delete className="w-4 h-4 hidden group-hover:block" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CategoryTable;
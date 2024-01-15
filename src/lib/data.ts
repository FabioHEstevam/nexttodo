'use server'
import { Category, Task } from "./definitions";
import prisma from "@/app/prismadb"
import { getServerSession } from "next-auth/next"
import { options } from "@/app/api/auth/[...nextauth]/options";
import { unstable_noStore as noStore } from 'next/cache';

async function getSessionUser() {

    const session = await getServerSession(options);

    if (!session) {
        throw new Error('User not logged in')
    }

    if (!session.user) {
        throw new Error('User not logged in')
    }

    const user = await prisma.user.findUnique({
        where: {
            email: session.user.email as string,
        },
        select: {
            id: true,
            name: true,
            email: true,
            Category: false
        }
    })

    if (!user) {
        throw new Error('User not logged in')
    }
    return user;

}

export async function createCategory(name: string) {

    try {

        const user = await getSessionUser();

        const data = await prisma.category.create({
            data: {
                name: name,
                userId: user.id,
            },
        })

        return name;

    }
    catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to create new category.');
    }

}

export async function findAllCategories() {

    noStore();

    const session = await getServerSession(options);

    try {
        if (!session) {
            throw new Error('User not logged in')
        }

        if (!session.user) {
            throw new Error('User not logged in')
        }

        const user = await prisma.user.findUnique({
            where: {
                email: session.user.email as string,
            },
            select: {
                Category: true
            }
        })

        return user?.Category;

    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to find all categories.');
    }
}

export async function deleteCategory(categoryId: string) {

    try {
        const user = await getSessionUser();

        const result = await prisma.category.delete({
            where: {
                userId: user.id,
                id: categoryId,
            }
        })

        return result;

    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to find all categories.');
    }
}

export async function updateCategory(category: Category) {

    try {
        const user = await getSessionUser();

        const result = await prisma.category.update({
            where: {
                userId: user.id,
                id: category.id,
            },
            data: {
                name: category.name,
            }
        })

        return result;

    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to find all categories.');
    }

}

export async function createTask(title: string, description: string, categoryId: string) {

    try {

        const user = await getSessionUser();

        const category = await prisma.category.findUnique({
            where: {
                id: categoryId
            }
        })

        const data = await prisma.task.create({
            data: {
                title: title,
                description: description,
                creationDate: new Date(),
                userId: user.id,
                categoryId: category?.id
            },
        })

        return title;

    }
    catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to create new category.');
    }

}

export async function updateTask(task: Task) {

    try {
        const user = await getSessionUser();

        const category = await prisma.category.findUnique({
            where: {
                id: task.categoryId as string
            }
        })

        const result = await prisma.task.update({
            where: {
                userId: user.id,
                id: task.id,
            },
            data: {
                title: task.title,
                description: task.description,
                categoryId: category?.id
            }
        })

        return result;

    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to update Task.');
    }

}

export async function completeTask(taskId: string) {

    try {
        const user = await getSessionUser();

        const task = await prisma.task.findUnique({
            where:{
                id: taskId
            }
        })

        if(!task){
            throw new Error
        }

        if(task?.status=="PENDING"){
            task.completitionDate = new Date()
            task.status = "DONE"
        }
        else{
            task.completitionDate = null
            task.status = "PENDING"
        }

        const result = await prisma.task.update({
            where: {
                userId: user.id,
                id: task.id,
            },
            data: task
        })

        return result;

    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to complete Task.');
    }

}

export async function findAllTasks(){

    noStore();

    try {

        const user = await getSessionUser();

        const tasks = await prisma.task.findMany({
            where: {
                userId : user.id
            },
            include: {
                TaskItem : true,
                category: {
                    select:{
                        name: true
                    }
                }
                
            }
        })

        return tasks;

    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to find all categories.');
    }


}

export async function deleteTask(taskId: string) {

    try {
        const user = await getSessionUser();

        const result = await prisma.task.delete({
            where: {
                userId: user.id,
                id: taskId,
            }
        })

        return result;

    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to find all categories.');
    }
}

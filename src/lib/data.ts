'use server'
import { Category } from "./definitions";
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
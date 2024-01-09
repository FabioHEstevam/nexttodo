export type Category = {
    id: string,
    name: string,
    userId: string,
}

export type Task = {
    id: string,
    title: string,
    description: string | null,
    creationDate: Date,
    completitionDate: Date | null,
    status: "DONE" | "PENDING",
    categoryId: string | null,
    category?: Category | null,
    userId: string,
    TaskItem: TaskItem[]
}

export type TaskItem = {
    id: string,
    description: string | null,
    check: boolean,
    taskId: string,
}
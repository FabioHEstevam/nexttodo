import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Task } from "@/lib/definitions";
import { Check, CheckSquare, ClipboardEdit, MoreHorizontal, Trash } from "lucide-react";

type Props = {
    task: Task,
    handleDelete: (taskId: string) => void
}

function TaskCard(props: Props) {

    const completedItens = props.task.TaskItem.reduce((accumulator, taskItem) => taskItem.check ? accumulator + 1 : accumulator, 0,);
    const totalOfItens = props.task.TaskItem.length;
    const progress = props.task.status == "DONE" ? 100 : completedItens / totalOfItens * 100;

    return (
        <Card className={`group w-full hover:scale-105 hover:text-accent-foreground transition-all duration-100 ease-out `} >
            <CardHeader>
                <div className="flex flex-row justify-between items-start">
                    <div className="space-y-2">
                        <CardTitle className="flex flex-row gap-2 items-center">
                            <div className="">
                                {props.task.title}
                            </div>
                            {props.task.category &&
                                <div className="bg-gray-200 py-1 px-2 rounded-full">
                                    {props.task.category?.name}
                                </div>
                            }
                        </CardTitle>
                    </div>
                    <div className="flex flex-row items-center invisible group-hover:visible gap-2 ">

                        <TooltipProvider>
                            <Tooltip >
                                <TooltipTrigger onClick={() => { console.log("teste") }}>
                                    <CheckSquare className="w-5 h-5 hover:stroke-ring" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Complete</p>
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger>
                                    <ClipboardEdit className="w-5 h-5 hover:stroke-ring" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Edit</p>
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger onClick={() => props.handleDelete(props.task.id)}>
                                    <Trash className="w-5 h-5 hover:stroke-ring" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Remove</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                    </div>


                </div>

                <div className="flex flex-row justify-between items-center">
                    <CardDescription>
                        <p>{props.task.description}</p>
                        <p>{props.task.creationDate.toLocaleString()}</p>
                    </CardDescription>
                </div>


            </CardHeader>



        </Card>
    )
}

export default TaskCard;

/*
<div className="flex flex-row justify-between items-center">
                    
                    {totalOfItens > 1 && progress < 100 && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Progress value={progress} className="w-[100px] hover:scale-105 invisible group-hover:visible" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    {completedItens} of {totalOfItens} {totalOfItens > 1 ? "itens" : "item"}.
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}

                </div>
*/
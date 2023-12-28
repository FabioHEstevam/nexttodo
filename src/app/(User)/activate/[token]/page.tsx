'use client'

import { Suspense, useEffect, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader } from "@/components/ui/card";
import axios from "axios";
import { count } from "console";

type Props = {};


function Page({ params }: { params: { token: string } }) {

    const [fetched, setFetch] = useState(false)
    const [message, setMessage] = useState('')

    useEffect(() => {
        if (!fetched) {
            checkEmail();
        }
    }, [])

    async function checkEmail() {
        try {
            const response = await axios.get("/api/activate/" + params.token);
            setMessage(response.data);
            setFetch(true);
        } catch (error) {
            console.log(error)
        }

    }

    return (
        <div className="mt-4 max-w-[1280px] mx-auto">
            <Card className="p-5 max-w-[600px] mx-auto">
                <CardHeader className="flex flex-row justify-center text-2xl font-semibold text-center">
                    {fetched && message}
                    {!fetched && <Skeleton className="h-8 w-[300px]" />}
                </CardHeader>
            </Card>
        </div>
    )
}

export default Page;
'use client'
import DarkModeButton from "./darkModeButton";
import { Separator } from "./ui/separator";
import { Button, buttonVariants } from "./ui/button";
import Logo from "./logo";
import { LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react"


function Navbar() {

    const { data: Session, status } = useSession()

    return (
        <div className='max-w-[1280px] mx-auto'>
            <div className='flex items-center py-4 gap-6 justify-between'>
                <div className="flex flex-row items-center gap-2 min-w-fit">
                    <a href="/">
                        <Logo />
                    </a>
                </div>

                {status === 'authenticated' && (
                <div className="flex flex-row items-center gap-2 shrink">

                    <Link className={buttonVariants({ variant: "ghost" })} href={"/task"}> Tasks </Link>
                    <Link className={buttonVariants({ variant: "ghost" })} href={"/category"}> Categories </Link>

                </div>
                )}
                
                <div className="w-full">

                </div>

                <div className="flex flex-row gap-2 w-fit">

                    <DarkModeButton />
                    {status === 'unauthenticated' && (
                        <>
                            <Link className={buttonVariants({ variant: "outline" })} href={"/signup"}>
                                Sign up
                            </Link>

                            <Link className={buttonVariants({ variant: "default" })} href={"/signin"}>
                                Log in
                                <LogIn className="ml-2 h-5 w-5" />
                            </Link>
                        </>
                    )}

                    {status === 'authenticated' && (
                        <Button variant="destructive" onClick={() => signOut()}>
                            Log out
                            <LogOut className="ml-2 h-5 w-5" />
                        </Button>
                    )}


                </div>
            </div>
            <Separator />
        </div>
    )
}

export default Navbar;
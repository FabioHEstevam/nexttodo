'use client'
import DarkModeButton from "./darkModeButton";
import { Separator } from "./ui/separator";
import { Button, buttonVariants } from "./ui/button";
import Logo from "./logo";
import { LogIn, LogOut, Settings, UserIcon } from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react"
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useRouter } from "next/navigation";

function Navbar() {

    const { data: Session, status } = useSession()
    const router = useRouter()

    const userName = Session?.user?.name?.trim().split(' ')

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
                        <>

                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <Avatar>
                                        <AvatarImage src={Session.user?.image ? Session.user?.image : ""} alt="@shadcn" />
                                        <AvatarFallback>{userName && userName.map((x, i) => i == 0 ? x[0].toUpperCase() : !userName[i + 1] && x[0].toUpperCase())}</AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-fit ">
                                    <DropdownMenuLabel className="text-xl">{Session.user?.name}</DropdownMenuLabel>
                                    <DropdownMenuLabel className="text-sm">{Session.user?.email}</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => router.push("/account")}>
                                        <UserIcon className="mr-2 h-4 w-4" />
                                        <span>Account</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => signOut()}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    )}


                </div>
            </div>
            <Separator />
        </div>
    )
}

export default Navbar;
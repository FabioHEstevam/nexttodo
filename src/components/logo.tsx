import Image from "next/image";

function Logo() {
    return (
        <>
            <Image id='logo' src={"logo-light.svg"} width={246} height={36} alt='Logo Image' className="block dark:hidden" />
            <Image id='logo' src={"logo-dark.svg"} width={246} height={36} alt='Logo Image' className="hidden dark:block" />
        </>
    )
}
export default Logo;
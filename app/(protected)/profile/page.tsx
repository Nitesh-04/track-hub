import Header from "@/app/_components/header/Header";
import { SignOutButton, UserButton } from "@clerk/nextjs";

export default function Profile() {
    return (
        <div className="h-full w-full">
        <div className="bg-[#001F3F]">
            <Header />
        </div>
        <div className="mt-20 ml-20">
            Hello
            <UserButton/>
            <SignOutButton/>
        </div>
        </div>
    )
}
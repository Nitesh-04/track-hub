import Header from "@/app/_components/header/Header";
import { SignOutButton, UserButton } from "@clerk/nextjs";

export default function Profile() {
    return (
        <div className="h-full w-full">
        <div className="bg-[#001F3F]">
            <Header />
        </div>
            Hello
            <UserButton/>
            <SignOutButton/>
        </div>
    )
}
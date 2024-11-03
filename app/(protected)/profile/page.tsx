import { SignOutButton, UserButton } from "@clerk/nextjs";

export default function Profile() {
    return (
        <div>
            Hello
            <UserButton/>
            <SignOutButton/>
        </div>
    )
}
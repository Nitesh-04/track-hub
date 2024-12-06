"use client"
import { checkUser } from "./_actions/actions";
import Upcoming from "./_components/Upcoming";
import Header from "@/app/_components/header/Header";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Recents from "./_components/Recents";


export default function Dashboard() {
  const { user } = useUser();
  const router = useRouter();
  if (!user) {
    router.push("/sign-in");
    return;
  }
  checkUser(
    user.id,
    user.primaryEmailAddress?.emailAddress || '',
    user.fullName || ''
  );

  return (
    <div className="h-full w-full">
      <div className="mb-10 bg-[#001F3F] "><Header/></div>
      <Upcoming />
      <Recents />
    </div>
  );
}
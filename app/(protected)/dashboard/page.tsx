"use client"
import { checkUser } from "./_actions/actions";
import Upcoming from "./_components/Upcoming";
import Header from "@/app/_components/header/Header";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Recents from "./_components/Recents";
import { useEffect } from "react";


export default function Dashboard() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/sign-in");
      return;
    }

    checkUser(
      user.id,
      user.primaryEmailAddress?.emailAddress || "",
      user.fullName || ""
    );
  }, [user]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("enabledAutomation") === "true") {
      fetch("/api/gmail/watch", { method: "POST" });
      console.log("Gmail watch requested");
    }
  }, []);


  return (
    <div className="h-full w-full">
      <div className="mb-10 bg-[#001F3F] "><Header/></div>
      <Upcoming />
      <Recents />
    </div>
  );
}
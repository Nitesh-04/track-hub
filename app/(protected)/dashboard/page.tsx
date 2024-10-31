"use client"
import { registerUser } from "@/app/actions";
import Graph from "@/app/_components/dashboard/Graph";
import Recents from "@/app/_components/dashboard/Recents";
import Upcoming from "@/app/_components/dashboard/Upcoming";
import Header from "@/app/_components/header/Header";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export default function Dashboard() {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      registerUser(
        user.id,
        user.primaryEmailAddress?.emailAddress || '',
        user.fullName || ''
      );
    }
  }, [user]);

  return (
    <div className="h-full w-full">
      <div className="mb-10 bg-[#001F3F] "><Header/></div>
      <Upcoming />
      <div className="flex flex-col md:flex-row">
        <Recents />
        <Graph />
      </div>
    </div>
  );
}
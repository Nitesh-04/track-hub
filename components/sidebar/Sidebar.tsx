"use client"
import Link from "next/link";
import { NotebookPenIcon, UserIcon, EyeIcon, PlusCircleIcon, SettingsIcon, LogOutIcon } from "lucide-react"; // Import appropriate icons from Lucide
import { useState } from "react";

export default function Sidebar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div>
      {/* Sidebar for laptops */}
      <div className="hidden md:flex flex-col w-64 h-screen bg-[#001F3F] text-[#8dd2f2] p-4 fixed top-0 left-0">
        <div className="flex items-center gap-2 p-4">
          <NotebookPenIcon className="w-8 h-8 text-[#8dd2f2]" />
          <span className="text-xl font-bold">My App</span>
        </div>
        <nav className="mt-10">
          <ul className="space-y-6">
            <li>
              <Link href="/profile" className="flex items-center gap-3 text-[#8dd2f2] hover:text-[#a3d6eb]">
                <UserIcon className="w-5 h-5" />
                <span>Profile</span>
              </Link>
            </li>
            <li>
              <Link href="/view" className="flex items-center gap-3 text-[#8dd2f2] hover:text-[#a3d6eb]">
                <EyeIcon className="w-5 h-5" />
                <span>View</span>
              </Link>
            </li>
            <li>
              <Link href="/create" className="flex items-center gap-3 text-[#8dd2f2] hover:text-[#a3d6eb]">
                <PlusCircleIcon className="w-5 h-5" />
                <span>Create</span>
              </Link>
            </li>
            <li>
              <Link href="/settings" className="flex items-center gap-3 text-[#8dd2f2] hover:text-[#a3d6eb]">
                <SettingsIcon className="w-5 h-5" />
                <span>Settings</span>
              </Link>
            </li>
            <li>
              <Link href="/signout" className="flex items-center gap-3 text-[#8dd2f2] hover:text-[#a3d6eb]">
                <LogOutIcon className="w-5 h-5" />
                <span>Sign Out</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Topbar for mobile */}
      <div className="md:hidden bg-[#001F3F] fixed bottom-0 left-0 right-0 z-50 flex justify-around p-2">
        <Link href="/profile">
          <UserIcon className="w-6 h-6 text-[#8dd2f2]" />
        </Link>
        <Link href="/view">
          <EyeIcon className="w-6 h-6 text-[#8dd2f2]" />
        </Link>
        <Link href="/create">
          <PlusCircleIcon className="w-6 h-6 text-[#8dd2f2]" />
        </Link>
        <Link href="/settings">
          <SettingsIcon className="w-6 h-6 text-[#8dd2f2]" />
        </Link>
        <Link href="/signout">
          <LogOutIcon className="w-6 h-6 text-[#8dd2f2]" />
        </Link>
      </div>
    </div>
  );
}

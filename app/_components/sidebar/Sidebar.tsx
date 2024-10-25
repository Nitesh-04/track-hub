"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, PlusCircle, Settings, User } from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/search", icon: Search, label: "Search" },
  { href: "/create", icon: PlusCircle, label: "Create" },
  { href: "/profile", icon: User, label: "Profile" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div>
      <div className="hidden z-20 lg:flex flex-col items-center justify-start w-28 h-screen bg-[#001F3F] fixed top-0 left-0 py-8">
        <nav className="mt-14">
          <ul className="space-y-8">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <li key={index} className="transition-transform hover:scale-105">
                  <Link href={item.href} className="group flex flex-col items-center" prefetch={true}>
                    <div className={`p-3 rounded-full ${isActive ? "bg-blue-100" : "bg-white group-hover:bg-blue-100"} transition-colors duration-200`}>
                      <item.icon className={`w-6 h-6 ${isActive ? "text-blue-500" : "text-gray-600 group-hover:text-blue-500"}`} />
                    </div>
                    <span className={`mt-1 text-xs ${isActive ? "text-blue-200" : "text-white group-hover:text-blue-200"}`}>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div className="lg:hidden h-20 bg-[#001F3F] fixed bottom-0 left-0 right-0 z-50 shadow-lg">
        <nav className="flex justify-evenly items-center h-full">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link key={index} href={item.href} className="flex flex-col items-center">
                <item.icon className={`w-6 h-6 ${isActive ? "text-blue-500" : "text-slate-100"}`} />
                <span className={`mt-1 text-xs ${isActive ? "text-blue-500" : "text-slate-100"}`}>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
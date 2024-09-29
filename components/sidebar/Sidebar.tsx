"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, PlusCircle, Settings, User } from "lucide-react";

const navItems = [
  { href: "/home", icon: Home, label: "Home" },
  { href: "/search", icon: Search, label: "Search" },
  { href: "/create", icon: PlusCircle, label: "Create" },
  { href: "/settings", icon: Settings, label: "Settings" },
  { href: "/profile", icon: User, label: "Profile" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div>
      <div className="hidden lg:flex flex-col items-center justify-center w-28 h-screen bg-[#E6F3FF] fixed top-0 left-0 py-8">
        <nav>
          <ul className="space-y-8">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <li key={index}>
                  <Link href={item.href} className="group flex flex-col items-center">
                    <div className={`p-3 rounded-full ${isActive ? 'bg-blue-100' : 'bg-white group-hover:bg-blue-100'} transition-colors duration-200`}>
                      <item.icon className={`w-6 h-6 ${isActive ? 'text-blue-500' : 'text-gray-600 group-hover:text-blue-500'}`} />
                    </div>
                    <span className={`mt-1 text-xs ${isActive ? 'text-blue-500' : 'text-gray-500 group-hover:text-blue-500'}`}>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div className="lg:hidden h-20 bg-[#E6F3FF] fixed bottom-0 left-0 right-0 z-50 shadow-lg">
        <nav className="flex justify-evenly items-center pt-5">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link key={index} href={item.href} className="flex flex-col items-center">
                <item.icon className={`w-6 h-6 ${isActive ? 'text-blue-500' : 'text-gray-600'}`} />
                <span className={`mt-1 text-xs ${isActive ? 'text-blue-500' : 'text-gray-500'}`}>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
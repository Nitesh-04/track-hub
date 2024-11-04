import Sidebar from "@/app/_components/sidebar/Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { ReactNode } from "react";

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="bg-slate-50 min-h-screen relative">
        
            <Sidebar />
            <div className="flex flex-col flex-1 lg:ml-28 relative z-20">
                <main className="flex-1 overflow-auto mt-5 min-h-screen">
                    {children}
                </main>
                <Toaster/>
            </div>
        </div>
    );
}
import Sidebar from "@/components/sidebar/Sidebar";
import GridPattern from "@/components/ui/animated-grid-pattern";
import { ReactNode } from "react";

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="bg-slate-50 min-h-screen    relative">
            <GridPattern
                className="absolute inset-0 z-0 opacity-55"
                numSquares={1000}
                repeatDelay={0.5}
                duration={1}
                maxOpacity={0.15}
            />
            <Sidebar />
            <div className="flex flex-col flex-1 lg:ml-28 relative z-20">
                <main className="flex-1 overflow-auto p-4 mt-5 mb-20 lg:mb-0">
                    {children}
                </main>
            </div>
        </div>
    );
}
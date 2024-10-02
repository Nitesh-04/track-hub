import Graph from "@/components/home/Graph";
import Recents from "@/components/home/Recents";
import Upcoming from "@/components/home/Upcoming";
import Sidebar from "@/components/sidebar/Sidebar";
import GridPattern from "@/components/ui/animated-grid-pattern";

export default function Home() {
  return (
    <div className="bg-slate-50 min-h-screen relative">
      <GridPattern
        className="absolute inset-0 z-0 opacity-55"
        numSquares={1000}
        repeatDelay={0.5}
        duration={1}
        maxOpacity={0.15}
      />
      <Sidebar />
      <Upcoming />
      <div className="flex flex-col md:flex-row lg:gap-14 md:gap-0 gap-0 relative z-10">
        <Recents />
        <Graph />
      </div>
    </div>
  );
}

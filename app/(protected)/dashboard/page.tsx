import Graph from "@/components/dashboard/Graph";
import Recents from "@/components/dashboard/Recents";
import Upcoming from "@/components/dashboard/Upcoming";
import Header from "@/components/header/Header";

export default function Home() {
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
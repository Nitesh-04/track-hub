import Graph from "@/app/_components/dashboard/Graph";
import Recents from "@/app/_components/dashboard/Recents";
import Upcoming from "@/app/_components/dashboard/Upcoming";
import Header from "@/app/_components/header/Header";

export default function Dashboard() {
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
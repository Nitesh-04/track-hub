import { Input } from "@/components/ui/input";

export default function View() {
  return (
    <div className="h-full w-full">
      <div className="flex gap-0 p-10">
        <Input className="w-1/4 mx-auto" type="text" placeholder="Search" />
      </div>
    </div>
  );
}
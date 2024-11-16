import GridPattern from "@/components/ui/animated-grid-pattern";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return(
    <div className="relative h-screen w-full">
      <div className="flex items-center justify-center mx-auto py-4"><SignUp/></div>
    </div>
  );
}
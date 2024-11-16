import GridPattern from "@/components/ui/animated-grid-pattern";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return(
    <div className="relative h-screen w-full">
      <div className="w-1/2 flex items-center justify-center mx-auto py-14"><SignIn/></div>
    </div>
  );
}
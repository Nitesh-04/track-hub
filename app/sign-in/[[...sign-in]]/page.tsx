import GridPattern from "@/components/ui/animated-grid-pattern";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return(
    <div className="relative h-screen w-full">
      <GridPattern
                className="absolute inset-0 z-0 opacity-55"
                numSquares={1000}
                repeatDelay={0.5}
                duration={1}
                maxOpacity={0.15}
            />
      <div className="w-1/2 flex items-center justify-center mx-auto py-14"><SignIn/></div>
    </div>
  );
}
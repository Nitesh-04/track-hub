import GridPattern from "@/components/ui/animated-grid-pattern";
import WordFadeIn from "@/components/ui/word-fade-in";
import { Poppins } from "next/font/google";
import Features from "@/components/landing/Features";
import Header from "@/components/landing/Header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NotebookPenIcon } from "lucide-react";
import HowItWorksCarousel from "@/components/landing/HowItWorks";
import Image from "next/image";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
});


export default function Home() {

  return (
    <div className="min-h-screen relative w-full bg-[#e3e3e3]">
      <GridPattern
        className="absolute inset-0 z-0"
        numSquares={500}
        repeatDelay={0.5}
        duration={1}
        maxOpacity={0.15}
      />
      <header className="relative flex bg-[#001F3F] z-10 justify-between px-10 py-2">
        <NotebookPenIcon className="text-[#8dd2f2] md:mt-0 mt-1"/>
          <Header/>
      </header>
      <div className="relative z-10 mt-56 md:mt-28 mb-56 md:mb-48 px-8 md:px-20 flex items-center justify-center md:gap-20">
        <div className={` w-full ${poppins.className} flex flex-col items-center justify-center`}>
          <div className="flex flex-col items-center justify-center text-center font-bold text-4xl md:text-6xl">
            <WordFadeIn className="text-[#18426d]" words="Where Did You Apply ?" delay={0.25}/>
            <p className={` text-[#001F3F] text-sm  md:text-lg mt-5 md:mt-0 mb-2 ${poppins.className}`}>Your ultimate destination for tracking internship applications.</p>
            <Link href={"/sign-up"} className="">
              <Button className="bg-[#001F3F]">Get Started</Button>
            </Link>
          </div>
        </div>
        <div>
          <Image className="hidden md:block" height={800} width={800} src="./hero.svg" alt="Landing Page Image"/>
        </div>
      </div>
      <div id="features">
        <Features/>
      </div>
      <div id="how-it-works">
        <HowItWorksCarousel/>
      </div>
    </div>
  );
}

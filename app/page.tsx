"use client"

import GridPattern from "@/components/ui/animated-grid-pattern";
import { Poppins } from "next/font/google";
import Features from "@/app/_components/landing/Features";
import Header from "@/app/_components/landing/Header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import HowItWorksCarousel from "@/app/_components/landing/HowItWorks";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import AboutUs from "./_components/landing/AboutUs";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
});


export default function Home() {

  const router = useRouter();
  const { user } = useUser();

  if(user && user.id)
  {
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen relative w-full bg-[#e3e3e3]">
      <GridPattern
        className="absolute inset-0 z-0"
        numSquares={1000}
        repeatDelay={0.5}
        duration={0.75}
        maxOpacity={0.15}
      />
      <header className="relative bg-[#001F3F] z-10 px-6 md:px-10 py-2">
          <Header/>
      </header>
      <div className="relative z-10 min-h-screen flex px-10 items-center justify-center lg:gap-20">
        <div className={` w-full ${poppins.className} flex flex-col items-center justify-center`}>
          <div className="flex text-[#18426d] flex-col items-center justify-center text-center font-bold text-4xl md:text-6xl">
            <p className="text-5xl">Track your <span className="text-[#47829d]">journey</span></p>
            <p className="text-5xl"><span className="text-[#47829d]">to success</span> with ease.</p>
            <p className={` text-[#001F3F] text-sm md:text-lg mt-5 mb-2 ${poppins.className}`}>Your ultimate destination for tracking internship applications.</p>
            <div className="flex gap-4">
              <Link href={"/sign-up"}>
                <Button className="bg-[#001F3F]">Get Started</Button>
              </Link>
              <Link href={"/sign-in"}>
                <Button className="bg-[#001F3F]">Sign in</Button>
              </Link>
            </div>
          </div>
        </div>
        <div>
          <Image className="hidden md:hidden lg:block" height={1000} width={1000} src="./hero.svg" alt="Landing Page Image"/>
        </div>
      </div>
      <div id="features">
        <Features/>
      </div>
      <div id="howitworks">
        <HowItWorksCarousel/>
      </div>
      <div id="aboutus">
        <AboutUs/>
      </div>
    </div>
  );
}

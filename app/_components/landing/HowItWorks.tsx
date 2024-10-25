"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ArrowRight } from "lucide-react";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import { LockClosedIcon,FileTextIcon, BellIcon, FilePlusIcon, CrumpledPaperIcon } from "@radix-ui/react-icons";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function HowItWorksCarousel() {
  const steps = [
    {
      title: "1. Sign in Securely",
      description: "Use secure Google authentication to easily sign in.",
      icon: <LockClosedIcon className="w-6 h-6 text-[#001F3F]"/>,
    },
    {
      title: "2. Create Applications",
      description: "Add details about your applications in one place.",
      icon: <FilePlusIcon className="w-6 h-6 text-[#001F3F]"/>,
    },
    {
      title: "3. Toggle Reminders",
      description: "Set and toggle reminders for your upcoming applications.",
      icon: <BellIcon className="w-6 h-6 text-[#001F3F]"/>,
    },
    {
      title: "4. View Upcoming Events",
      description: "Easily view all your upcoming application deadlines.",
      icon: <FileTextIcon className="w-6 h-6 text-[#001F3F]"/>,
    },
    {
      title: "5. Edit or Delete Applications",
      description: "To add or remove applications, simply edit or delete them.",
      icon: <CrumpledPaperIcon className="w-6 h-6 text-[#001F3F]"/>,
    },
  ];

  return (
    <div className={`w-full ${poppins.className} py-12 mt-10`}>
      <h2 className="text-center text-3xl font-bold text-[#001F3F] mb-0">
        How It Works
      </h2>
      <p
        className="mt-4 text-center font-bold text-[#001F3F] block md:block lg:hidden w-full mx-auto"
      >
        Swipe <ArrowRight className="inline-block w-4 h-4" />
      </p>
      <Carousel className="w-full max-w-3xl mx-auto">
        <CarouselContent>
          {steps.map((step, index) => (
            <CarouselItem key={index}>
              <div className="p-4">
                <Card className="text-[#001F3F] bg-[#e3e3e3] border-2 border-slate-800 shadow-lg rounded-lg">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <h3 className="md:text-2xl flex gap-2 md:gap-4 text-lg font-semibold text-[#001F3F] mb-2">
                      {step.title}
                      {step.icon}
                    </h3>
                    <p className="text-center md:text-lg text-[#001F3F]">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:hidden lg:flex  border-[#001F3F] text-[#b1ddf1] bg-[#001F3F] hover:text-[#b1ddf1] hover:bg-[#001F3F]" />
        <CarouselNext className="hidden md:hidden lg:flex  border-[#001F3F] text-[#b1ddf1] bg-[#001F3F] hover:text-[#b1ddf1] hover:bg-[#001F3F]" />
      </Carousel>
      <Link href={"/sign-up"} className="z-10 relative w-full block mx-auto text-center md:mt-8">
        <Button className="bg-[#001F3F]">Get Started</Button>
      </Link>
    </div>
  );
}

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
import { Button } from "../ui/button";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function HowItWorksCarousel() {
  const steps = [
    {
      title: "1. Sign in Securely 🛜",
      description: "Use secure Google authentication to easily sign in.",
    },
    {
      title: "2. Create Applications 🖊️",
      description: "Add details about your applications in one place.",
    },
    {
      title: "3. Toggle Reminders 🔕",
      description: "Set and toggle reminders for your upcoming applications.",
    },
    {
      title: "4. View Upcoming Applications 📝",
      description: "Easily view all your upcoming application deadlines.",
    },
    {
      title: "5. Edit or Delete Applications 🚮",
      description: "To add or remove applications, simply edit or delete them.",
    },
  ];

  return (
    <div className={`w-full ${poppins.className} py-12 mt-10`}>
      <h2 className="text-center text-3xl font-bold text-[#001F3F] mb-0">
        How It Works
      </h2>
      <p
        className="mt-4 text-center font-bold text-[#001F3F] block md:hidden w-full mx-auto"
      >
        Swipe <ArrowRight className="inline-block w-4 h-4" />
      </p>
      <Carousel className="w-full max-w-3xl mx-auto">
        <CarouselContent>
          {steps.map((step, index) => (
            <CarouselItem key={index}>
              <div className="p-4">
                <Card className="bg-[#ebdbb6] border-2 border-[#001F3F] shadow-lg rounded-lg transition-transform hover:scale-95">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <h3 className="text-2xl font-semibold text-[#001F3F] mb-2">
                      {step.title}
                    </h3>
                    <p className="text-center text-lg text-gray-700">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex text-[#001F3F] bg-[#EAD8B1] border-[#001F3F] hover:bg-[#EAD8B1]" />
        <CarouselNext className="hidden md:flex text-[#001F3F] bg-[#EAD8B1] border-[#001F3F] hover:bg-[#EAD8B1]" />
      </Carousel>
      <Link href={"/sign-up"} className="z-10 relative w-full block mx-auto text-center md:mt-8">
        <Button className="bg-[#001F3F]">Get Started</Button>
      </Link>
    </div>
  );
}

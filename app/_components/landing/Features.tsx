"use client";
import { Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import { Poppins } from "next/font/google";
import { FileTextIcon, PlusIcon, BellIcon, BarChartIcon } from "@radix-ui/react-icons";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function Features() {
  const features = [
    {
      title: "Track Applications",
      description: "Easily track all your internship applications in one place.",
      icon : <FileTextIcon className="w-6 h-6 text-[#001F3F]"/>
    },
    {
        title: "Add Rounds",
        description: "Add rounds of interviews and tests for each application.",
        icon : <PlusIcon className="w-6 h-6 text-[#001F3F]"/>
      },
    {
      title: "Get Reminders",
      description: "Get reminders for your upcoming coding and interview rounds.",
      icon : <BellIcon className="w-6 h-6 text-[#001F3F]"/>
    },
    {
      title: "Status Updates",
      description: "Update the status of each application and follow your progress.",
      icon : <BarChartIcon className="w-6 h-6 text-[#001F3F]"/>
    },
  ];

  return (
    <div className="relative z-10 mt-16 px-6 md:px-10 flex flex-col items-center">
      <div className={`text-center text-[#001F3F] font-bold text-3xl ${poppins.className} mb-4`}>
        Features
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {features.map((feature, index) => (
          <Card key={index} className="text-[#001F3F] bg-[#e3e3e3] border-2 border-[#001F3F] shadow-lg rounded-lg transition-transform hover:scale-105">
            <CardHeader>
              <CardTitle className={`text-[#001F3F] flex justify-between text-lg ${poppins.className} font-bold`}>
                {feature.title}
                {feature.icon}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-[#001F3F]">
              <p className={`${poppins.className}`}>{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

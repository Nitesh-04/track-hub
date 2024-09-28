"use client";
import { Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function Features() {
  const features = [
    {
      title: "Track Applications 📜",
      description: "Easily track all your internship applications in one place.",
    },
    {
        title: "Add Rounds ➕",
        description: "Add rounds of interviews and tests for each application.",
      },
    {
      title: "Set Reminders 🔔",
      description: "Set reminders for your upcoming coding and interview rounds.",
    },
    {
      title: "Status Updates 📈",
      description: "Update the status of each application and follow your progress.",
    },
  ];

  return (
    <div className="relative z-10 mt-16 px-6 md:px-10 flex flex-col items-center">
      <div className={`text-center text-[#001F3F] font-bold text-3xl ${poppins.className} mb-4`}>
        Features
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
        {features.map((feature, index) => (
          <Card key={index} className="bg-[#ebdbb6] border-2 border-[#001F3F] shadow-lg rounded-lg transition-transform hover:scale-105">
            <CardHeader>
              <CardTitle className={`text-[#001F3F] text-lg ${poppins.className} font-bold`}>
                {feature.title}
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

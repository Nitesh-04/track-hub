"use client";

import { Poppins } from "next/font/google";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Application } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { MapPinIcon, Bell, BellOff, PenLine } from "lucide-react";
import Link from "next/link";
import { fetchRecentApplicationsByUser } from "../_actions/actions";
import Header from "../../../_components/header/Header";
import SkeletonCard from "./LoadSkeleton";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function Recents() {
  const router = useRouter();
  const { user } = useUser();
  const [applications,setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/sign-in");
      return;
    }

    const userId = user.id;

    async function fetchData() {
      setIsLoading(true);
      try {
        const data = await fetchRecentApplicationsByUser(userId);
        if (!data) {
          throw new Error("Rounds not found");
        }
        setApplications(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [user, router]);


  if (isLoading) {
    return (
      <div className="h-full w-full">
        <div className="mb-14 bg-[#001F3F]">
          <Header />
        </div>
        <div className="container mx-auto px-4">
          <SkeletonCard/>
        </div>
      </div>
    );
  }

  return (
    <div className="md:px-14 md:py-2 py-0 px-6 pt-2 mt-4">
      <p
        className={`font-semibold text-[#001F3F] text-xl md:text-[20px] mb-4 ${poppins.className}`}
      >
       Recent Applications
      </p>
      {applications.length === 0 ? (
        <div className="w-full h-44 py-2 flex flex-col md:flex-row gap-4 items-center justify-center px-4 bg-slate-50 rounded-xl border-2 border-dashed border-[#001F3F]/20">
          <PenLine className="w-5 h-5 text-[#001F3F]/30" />
          <h3 className="text-xl font-semibold text-[#001F3F] md:mr-20">
            No Applications Created
          </h3>
          <Link
            href="/create"
            className="px-4 py-2 md:mt-0 mt-2 md:mb-0 mb-2 bg-slate-100 text-[#001F3F] rounded-lg border-2 border-dashed border-[#001F3F]/20  transition-colors"
          >
            Create a New Application
          </Link>
        </div>
      ) : (
        <Carousel>
          <CarouselContent>
            {applications.map((application) => (
              <CarouselItem
                key={application.id}
                className="md:basis-1/2 lg:basis-1/3"
              >
                <Link key={application.id} href={`view/${application.id}`}>
                <div className="w-full h-auto bg-white hover:bg-slate-50 transition-all duration-300 border-2 border-[#001F3F]/10 hover:border-[#001F3F] rounded-xl shadow-sm hover:shadow-md p-6">
                  <div className="text-xl font-semibold text-[#001F3F] flex justify-between">
                    <p className="truncate">{application.companyName}</p>
                    <p>{application.notifications ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}</p>
                  </div>
                  <div className="flex md:flex-row gap-2 mt-2">
                    <Badge variant="outline" className="w-fit border-[#001F3F]/30 text-[#001F3F] font-medium">{application.role}</Badge>
                    <Badge className="bg-[#001F3F] text-slate-100 w-fit">
                      <MapPinIcon className="w-3 h-3 mr-2" />
                      {application.location}
                    </Badge>
                  </div>
                  <div className="mt-4">
                    <p>Stipend: {application.stipend ? `₹${application.stipend} / month` : "N/A"}</p>
                  </div>
                  <div className="mt-2 flex justify-between">
                    <p className="text-sm">CTC: {application.ctc ? `₹${application.ctc}` : "N/A"}</p>
                  </div>
                </div>
              </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="md:flex hidden" />
          <CarouselNext className="md:flex hidden" />
        </Carousel>
      )}
    </div>
  );
}

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
import { RoundWithApplication as Round } from "@/lib/types";
import { fetchUpcomingRoundsByUser } from "@/app/actions";
import Header from "../header/Header";
import { Badge } from "@/components/ui/badge";
import { MapPinIcon, Calendar, Clock } from "lucide-react";
import { differenceInDays, differenceInHours, differenceInMinutes, format } from "date-fns";
import Link from "next/link";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function Upcoming() {
  const router = useRouter();
  const { user } = useUser();
  const [rounds, setRounds] = useState<Round[]>([]);
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
        const data = await fetchUpcomingRoundsByUser(userId);
        if (!data) {
          throw new Error("Rounds not found");
        }
        setRounds(data);
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
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#001F3F]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="md:px-14 md:py-2 py-0 px-6 pt-2 mt-12">
      <p
        className={`font-bold text-[#001F3F] text-xl md:text-2xl mb-4 ${poppins.className}`}
      >
        Upcoming rounds
      </p>
      {rounds.length === 0 ? (
        <div className="w-full h-40 py-2 flex flex-col md:flex-row gap-4 items-center justify-center px-4 bg-slate-50 rounded-xl border-2 border-dashed border-[#001F3F]/20">
          <Calendar className="w-10 h-10 text-[#001F3F]/30" />
          <h3 className="text-xl font-semibold text-[#001F3F] md:mr-20">
            No Upcoming Rounds
          </h3>
          <Link
            href="/search"
            className="px-4 py-2 md:mt-0 mt-2 md:mb-0 mb-2 bg-slate-100 text-[#001F3F] rounded-lg border-2 border-dashed border-[#001F3F]/20 transition-colors"
          >
            View All Applications
          </Link>
        </div>
      ) : (
        <Carousel>
          <CarouselContent>
            {rounds.map((round) => (
              <CarouselItem
                key={round.id}
                className="md:basis-1/2 lg:basis-1/3"
              >
                <Link href={`/view/${round.application.id}`} passHref>
                  <div className="group w-full h-full bg-white hover:bg-slate-50 transition-all duration-300 border-2 border-[#001F3F]/10 hover:border-[#001F3F] rounded-xl shadow-sm hover:shadow-md p-4">
                    <div className="flex flex-col gap-2 pb-4">
                      <h3 className="text-xl font-bold text-[#001F3F] group-hover:text-[#001F3F]/80 transition-colors">
                        {round.application.companyName}
                      </h3>
                      <div className="flex gap-4">
                        <Badge
                          variant="outline"
                          className="w-fit border-[#001F3F]/30 bg-[#001F3F] text-slate-100"
                        >
                          {round.roundTitle}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="w-fit border-[#001F3F]/30 text-[#001F3F] font-medium"
                        >
                          {round.application.role}
                        </Badge>
                      </div>
                    </div>

                    <div className="">
                      <div className="flex items-center text-sm text-gray-600 hover:text-[#001F3F] transition-colors">
                        <Calendar className="w-4 h-4 mr-3 text-[#001F3F]/70" />
                        <span className="font-medium">
                          {format(
                            new Date(round.roundDateTime),
                            "MMM dd, yyyy"
                          )}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 hover:text-[#001F3F] transition-colors">
                        <Clock className="w-4 h-4 mr-3 text-[#001F3F]/70" />
                        <span className="font-medium">
                          {format(new Date(round.roundDateTime), "hh:mm a")}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 hover:text-[#001F3F] transition-colors">
                        <MapPinIcon className="w-4 h-4 mr-3 text-[#001F3F]/70" />
                        <span className="font-medium">{round.venue}</span>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                      <span className="text-xs font-medium text-gray-500">
                        {(() => {
                          const daysDiff = differenceInDays(
                            new Date(round.roundDateTime),
                            new Date()
                          );
                          const hoursDiff = differenceInHours(
                            new Date(round.roundDateTime),
                            new Date()
                          );
                          const minutesDiff = differenceInMinutes(
                            new Date(round.roundDateTime),
                            new Date()
                          );

                          if (daysDiff === 0) {
                            if (hoursDiff === 0) {
                              return `Upcoming in ${minutesDiff} ${
                                minutesDiff === 1 ? "minute" : "minutes"
                              }`;
                            }
                            return `Upcoming in ${hoursDiff} ${
                              hoursDiff === 1 ? "hour" : "hours"
                            }`;
                          }
                          return `Upcoming in ${daysDiff} ${
                            daysDiff === 1 ? "day" : "days"
                          }`;
                        })()}
                      </span>
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
      {rounds.length > 0 && (
        <p
          className={`md:hidden flex text-bold text-xs text-[#001F3F] justify-center mt-2 ${poppins.className}`}
        >
          Swipe to see more {`>`}
        </p>
      )}
    </div>
  );
}

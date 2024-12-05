"use client";

import { useEffect, useState } from "react";
import Header from "@/app/_components/header/Header";
import { Badge } from "@/components/ui/badge";
import { fetchApplicationByUser } from "@/app/actions";
import { Bell, BellOff, MapPinIcon, PenLine } from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Application } from "@/lib/types";
import { SearchSkeletonCard } from "@/app/_components/search/SearchSkeleton";

export default function Search() {
  const router = useRouter();
  const { user } = useUser();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/sign-in");
      return;
    }

    const userId = user.id;

    async function fetchData() {
      setIsLoading(true);
      try {
        const data = await fetchApplicationByUser(userId);
        if (!data) {
          throw new Error("Applications not found");
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
        <div className="container mx-auto px-4 py-8">
          <SearchSkeletonCard/>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <div className="bg-[#001F3F]">
        <Header />
      </div>
      <div className="pt-20 flex justify-center">
        <input
          className="md:w-2/5 w-3/4 border border-[#001F3F] rounded-md p-2"
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {applications.length === 0 ? (
        <div className="px-10 lg:px-20 mt-20">
        <div className="px-4 w-full h-40 py-8 flex flex-col md:flex-row gap-4 items-center justify-center bg-slate-50 rounded-xl border-2 border-dashed border-[#001F3F]/20">
          <PenLine className="w-10 h-10 text-[#001F3F]/30" />
          <h3 className="text-xl font-semibold text-[#001F3F] md:mr-20">
            No Applications Created
          </h3>
          <Link
            href="/create"
            className="px-4 py-2 md:mt-0 mt-2 md:mb-0 mb-2 bg-[#001F3F] text-white rounded-lg hover:bg-[#001F3F]/90 transition-colors"
          >
            Create a New Application
          </Link>
        </div>
        </div>
      ) : (
      <div className="container mx-auto px-4 md:px-8 py-8 mt-2 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications
            .filter((application) =>
              application.companyName.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((application) => (
              <Link key={application.id} href={`view/${application.id}`}>
                <div className="w-full h-auto bg-white hover:bg-slate-50 transition-all duration-300 border-2 border-[#001F3F]/10 hover:border-[#001F3F] rounded-xl shadow-sm hover:shadow-md p-6">
                  <div className="text-xl font-semibold text-[#001F3F] flex justify-between">
                    <p className="truncate">{application.companyName}</p>
                    <p>{application.notifications ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}</p>
                  </div>
                  <div className="flex space-x-2 mt-2">
                    <Badge className="bg-[#001F3F] text-slate-100">{application.role}</Badge>
                    <Badge className="bg-[#001F3F] text-slate-100">
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
            ))}
        </div>
      </div>
      )}
    </div>
  );
}

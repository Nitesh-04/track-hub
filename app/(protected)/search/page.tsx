"use client";

import { useEffect, useState } from "react";
import Header from "@/app/_components/header/Header";
import { Badge } from "@/components/ui/badge";
import { fetchApplicationByUser } from "@/app/actions";
import { Bell, BellOff, MapPinIcon } from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Application } from "@/lib/types";

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
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#001F3F]"></div>
          </div>
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
      <div className="container mx-auto px-4 md:px-8 py-8 mt-2 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications
            .filter((application) =>
              application.companyName.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((application) => (
              <Link key={application.id} href={`view/${application.id}`}>
                <div className="w-full h-auto bg-slate-100 transition-transform hover:scale-105 border border-[#001F3F] rounded-lg shadow-md p-6">
                  <div className="text-xl font-semibold text-[#001F3F] flex justify-between">
                    <p>{application.companyName}</p>
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
    </div>
  );
}

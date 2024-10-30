"use client"

import { useEffect, useState } from "react";
import Header from "@/app/_components/header/Header";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchApplicationByUser } from "@/app/actions";
import { Link as LinkIcon,Bell,BellOff, MapPinIcon } from "lucide-react";
import Link from "next/link";

interface Application {
  id: string;
  companyName: string;
  stipend: number | null;
  ctc: number | null;
  role: string;
  location: string;
  link?: string | null;
  notifications: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function Search() {
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    async function fetchData() {
      const data = await fetchApplicationByUser("1010");
      setApplications(data);
    }
    fetchData();
  }, []);

  return (
    <div className="h-full w-full">
      <div className="bg-[#001F3F]">
        <Header />
      </div>
      <div className="pt-20">
        <Input className="md:w-2/5 w-3/4 mx-auto border-[#001F3F]" type="text" placeholder="Search" />
      </div>
      <div className="container mx-auto px-8 py-8 mt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((application) => (
            <Link href={`view/${application.id}`}>
              <Card key={application.id} className="w-full h-auto transition-transform hover:scale-105 border-[#001F3F]">
              <CardContent className="p-6">
                <div className="text-xl font-semibold text-[#001F3F] flex justify-between">
                  <p>{application.companyName}</p>
                  <p>{application.notifications ? <Bell className="w-4 h-4"/> : <BellOff className="w-4 h-4"/>}</p>
                </div>
                <div className="flex space-x-2 mt-2">
                  <Badge className="bg-[#001F3F] text-slate-100">{application.role}</Badge>
                  <Badge className="bg-[#001F3F] text-slate-100"><MapPinIcon className="w-3 h-3 mr-2"/>{application.location}</Badge>
                </div>
                <div className="mt-4">
                  <p>Stipend: {application.stipend? `₹${application.stipend} / month` : "N/A"}</p>
                </div>
                <div className="mt-2 flex justify-between">
                  <p className="text-sm">CTC: {application.ctc ? `₹${application.ctc}` : "N/A"}</p>
                  {application.link && (
                  <div className="flex justify-end">
                    <LinkIcon href={application.link} className="text-[#001F3F]">
                      View Application
                    </LinkIcon>
                  </div>
                )}
                </div>
              </CardContent>
            </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

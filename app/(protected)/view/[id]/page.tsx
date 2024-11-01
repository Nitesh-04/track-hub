"use client";

import React, { useState, useEffect } from "react";
import Header from "@/app/_components/header/Header";
import { Badge } from "@/components/ui/badge";
import { MapPinIcon, LinkIcon } from "lucide-react";
import { Poppins } from "next/font/google";
import { AddRoundDialog } from "@/app/(protected)/view/_components/AddRound";
import { RoundsList } from "@/app/(protected)/view/_components/RoundsList";
import EditApplication from "@/app/(protected)/view/_components/EditApplication";
import { fetchApplicationById, createRound, fetchRoundByApplicationId } from "@/app/actions";
import { RoundData } from "@/app/actions";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
});

interface Application {
  id: string;
  companyName: string;
  stipend: number | null;
  ctc: number | null;
  role: string;
  location: string;
  link: string | null;
  notifications: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Round {
  id: string;
  roundTitle: string;
  roundDateTime: Date;
  venue: string;
  roundLink: string | null;
  status: "upcoming" | "completed";
  applicationId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function ApplicationView({
  params,
}: {
  params: { id: string };
}) {

  const { user } = useUser();
  if(!user)
  {
    redirect("/sign-in");
  }

  const { id: applicationId } = params;
  const userId = user.id;

  const [application, setApplication] = useState<Application | null>(null);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [applicationId]);

  async function fetchData() {
    setIsLoading(true);
    try {
      if (!applicationId) {
        throw new Error("Application ID is required");
      }

      const appData = await fetchApplicationById(applicationId);
      if (!appData) {
        throw new Error("Application not found");
      }
      setApplication(appData);

      await fetchRoundData();
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchRoundData() {
    try {
      const roundsData = await fetchRoundByApplicationId(applicationId);
      const typedRoundsData = roundsData.map((round) => ({
        ...round,
        status: round.status as "upcoming" | "completed",
      }));
      setRounds(typedRoundsData);
    } catch (error) {
      console.error("Error fetching rounds:", error);
    }
  }

  async function fetchApplicationData() {
    try {
      const applicationData = await fetchApplicationById(applicationId);
      setApplication(applicationData);
    } catch (error) {
      console.error("Error fetching application:", error);
    }
  }

  const handleAddRound = async (roundData: RoundData) => {
    try {
      await createRound(roundData, applicationId, userId);
      await fetchRoundData();
    } catch (error) {
      console.error("Error adding round:", error);
    }
  };

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
      <div className="mb-8 bg-[#001F3F]">
        <Header />
      </div>
      <div className="container mx-auto px-4 md:px-8 py-7">
        <h2
          className={`text-2xl font-semibold mb-4 text-[#001F3F] ${poppins.className}`}
        >
          Application
        </h2>
        
        {application && (
          <div className="bg-white p-4 rounded-lg shadow-md mb-6 lg:w-1/2 border-[#001F3F]">
            <div className={`flex justify-between ${poppins.className}`}>
              <h2 className="text-2xl font-semibold mb-2 text-[#001F3F]">
                {application.companyName}
              </h2>
              <div className="flex items-center">
                {application.link && (
                  <a
                    href={application.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#001F3F] flex items-center mr-4"
                  >
                    <LinkIcon className="h-4 w-4" />
                  </a>
                )}
                <EditApplication 
                  application={application} 
                  onUpdate={fetchApplicationData} 
                />
              </div>
            </div>
            
            <Badge className="bg-[#001F3F] text-white mb-2">
              <MapPinIcon className="w-3 h-3 mr-2" />
              <p>{application.location}</p>
            </Badge>
            
            <div className="flex justify-between gap-10 mt-5">
              <div>
                <p className="font-medium">Role</p>
                <p className="text-gray-600">{application.role}</p>
              </div>
              <div>
                <p className="font-medium">Stipend</p>
                <p className="text-gray-600">
                  {application.stipend
                    ? `Rs.${application.stipend.toLocaleString()}`
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="font-medium">CTC</p>
                <p className="text-gray-600">
                  {application.ctc
                    ? `Rs.${application.ctc.toLocaleString()}`
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        )}

        <AddRoundDialog 
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          onAddRound={handleAddRound}
        />

        <h2
          className={`text-2xl font-semibold mb-4 text-[#001F3F] ${poppins.className}`}
        >
          Rounds
        </h2>

        <RoundsList 
          rounds={rounds}
          onUpdate={fetchRoundData}
        />
      </div>
    </div>
  );
}
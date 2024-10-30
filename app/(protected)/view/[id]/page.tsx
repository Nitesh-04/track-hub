"use client";
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import Header from "@/app/_components/header/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Link as LinkIcon, MapPinIcon, PlusCircle, CircleDot } from "lucide-react";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import { fetchApplicationById, createRound, RoundData, fetchRoundByApplicationId } from "@/app/actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

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
  link?: string | null;
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
  const { id } = params;
  const applicationId = id;
  const userId = "1010";

  const [application, setApplication] = useState<Application | null>(null);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newRound, setNewRound] = useState({
    roundTitle: "",
    venue: "",
    roundLink: "",
  });

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);

      try {
        if (!applicationId) {
          throw new Error("Application ID is required");
        }

        const appData = await fetchApplicationById(applicationId);
        if (!appData) {
          throw new Error("Application not found");
        }
        setApplication(appData);

        const roundsData = await fetchRoundByApplicationId(applicationId);
        const typedRoundsData = roundsData.map((round) => ({
          ...round,
          status: round.status as "upcoming" | "completed",
        }));
        setRounds(typedRoundsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [applicationId]);

  async function handleAddRound(e: any) {
    e.preventDefault();

    if (!date || !newRound.roundTitle || !time) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      const [hours, minutes] = time.split(":").map(Number);
      const combinedDateTime = new Date(date);
      combinedDateTime.setHours(hours, minutes);

      const roundData: RoundData = {
        roundTitle: newRound.roundTitle,
        roundDateTime: combinedDateTime.getTime(),
        venue: newRound.venue,
        roundLink: newRound.roundLink,
        status: combinedDateTime < new Date() ? "completed" : "upcoming",
      };

      await createRound(roundData, applicationId, userId);

      const updatedRounds = await fetchRoundByApplicationId(applicationId);
      const typedUpdatedRounds = updatedRounds.map((round) => ({
        ...round,
        status: round.status as "upcoming" | "completed",
      }));
      setRounds(typedUpdatedRounds);

      setNewRound({ roundTitle: "", venue: "", roundLink: "" });
      setDate(undefined);
      setTime("");
      setIsOpen(false);
      setError(null);
    } catch (error) {
      console.error("Error adding round:", error);
      setError(error instanceof Error ? error.message : "Failed to add round");
    }
  }

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

  if (error) {
    return (
      <div className="h-full w-full">
        <div className="mb-14 bg-[#001F3F]">
          <Header />
        </div>
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <div className="mb-8 bg-[#001F3F]">
        <Header />
      </div>
      <div className="container mx-auto px-8 py-8">
        <h2
          className={`text-2xl font-semibold mb-4 text-[#001F3F] ${poppins.className}`}
        >
          Application
        </h2>
        {application && (
          <div className="bg-white p-4 rounded-lg shadow-md mb-6 lg:w-1/2 border-[#001F3F]">
            <p className={`flex justify-between  ${poppins.className}`}>
              <h2 className="text-2xl font-semibold mb-2 text-[#001F3F] ">
                {" "}
                {application.companyName}
              </h2>
              {application.link && (
                <div className="col-span-2">
                  <Link
                    href={application.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#001F3F] flex items-center"
                  >
                    <LinkIcon className="mr-1 h-4 w-4" />
                    Visit
                  </Link>
                </div>
              )}
            </p>
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
                    ? `$${application.stipend.toLocaleString()}`
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="font-medium">CTC</p>
                <p className="text-gray-600">
                  {application.ctc
                    ? `$${application.ctc.toLocaleString()}`
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        )}

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="mb-6 bg-[#001F3F] text-white hover:bg-[#001F3F] hover:text-white"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add Rounds
            </Button>
          </DialogTrigger>
          <DialogContent className="md:ml-10 mt-5 text-[#001F3F]">
            <DialogHeader>
              <DialogTitle>Add New Round</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddRound}>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="roundTitle">Round Title</Label>
                  <Input
                    id="roundTitle"
                    value={newRound.roundTitle}
                    onChange={(e) =>
                      setNewRound({ ...newRound, roundTitle: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left",
                          !date && "text-muted-foreground"
                        )}
                      >
                        {date ? format(date, "PPP") : <span>Select Date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        required
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="venue">Venue</Label>
                  <Input
                    id="venue"
                    value={newRound.venue}
                    onChange={(e) =>
                      setNewRound({ ...newRound, venue: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="roundLink">Round Link</Label>
                  <Input
                    id="roundLink"
                    value={newRound.roundLink}
                    onChange={(e) =>
                      setNewRound({ ...newRound, roundLink: e.target.value })
                    }
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#001F3F] hover:bg-slate-700"
                >
                  Add Round
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <h2
          className={`text-2xl font-semibold mb-4 text-[#001F3F] ${poppins.className}`}
        >
          Rounds
        </h2>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
          {rounds.map((round) => (
            <Card
              key={round.id}
              className="w-full h-auto border-[#001F3F] shadow-md"
            >
              <CardContent className="px-6 py-4">
                <p className="text-xl font-semibold text-[#001F3F] flex justify-between">
                  <p>{round.roundTitle}</p>
                  {round.roundLink && (
                    <div className="mt-2">
                      <Link
                        href={round.roundLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#001F3F] hover:underline"
                      >
                        <LinkIcon className="mr-1 h-4 w-4" />
                      </Link>
                    </div>
                  )}
                </p>

                <div className="mt-2">
                  <Badge className="bg-[#001F3F] text-white">
                    <MapPinIcon className="w-3 h-3 mr-2" />
                    <p>{round.venue}</p>
                  </Badge>
                </div>

                <p className="text-gray-600 text-sm mt-2">
                  {format(new Date(round.roundDateTime), "PPpp")}
                </p>
                <p
                  className={`text-sm mt-2 flex justify-end ${
                    round.status === "upcoming"
                      ? "text-green-600"
                      : "text-gray-800"
                  }`}
                >
                  <CircleDot className="w-3 h-3 mr-2 mt-1"/> {round.status === "upcoming" ? "Upcoming" : "Completed"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

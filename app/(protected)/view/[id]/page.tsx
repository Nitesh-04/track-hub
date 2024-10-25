"use client"
import React, { useState } from 'react';
import { format } from "date-fns";
import Header from "@/app/_components/header/Header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CalendarIcon, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
});

type Round = {
    id?: string; 
    name: string;
    date: Date | null;
    time: string;
    venue: string;
    link: string;
  };
  

export default function ApplicationView() {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [roundDetails, setRoundDetails] = useState({
    name: "",
    time: "",
    venue: "",
    link: ""
  });

  const handleAddRound = () => {
    if (roundDetails.name && date) {
      setRounds([...rounds, { ...roundDetails, date }]);
      setRoundDetails({ name: "", time: "", venue: "", link: "" });
      setDate(undefined);
      setIsOpen(false);
    }
  };

  const handleRoundDetailChange = (field: string, value: string) => {
    setRoundDetails((prevDetails) => ({ ...prevDetails, [field]: value }));
  };

  return (
    <div className="h-full w-full">
      <div className="mb-14 bg-[#001F3F]"><Header /></div>
      <div className="container mx-auto px-4 py-8">
        <h1 className={`text-2xl text-center font-bold mb-6 text-[#001F3F] ${poppins.className}`}>Application Details</h1>
        
        {/* Display Application Details */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          {/* Replace with actual application details */}
          <h2 className={`text-lg font-semibold text-[#001F3F]`}>Application Title</h2>
          <p className="text-[#001F3F]">Company: XYZ Corp</p>
          <p className="text-[#001F3F]">Stipend: $1000</p>
          <p className="text-[#001F3F]">Role: Software Engineer</p>
          {/* Add more application fields as necessary */}
        </div>

        {/* Add Round Section */}
        <div className="flex justify-between items-center mt-6">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-[#001F3F] text-[#001F3F]">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Round
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-none sm:max-w-[425px] max-h-[82vh] overflow-y-auto mt-6 md:ml-14">
              <DialogHeader>
                <DialogTitle className={`text-[#001F3F] ${poppins.className}`}>Add New Round</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="round-name" className={`text-[#001F3F] ${poppins.className}`}>Round Name</Label>
                  <Input
                    id="round-name"
                    placeholder="Enter round name"
                    className="border-[#001F3F]"
                    value={roundDetails.name}
                    onChange={(e) => handleRoundDetailChange('name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className={`text-[#001F3F] ${poppins.className}`}>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal border-[#001F3F]",
                          !date && "text-muted-foreground"
                        )}
                      >
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(day) => setDate(day)} 
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time" className={`text-[#001F3F] ${poppins.className}`}>Time</Label>
                  <Input
                    id="time"
                    type="time"
                    className="border-[#001F3F]"
                    value={roundDetails.time}
                    onChange={(e) => handleRoundDetailChange('time', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="venue" className={`text-[#001F3F] ${poppins.className}`}>Venue</Label>
                  <Input
                    id="venue"
                    placeholder="Enter venue"
                    className="border-[#001F3F]"
                    value={roundDetails.venue}
                    onChange={(e) => handleRoundDetailChange('venue', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="round-link" className={`text-[#001F3F] ${poppins.className}`}>Link</Label>
                  <Input
                    id="round-link"
                    placeholder="Enter round link"
                    className="border-[#001F3F]"
                    value={roundDetails.link}
                    onChange={(e) => handleRoundDetailChange('link', e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={handleAddRound} className="bg-[#001F3F] hover:bg-[#003366]">Add Round</Button>
            </DialogContent>
          </Dialog>
        </div>

        {/* Display Rounds */}
        {rounds.length > 0 && (
          <div className="mt-6">
            <h2 className={`text-lg font-semibold text-[#001F3F] ${poppins.className}`}>Rounds</h2>
            <ul className="space-y-4 mt-4">
              {rounds.map((round, index) => (
                <li key={index} className="p-4 border rounded-lg border-[#001F3F]">
                  <p className="font-bold text-[#001F3F]">Round Name: {round.name}</p>
                  <p className="text-[#001F3F]">Date: {round.date ? format(round.date, "PPP") : "N/A"}</p>
                  <p className="text-[#001F3F]">Time: {round.time}</p>
                  <p className="text-[#001F3F]">Venue: {round.venue}</p>
                  <p className="text-[#001F3F]">Link: {round.link}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
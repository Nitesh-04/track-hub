"use client"
import React, { useState } from 'react';
import { format } from "date-fns"
import Header from "@/components/header/Header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Poppins } from 'next/font/google';

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "700"],
});

export default function Create() {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<Date>();

  return (
    <div className="h-full w-full">
      <div className="mb-14 bg-[#001F3F]"><Header/></div>
      <div className="container mx-auto px-4 py-8">
        <h1 className={`text-2xl text-center font-bold mb-6 text-[#001F3F] ${poppins.className}`}>Create a New Application</h1>
        <form className="space-y-6 px-10 md:px-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="company" className={`text-[#001F3F] ${poppins.className}`}>Company Name</Label>
              <Input id="company" type="text" placeholder="Enter company name" className="border-[#001F3F]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stipend" className={`text-[#001F3F] ${poppins.className}`}>Stipend</Label>
              <Input id="stipend" type="number" placeholder="Enter stipend amount" className="border-[#001F3F]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className={`text-[#001F3F] ${poppins.className}`}>Role</Label>
              <Input id="role" placeholder="Enter job role" className="border-[#001F3F]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ctc" className={`text-[#001F3F] ${poppins.className}`}>CTC</Label>
              <Input id="ctc" type="number" placeholder="Enter CTC" className="border-[#001F3F]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="locations" className={`text-[#001F3F] ${poppins.className}`}>Job Location</Label>
              <Input id="locations" placeholder="Enter job location" className="border-[#001F3F]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="links" className={`text-[#001F3F] ${poppins.className}`}>Link</Label>
              <Input id="links" placeholder="Enter relevant link" className="border-[#001F3F]" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="notifications" />
            <Label htmlFor="notifications" className={`text-[#001F3F] ${poppins.className}`}>Enable notifications</Label>
          </div>
          <div className="flex justify-between items-center md:pb-0 pb-20">
            <Button type="submit" className="bg-[#001F3F] hover:bg-[#003366]">Create Application</Button>
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
                    <Input id="round-name" placeholder="Enter round name" className="border-[#001F3F]" />
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
                          onSelect={setDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time" className={`text-[#001F3F] ${poppins.className}`}>Time</Label>
                    <Input id="time" type="time" className="border-[#001F3F]" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="venue" className={`text-[#001F3F] ${poppins.className}`}>Venue</Label>
                    <Input id="venue" placeholder="Enter venue" className="border-[#001F3F]" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="round-link" className={`text-[#001F3F] ${poppins.className}`}>Link</Label>
                    <Input id="round-link" placeholder="Enter round link" className="border-[#001F3F]" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status" className={`text-[#001F3F] ${poppins.className}`}>Status</Label>
                    <Select>
                      <SelectTrigger id="status" className="border-[#001F3F]">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={() => setIsOpen(false)} className="bg-[#001F3F] hover:bg-[#003366]">Add Round</Button>
              </DialogContent>
            </Dialog>
          </div>
        </form>
      </div>
    </div>
  );
}
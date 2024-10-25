"use client"
import React, { useState } from "react";
import Header from "@/app/_components/header/Header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Poppins } from 'next/font/google';
import { createApplication } from "@/app/actions";
import { redirect } from "next/navigation";
import Link from "next/link";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
});


export default function Create() {

  const [companyName, setCompanyName] = useState("");
  const [stipend, setStipend] = useState("");
  const [role, setRole] = useState("");
  const [ctc, setCtc] = useState("");
  const [locations, setLocations] = useState("");
  const [links, setLinks] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [enableView,setenableView] = useState(true);

  const [viewapplicationId, setviewApplicationId] = useState("");

  async function handleSubmit(e:any) {
    e.preventDefault();
    const formData = {
      companyName,
      stipend : parseInt(stipend),
      role,
      ctc : parseInt(ctc),
      location: locations,
      link: links,
      notifications: notificationsEnabled,
    };

    const userId="1010";
    
    try
    {
      const applicationId = await createApplication(formData, userId);
      setviewApplicationId(applicationId);
      setenableView(false);
    }
    catch(err)
    {
        console.log(err);
    }
    
    setCompanyName("");
    setStipend("");
    setRole("");
    setCtc("");
    setLocations("");
    setLinks("");
    setNotificationsEnabled(false);
  };

  return (
    <div className="h-full w-full">
      <div className="mb-14 bg-[#001F3F]"><Header/></div>
      <div className="container mx-auto px-4 md:py-12 py-10">
        <h1 className={`text-2xl text-center font-bold mb-6 text-[#001F3F] ${poppins.className}`}>Create a New Application</h1>
        <form className="space-y-6 px-10 md:px-20" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="company" className={`text-[#001F3F] ${poppins.className}`}>Company Name *</Label>
              <Input
                required
                id="company"
                type="text"
                placeholder="Enter company name"
                className="border-[#001F3F]"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stipend" className={`text-[#001F3F] ${poppins.className}`}>Stipend *</Label>
              <Input
                required
                id="stipend"
                type="number"
                placeholder="Enter stipend amount"
                className="border-[#001F3F]"
                value={stipend}
                onChange={(e) => setStipend(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className={`text-[#001F3F] ${poppins.className}`}>Role *</Label>
              <Input
                required
                id="role"
                placeholder="Enter job role"
                className="border-[#001F3F]"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ctc" className={`text-[#001F3F] ${poppins.className}`}>CTC</Label>
              <Input
                id="ctc"
                type="number"
                placeholder="Enter CTC"
                className="border-[#001F3F]"
                value={ctc}
                onChange={(e) => setCtc(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="locations" className={`text-[#001F3F] ${poppins.className}`}>Job Location *</Label>
              <Input
                required
                id="locations"
                placeholder="Enter job location"
                className="border-[#001F3F]"
                value={locations}
                onChange={(e) => setLocations(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="links" className={`text-[#001F3F] ${poppins.className}`}>Job Link *</Label>
              <Input
                required
                id="links"
                placeholder="Enter relevant link"
                className="border-[#001F3F]"
                value={links}
                onChange={(e) => setLinks(e.target.value)}
              />
            </div>
          </div>
          <div className="flex md:flex-row flex-col gap-10 justify-between items-center">
            <div className="flex items-center space-x-2">
              <Switch
                id="notifications"
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
              <Label htmlFor="notifications" className={`text-[#001F3F] ${poppins.className}`}>Enable notifications</Label>
            </div>
            <Button type="submit" className="bg-[#001F3F] hover:bg-[#003366]">Create Application</Button>
          </div>
          <div className="flex md:flex-row flex-col gap-10 justify-between items-center md:pb-0 pb-20">
            <p className={`text-[#001F3F] ${poppins.className} text-xs`}>
              Note: you can add rounds in application after clicking create application
            </p>
            <Link href={`view/${viewapplicationId}`}><Button disabled={enableView} type="button" className="bg-[#001F3F] hover:bg-[#003366]">View Application</Button></Link>
          </div>
        </form>
      </div>
    </div>
  );
}

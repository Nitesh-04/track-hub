"use client";
import React, { FormEvent, useState } from "react";
import Header from "@/app/_components/header/Header";
import { Poppins } from 'next/font/google';
import { createApplication } from "@/app/actions";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { TheToaster } from "@/components/ui/use-toast";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function Create() {
  const { user } = useUser();
  const { toast } = TheToaster();
  const router = useRouter();

  const [companyName, setCompanyName] = useState("");
  const [stipend, setStipend] = useState("");
  const [role, setRole] = useState("");
  const [ctc, setCtc] = useState("");
  const [locations, setLocations] = useState("");
  const [links, setLinks] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const formData = {
      companyName,
      stipend: parseInt(stipend),
      role,
      ctc: parseInt(ctc),
      location: locations,
      link: links,
      notifications: notificationsEnabled,
    };

    if (!user) {
      router.push("/sign-in");
      return;
    }

    const userId = user.id;

    try {
      const applicationId = await createApplication(formData, userId);
      toast({
        title: "Application created successfully!",
        description: "Opening application...",
      });
      setTimeout(() => {
        router.push(`view/${applicationId}`);
      }, 2000);
    } catch (err) {
      console.log(err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create application. Please try again.",
      });
    }

    // Reset form fields
    setCompanyName("");
    setStipend("");
    setRole("");
    setCtc("");
    setLocations("");
    setLinks("");
    setNotificationsEnabled(false);
  }

  return (
    <div className="h-full w-full">
      <div className="mb-14 bg-[#001F3F]">
        <Header />
      </div>
      <div className="container mx-auto px-4 md:py-12 py-10">
        <h1 className={`text-2xl text-center font-bold mb-6 text-[#001F3F] ${poppins.className}`}>
          Create a New Application
        </h1>
        <form className="space-y-6 px-10 md:px-20" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="company" className={`text-[#001F3F] ${poppins.className}`}>Company Name *</label>
              <input
                required
                id="company"
                type="text"
                placeholder="Enter company name"
                className="border border-[#001F3F] rounded-md p-2 w-full"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="stipend" className={`text-[#001F3F] ${poppins.className}`}>Stipend *</label>
              <input
                required
                id="stipend"
                type="number"
                placeholder="Enter stipend amount"
                className="border border-[#001F3F] rounded-md p-2 w-full"
                value={stipend}
                onChange={(e) => setStipend(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="role" className={`text-[#001F3F] ${poppins.className}`}>Role *</label>
              <input
                required
                id="role"
                placeholder="Enter job role"
                className="border border-[#001F3F] rounded-md p-2 w-full"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="ctc" className={`text-[#001F3F] ${poppins.className}`}>CTC</label>
              <input
                id="ctc"
                type="number"
                placeholder="Enter CTC"
                className="border border-[#001F3F] rounded-md p-2 w-full"
                value={ctc}
                onChange={(e) => setCtc(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="locations" className={`text-[#001F3F] ${poppins.className}`}>Job Location *</label>
              <input
                required
                id="locations"
                placeholder="Enter job location"
                className="border border-[#001F3F] rounded-md p-2 w-full"
                value={locations}
                onChange={(e) => setLocations(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="links" className={`text-[#001F3F] ${poppins.className}`}>Company Link *</label>
              <input
                required
                id="links"
                placeholder="Enter relevant link"
                className="border border-[#001F3F] rounded-md p-2 w-full"
                value={links}
                onChange={(e) => setLinks(e.target.value)}
              />
            </div>
          </div>
          <div className="flex md:flex-row flex-col gap-10 justify-between items-center">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ${notificationsEnabled ? 'bg-[#001F3F]' : 'bg-gray-200'}`}
              >
                <span
                  className={`transform transition-transform duration-200 ease-in-out h-5 w-5 bg-white rounded-full shadow-md ${
                    notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
              <label htmlFor="notifications" className={`text-[#001F3F] ${poppins.className}`}>Enable notifications</label>
            </div>
            <button type="submit" className="bg-[#001F3F] text-white font-semibold py-2 px-4 md:mb-0 mb-20 rounded-md hover:bg-[#003366] transition-colors duration-200">
              Create Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

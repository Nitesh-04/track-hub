"use client";

import { useState, useEffect } from "react";
import { Cross1Icon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex justify-between">
      <p
        className={`text-[#8dd2f2] md:mt-0 mt-1 font-bold text-lg ${poppins.className}`}
      >
        TrackHub
      </p>
      <div
        className={`right-0 hidden font-bold text-lg md:block ${poppins.className}`}
      >
        <a href="#features">
          <button className="mr-12 text-[#8dd2f2] hover:text-[#8dd2f2] duration-500">
            Features{" "}
          </button>
        </a>
        <a href="#how-it-works">
          <button className="text-[#8dd2f2] mr-6 hover:text-[#8dd2f2] duration-500">
            How it works?
          </button>
        </a>
      </div>
      <div className="block md:hidden right-0">
        <button onClick={toggleMenu}>
          {isOpen ? (
            <Cross1Icon className="w-8 h-8 text-[#8dd2f2]" />
          ) : (
            <HamburgerMenuIcon className="w-8 h-8 text-[#8dd2f2]" />
          )}
        </button>
      </div>
      {isOpen && (
        <div className="absolute right-0 mt-4 md:mt-10 mr-2 opacity-75 z-10 flex flex-col text-[#001F3F] items-center w-48 bg-[#c3e3f1] shadow-lg rounded-lg transition-all fade-in-70 duration-700">
          <a href="features"><button
            className={`block px-4 py-2 font-bold ${poppins.className}`}
          >
            Features
          </button></a>
          <a href="#how-it-works"><button
            className={`block px-4 py-2 font-bold ${poppins.className}`}
          >
            How it works?
          </button>
          </a>
        </div>
      )}
    </div>
  );
}

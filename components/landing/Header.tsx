"use client";

import { useState } from "react";
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

  const scrollToSection = (id:string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <div
        className={`right-0 hidden font-bold text-lg md:block ${poppins.className}`}
      >
        <button
          onClick={() => {
            scrollToSection("features");
            setIsOpen(false); 
          }}
          className="mr-12 text-[#001F3F] hover:text-black duration-500"
        >
          Features
        </button>
        <button
          onClick={() => {
            scrollToSection("how-it-works");
            setIsOpen(false); 
          }}
          className="text-[#001F3F] mr-12 hover:text-black duration-500"
        >
          How it works?
        </button>
      </div>
      <div className="block md:hidden right-0">
        <button onClick={toggleMenu}>
          {isOpen ? (
            <Cross1Icon className="w-8 h-8" />
          ) : (
            <HamburgerMenuIcon className="w-8 h-8" />
          )}
        </button>
      </div>
      {isOpen && (
        <div className="absolute right-0 mt-10 mr-2 opacity-75 z-10 flex flex-col text-[#001F3F] items-center w-48 bg-[#e7d9b9] shadow-lg rounded-lg transition-all fade-in-70 duration-700">
          <button
            onClick={() => {
              scrollToSection("features");
              setIsOpen(false); 
            }}
            className={`block px-4 py-2 ${poppins.className}`}
          >
            Features
          </button>
          <button
            onClick={() => {
              scrollToSection("how-it-works");
              setIsOpen(false); 
            }}
            className={`block px-4 py-2 ${poppins.className}`}
          >
            How it works?
          </button>
        </div>
      )}
    </>
  );
}

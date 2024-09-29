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
    <div>
      <div
        className={`right-0 hidden font-bold text-lg md:block ${poppins.className}`}
      >
        <button
          onClick={() => {
            scrollToSection("features");
            setIsOpen(false); 
          }}
          className="mr-12 text-[#8dd2f2] hover:text-[#8dd2f2] duration-500"
        >
          Features
        </button>
        <button
          onClick={() => {
            scrollToSection("how-it-works");
            setIsOpen(false); 
          }}
          className="text-[#8dd2f2] mr-6 hover:text-[#8dd2f2] duration-500"
        >
          How it works?
        </button>
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
        <div className="absolute right-0 mt-12 md:mt-10 mr-2 opacity-75 z-10 flex flex-col text-[#001F3F] items-center w-48 bg-[#c3e3f1] shadow-lg rounded-lg transition-all fade-in-70 duration-700">
          <button
            onClick={() => {
              scrollToSection("features");
              setIsOpen(false); 
            }}
            className={`block px-4 py-2 font-bold ${poppins.className}`}
          >
            Features
          </button>
          <button
            onClick={() => {
              scrollToSection("how-it-works");
              setIsOpen(false); 
            }}
            className={`block px-4 py-2 font-bold ${poppins.className}`}
          >
            How it works?
          </button>
        </div>
      )}
    </div>
  );
}

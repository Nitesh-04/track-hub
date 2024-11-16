"use client"

import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

export default function SkeletonCard() {
  const [numCards, setNumCards] = useState(1);

  useEffect(() => {
    const updateCards = () => {
      if (window.innerWidth >= 1024) {
        setNumCards(3); 
      } else if (window.innerWidth >= 768) {
        setNumCards(2); 
      } else {
        setNumCards(1); 
      }
    };

    updateCards();
    window.addEventListener("resize", updateCards);
    return () => window.removeEventListener("resize", updateCards);
  }, []);

  return (
    <div className="md:px-20 px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-center">
      {Array.from({ length: numCards }).map((_, index) => (
        <div key={index} className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] w-[250px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  );
}

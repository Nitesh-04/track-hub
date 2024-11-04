import { Poppins } from "next/font/google";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function Recents() {
  return (
    <div className="mt-2 md:px-14 py-2 px-2 md:w-3/4 z-20">
      <p className={`font-bold text-[#001F3F] text-xl md:text-2xl mb-4 ${poppins.className}`}>
        Recents
      </p>
      <Carousel className="w-full">
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index} className="md:basis-1/2">
              <div className="p-1">
                <div className="w-full h-40 transition-transform hover:scale-95 border border-[#001F3F] rounded-md shadow-md">
                  <div className="flex h-full items-center justify-center p-6">
                    <span className="text-4xl font-semibold">{index + 1}</span>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="md:flex hidden" />
        <CarouselNext className="md:flex hidden" />
      </Carousel>
    </div>
  );
}

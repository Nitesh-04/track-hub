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

export default function Upcoming() {
  return (
    <div className="md:px-14 md:py-2 py-0 px-2 pt-2 mt-14">
      <p className={`font-bold text-[#001F3F] text-xl md:text-2xl mb-4 ${poppins.className}`}>
        Upcoming events
      </p>
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent>
          {Array.from({ length: 3 }).map((_, index) => (
            <CarouselItem key={index} className="md:basis-1/3">
              <div className="p-1">
                <div className="w-full bg-slate-100 h-40 transition-transform hover:scale-95 border border-[#001F3F] rounded-md shadow-md">
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
      <p className={`md:hidden flex text-bold text-[#001F3F] justify-center mt-2 ${poppins.className}`}>
        Swipe {`>`}
      </p>
    </div>
  );
}

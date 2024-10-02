import { Card, CardContent } from "@/components/ui/card";
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
    <div className="md:px-20 lg:pl-60 lg:pr-28 px-14 py-6 pt-12">
        <p className={`font-bold text-[#001F3F] text-xl md:text-2xl mb-4 ${poppins.className}`}>Upcoming events</p>
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent>
          {Array.from({ length: 3 }).map((_, index) => (
            <CarouselItem key={index} className="md:basis-1/2">
              <div className="p-1">
                <Card className="w-full h-36">
                  <CardContent className="flex h-36 items-center justify-center p-6">
                    <span className="text-3xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

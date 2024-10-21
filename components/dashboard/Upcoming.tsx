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
    <div className="md:px-14 :px-2 md:pt-2 pt-10 ">
        <p className={`font-bold text-[#001F3F] text-xl md:text-2xl mb-4 ${poppins.className}`}>Upcoming events</p>
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
                <Card className="w-full h-40">
                  <CardContent className="flex h-40 items-center justify-center p-6">
                    <span className="text-4xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
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

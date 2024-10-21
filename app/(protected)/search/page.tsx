import Header from "@/components/header/Header";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function Search() {
  return (
    <div className="h-full w-full">
      <div className="bg-[#001F3F] ">
        <Header />
      </div>
      <div className="">
        <div className="pt-20">
          <Input className="md:w-2/5 w-3/4 mx-auto border-[#001F3F]" type="text" placeholder="Search" />
        </div>
        <div className="container mx-auto px-8 py-8 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(5)].map((_, index) => (
              <Card
                key={index}
                className="w-full h-40 transition-transform hover:scale-105 border-[#001F3F]"
              >
                <CardContent className="flex h-full items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

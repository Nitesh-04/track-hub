import { Button } from "@/components/ui/button";
import { Poppins } from "next/font/google";
import Link from "next/link";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function Header() {
  return (
    <div className="bg-[#001F3F] z-20 px-6 md:px-10 py-4 fixed top-0 right-0 left-0">
        <p className={`text-[#8dd2f2] text-center md:ml-20 font-bold text-xl ${poppins.className}`}>TrackHub</p>
        <Button className="bg-[#8dd2f2] text-[#001F3F] font-bold fixed right-10 top-3 hidden md:block hover:bg-[#7ac0f2] hover:text-[#001F3F]"><Link href="/enable-automation">Enable Automation</Link></Button>
    </div>
  );
}
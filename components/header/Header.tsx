import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function Header() {
  return (
    <div className="bg-[#001F3F] z-20 px-6 md:px-10 py-4 fixed top-0 right-0 left-0">
        <p className={`text-[#8dd2f2] text-center font-bold text-xl ${poppins.className}`}>Where Did You Apply</p>
    </div>
  );
}
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function Header() {
  return (
    <div className="flex justify-between z-20 relative">
      <div className="w-full md:w-auto flex justify-center ml-3 md:justify-start">
        <p
          className={`text-[#8dd2f2] md:mt-0 mt-1 font-bold text-2xl md:text-xl ${poppins.className}`}
        >
          TrackHub
        </p>
      </div>
      <div
        className={`right-0 hidden font-bold text-lg md:block ${poppins.className}`}
      >
        <a href="#features">
          <button className="mr-12 text-[#8dd2f2] hover:text-[#8dd2f2] duration-500">
            Features{" "}
          </button>
        </a>
        <a href="#howitworks">
          <button className="text-[#8dd2f2] mr-10 hover:text-[#8dd2f2] duration-500">
            How it works
          </button>
        </a>
        <a href="#aboutus">
          <button className="text-[#8dd2f2] mr-6 hover:text-[#8dd2f2] duration-500">
            About us
          </button>
        </a>
      </div>
    </div>
  );
}
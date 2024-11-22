"use client";

import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function AboutUs() {
  return (
    <section
      className={`py-10 px-6 md:px-12 lg:px-20 ${poppins.className} bg-[#e3e3e3] text-center`}
    >
      <h2 className="text-3xl md:text-3xl lg:text-3xl font-bold text-[#001F3F]">
        About Us
      </h2>
      <p className="mt-6 md:text-lg lg:text-xl text-justify text-[#001F3F] leading-relaxed max-w-4xl mx-auto">
        At <strong>TrackHub</strong>, we believe in simplifying the journey to your dream
        career. Our mission is to provide a seamless platform for tracking internship
        applications, empowering users to stay organized and focused on what matters most—
        building a successful future.
      </p>
      <p className="mt-6 md:text-lg lg:text-xl text-justify text-[#001F3F] leading-relaxed max-w-4xl mx-auto">
        From application deadlines to interview follow-ups, TrackHub is your ultimate
        companion, designed with precision and care to help you navigate the competitive world
        of internships. With user-friendly features, an intuitive
        interface, we&apos;re here to ensure you never miss an opportunity.
      </p>
      <p className="mt-6 md:text-lg lg:text-xl text-[#001F3F] leading-relaxed max-w-4xl mx-auto">
        Let us be your partner in achieving success, <strong>one step at a time</strong>.
      </p>
    </section>
  );
}

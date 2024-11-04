import React from "react";

const loadingMessages = [
  "Gathering your data...",
  "Crunching the numbers...",
  "Hold tight, we're fetching info!",
  "Just a moment, loading magic...",
  "Creating a wonderful experience for you...",
  "Fetching the latest updates...",
  "Please wait, we're almost there...",
  "Bringing you the best content...",
  "Loading the future...",
  "Hang tight, good things are coming...",
];

const Loading = () => {
  const randomMessage = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-slate-100">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#001F3F] mb-4"></div>
      <p className="text-xl font-semibold text-[#001F3F] text-center">{randomMessage}</p>
    </div>
  );
};

export default Loading;

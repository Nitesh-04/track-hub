"use client";

import Header from "@/app/_components/header/Header";
import { SignOutButton, UserButton, useUser } from "@clerk/nextjs";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import {
  getUserByClerkId,
  setGithubId,
  fetchTotalApplicationsByUser,
  fetchTotalRoundsByUser,
  fetchUpcomingRoundsCountByUser,
} from "@/app/actions";
import { useRouter } from "next/navigation";
import GithubCalendar from "react-github-calendar";

export default function Profile() {
  const { user } = useUser();
  const router = useRouter();
  const [githubId, setGithubIdState] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [userGithubId, setUserGithubId] = useState("");
  const [stats, setStats] = useState({
    totalApplications: 0,
    totalRounds: 0,
    upcomingRounds: 0,
  });

  useEffect(() => {
    if (!user) {
      router.push("sign-in");
      return;
    }

    async function fetchData() {
      setIsLoading(true);
      try {
        if (!user) {
          router.push("sign-in");
          return;
        }
        const userId = user.id;
        const [userDetails, applications, rounds, upcoming] = await Promise.all(
          [
            getUserByClerkId(userId),
            fetchTotalApplicationsByUser(userId),
            fetchTotalRoundsByUser(userId),
            fetchUpcomingRoundsCountByUser(userId),
          ]
        );

        if (!userDetails) {
          router.push("sign-in");
          return;
        }

        if (userDetails.githubid) {
          setUserGithubId(userDetails.githubid);
          setGithubIdState(userDetails.githubid);
        }

        setStats({
          totalApplications: applications,
          totalRounds: rounds,
          upcomingRounds: upcoming,
        });
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [user, router]);

  const handleGithubSave = async () => {
    if (!githubId.trim() || !user) return;
    setIsLoading(true);
    try {
      await setGithubId(user.id, githubId);
      setUserGithubId(githubId);
    } catch (error) {
      console.error("Failed to save GitHub ID:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveGithub = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      await setGithubId(user.id, "");
      setUserGithubId("");
      setGithubIdState("");
    } catch (error) {
      console.error("Failed to remove GitHub ID:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-8 py-16">
        <div className="flex justify-between md:flex-row flex-col">
          <div className="flex flex-col md:flex-row items-center justify-center md:items-start gap-6 mb-8">
            <UserButton
              appearance={{ elements: { userButtonAvatarBox: "w-24 h-24" } }}
            />
            <div className="flex flex-col items-center md:items-start">
              <h1 className="text-2xl font-bold text-gray-900">
                {user?.fullName}
              </h1>
              <p className="text-gray-500">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
          <div className="md:block flex justify-center md:mb-0 mb-10">
            <SignOutButton>
              <button className="px-6 py-2 text-slate-100 hover:text-white bg-[#001F3F] rounded-lg">
                Sign Out
              </button>
            </SignOutButton>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Total Applications</p>
            <h3 className="text-3xl font-bold text-gray-900">
              {stats.totalApplications}
            </h3>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Total Rounds</p>
            <h3 className="text-3xl font-bold text-gray-900">
              {stats.totalRounds}
            </h3>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Upcoming Rounds</p>
            <h3 className="text-3xl font-bold text-gray-900">
              {stats.upcomingRounds}
            </h3>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <GitHubLogoIcon className="w-5 h-5" />
              <h2 className="text-lg font-semibold">GitHub Stats</h2>
            </div>
            {userGithubId && (
              <button
                onClick={handleRemoveGithub}
                className="text-sm text-red-600 hover:text-red-800"
                disabled={isLoading}
              >
                Remove
              </button>
            )}
          </div>

          {!userGithubId ? (
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Enter GitHub Username"
                value={githubId}
                onChange={(e) => setGithubIdState(e.target.value)}
                className="w-1/2 flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#001F3F] outline-none"
                disabled={isLoading}
              />
              <button
                onClick={handleGithubSave}
                className="px-6 py-2 bg-[#001F3F] text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                disabled={isLoading}
              >
                {isLoading ? "Connecting..." : "Connect"}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Connected as:</span>
                <span className="font-medium">{userGithubId}</span>
              </div>
              <div className="overflow-hidden flex items-center justify-center">
                <GithubCalendar
                  username={userGithubId}
                  colorScheme="light"
                  fontSize={12}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

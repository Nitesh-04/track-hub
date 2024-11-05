import React from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { CircleDot, LinkIcon, MapPinIcon} from "lucide-react";
import EditRound from "@/app/(protected)/view/_components/EditRound";
import { Round } from "@/lib/types";
import { deleteRound } from "@/app/actions";
import { TheToaster } from "@/components/ui/use-toast";
import DeleteRoundButton from "./DeleteRound";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400","700"],
});


interface RoundsListProps {
  rounds: Round[];
  onUpdate: () => Promise<void>;
}

export const RoundsList: React.FC<RoundsListProps> = ({ rounds, onUpdate }) => {

  const { toast } = TheToaster();

  return (
    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
      {rounds.map((round) => (
        <div key={round.id} className="w-full bg-white h-auto border border-[#001F3F] shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4">
            <div className={`text-xl font-semibold text-[#001F3F] flex justify-between ${poppins.className}`}>
              <span>{round.roundTitle}</span>
              <div className="flex items-center">
                {round.roundLink && (
                  <a
                    href={round.roundLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#001F3F] hover:underline mr-4"
                  >
                    <LinkIcon className="h-4 w-4" />
                  </a>
                )}
                <EditRound round={round} onUpdate={onUpdate} />
                <DeleteRoundButton
                  onDelete={async () => {
                    await deleteRound(round.id);
                    await onUpdate();
                    toast({
                      title: "Round deleted successfully!",
                    });
                  }}
                />
              </div>
            </div>

            <div className="mt-2">
              <Badge className="bg-[#001F3F] text-white">
                <MapPinIcon className="w-3 h-3 mr-2" />
                <span>{round.venue}</span>
              </Badge>
            </div>

            <p className="text-gray-600 text-sm mt-2">
              {format(new Date(round.roundDateTime), "PPpp")}
            </p>
            <p
              className={`text-sm mt-2 flex justify-end items-center ${
                round.status === "upcoming" ? "text-green-600" : "text-gray-800"
              }`}
            >
              <CircleDot className="w-3 h-3 mr-2" />
              {round.status === "upcoming" ? "Upcoming" : "Completed"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

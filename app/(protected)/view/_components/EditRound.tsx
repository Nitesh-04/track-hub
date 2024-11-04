import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { updateRound } from "@/app/actions";
import { RoundData } from "@/lib/types";
import { CalendarIcon, Edit } from "lucide-react";
import { TheToaster } from "@/components/ui/use-toast";
import { EditRoundProps } from "@/lib/types";

const EditRound: React.FC<EditRoundProps> = ({ round, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = TheToaster();
  const [editedRound, setEditedRound] = useState<RoundData>({
    roundTitle: round.roundTitle,
    roundDateTime: round.roundDateTime.getTime(),
    venue: round.venue,
    roundLink: round.roundLink || "",
    status: round.status,
  });

  async function handleUpdateRound(e: React.FormEvent) {
    e.preventDefault();
    await updateRound(round.id, editedRound);
    toast({
      title: "Round updated successfully!",
    });
    setIsOpen(false);
    onUpdate();
  }

  const handleDateChange = (date: Date) => {
    setEditedRound((prevRound) => ({
      ...prevRound,
      roundDateTime: date.getTime(),
    }));
  };

  function handleInputChange(
    field: keyof RoundData,
    value: string | "upcoming" | "completed"
  ) {
    setEditedRound((prevRound) => ({
      ...prevRound,
      [field]: value,
    }));
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Edit size={16} />
      </DialogTrigger>
      <DialogContent className="md:ml-10 mt-5 text-[#001F3F]">
        <DialogHeader>
          <DialogTitle>Edit Round</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleUpdateRound}>
          <div className="grid gap-4 py-4">
            <div>
              <label htmlFor="roundTitle" className="block mb-1">Round Title</label>
              <input
                id="roundTitle"
                value={editedRound.roundTitle}
                onChange={(e) => handleInputChange("roundTitle", e.target.value)}
                required
                className="border border-[#001F3F] rounded p-2 w-full"
              />
            </div>
            <div>
              <label className="block mb-1">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "w-full justify-start text-left border border-[#001F3F] rounded p-2",
                      !editedRound.roundDateTime && "text-muted-foreground"
                    )}
                  >
                    {editedRound.roundDateTime
                      ? format(new Date(editedRound.roundDateTime), "PPP")
                      : <span>Select Date</span>}
                    <CalendarIcon className="ml-auto h-4 w-4" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={new Date(editedRound.roundDateTime)}
                    onSelect={(date) => date && handleDateChange(date)}
                    initialFocus
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    required
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label htmlFor="venue" className="block mb-1">Venue</label>
              <input
                id="venue"
                value={editedRound.venue}
                onChange={(e) => handleInputChange("venue", e.target.value)}
                required
                className="border border-[#001F3F] rounded p-2 w-full"
              />
            </div>
            <div>
              <label htmlFor="roundLink" className="block mb-1">Round Link</label>
              <input
                id="roundLink"
                value={editedRound.roundLink}
                onChange={(e) => handleInputChange("roundLink", e.target.value)}
                className="border border-[#001F3F] rounded p-2 w-full"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#001F3F] hover:bg-slate-700 text-white rounded p-2"
            >
              Update Round
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditRound;

import React, { FormEvent, useState } from "react";
import { format} from "date-fns";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { RoundData } from "@/lib/types";

interface AddRoundDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onAddRound: (roundData: RoundData) => Promise<void>;
}

export const AddRoundDialog: React.FC<AddRoundDialogProps> = ({
  isOpen,
  setIsOpen,
  onAddRound,
}) => {
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>("");
  const [newRound, setNewRound] = useState({
    roundTitle: "",
    venue: "",
    roundLink: "",
  });
  const [loading,setloading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!date || !newRound.roundTitle || !time) {
      return;
    }

    const [hours, minutes] = time.split(":").map(Number);
    const combinedDateTime = new Date(date);
    combinedDateTime.setHours(hours, minutes);

    const roundData: RoundData = {
      roundTitle: newRound.roundTitle,
      roundDateTime: combinedDateTime.getTime(),
      venue: newRound.venue,
      roundLink: newRound.roundLink,
      status: combinedDateTime < new Date() ? "completed" : "upcoming",
    };

    try {
      setloading(true);
      await onAddRound(roundData);
      setNewRound({ roundTitle: "", venue: "", roundLink: "" });
      setDate(undefined);
      setTime("");
      setIsOpen(false);
    } catch (error) {
      console.error("Error adding round:", error);
    }
    finally {
      setloading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="mb-6 bg-[#001F3F] text-white hover:bg-[#001F3F] hover:text-white"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add Rounds
        </Button>
      </DialogTrigger>
      <DialogContent className="md:ml-10 mt-5 text-[#001F3F]">
        <DialogHeader>
          <DialogTitle>Add New Round</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div>
              <label htmlFor="roundTitle" className="block mb-1">Round Title</label>
              <input
                id="roundTitle"
                value={newRound.roundTitle}
                onChange={(e) =>
                  setNewRound({ ...newRound, roundTitle: e.target.value })
                }
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
                      !date && "text-muted-foreground"
                    )}
                  >
                    {date ? format(date, "PPP") : <span>Select Date</span>}
                    <CalendarIcon className="ml-auto h-4 w-4" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
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
              <label htmlFor="time" className="block mb-1">Time</label>
              <input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="border border-[#001F3F] rounded p-2 w-full"
              />
            </div>
            <div>
              <label htmlFor="venue" className="block mb-1">Venue</label>
              <input
                id="venue"
                value={newRound.venue}
                onChange={(e) =>
                  setNewRound({ ...newRound, venue: e.target.value })
                }
                required
                className="border border-[#001F3F] rounded p-2 w-full"
              />
            </div>
            <div>
              <label htmlFor="roundLink" className="block mb-1">Round Link</label>
              <input
                id="roundLink"
                value={newRound.roundLink}
                onChange={(e) =>
                  setNewRound({ ...newRound, roundLink: e.target.value })
                }
                className="border border-[#001F3F] rounded p-2 w-full"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-1/2 mx-auto bg-[#001F3F] hover:bg-slate-700 text-white rounded p-2"
            >
              {loading ? "Adding..." : "Add Round" }
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

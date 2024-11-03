import React, { FormEvent, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { RoundData } from "@/app/actions";

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

  async function handleSubmit(e:FormEvent) {
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

    await onAddRound(roundData);
    setNewRound({ roundTitle: "", venue: "", roundLink: "" });
    setDate(undefined);
    setTime("");
    setIsOpen(false);
  };

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
              <Label htmlFor="roundTitle">Round Title</Label>
              <Input
                id="roundTitle"
                value={newRound.roundTitle}
                onChange={(e) =>
                  setNewRound({ ...newRound, roundTitle: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left",
                      !date && "text-muted-foreground"
                    )}
                  >
                    {date ? format(date, "PPP") : <span>Select Date</span>}
                    <CalendarIcon className="ml-auto h-4 w-4" />
                  </Button>
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
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="venue">Venue</Label>
              <Input
                id="venue"
                value={newRound.venue}
                onChange={(e) =>
                  setNewRound({ ...newRound, venue: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="roundLink">Round Link</Label>
              <Input
                id="roundLink"
                value={newRound.roundLink}
                onChange={(e) =>
                  setNewRound({ ...newRound, roundLink: e.target.value })
                }
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#001F3F] hover:bg-slate-700"
            >
              Add Round
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, CalendarProps } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { updateRound, RoundData } from "@/app/actions";
import { CalendarIcon, Edit } from "lucide-react";

interface EditRoundProps {
  round: {
    id: string;
    roundTitle: string;
    roundDateTime: Date;
    venue: string;
    roundLink: string | null;
    status: "upcoming" | "completed";
  };
  onUpdate: () => void;
}

const EditRound: React.FC<EditRoundProps> = ({ round, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
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
        <Edit className="mt-2" size={16} />
      </DialogTrigger>
      <DialogContent className="md:ml-10 mt-5 text-[#001F3F]">
        <DialogHeader>
          <DialogTitle>Edit Round</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleUpdateRound}>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="roundTitle">Round Title</Label>
              <Input
                id="roundTitle"
                value={editedRound.roundTitle}
                onChange={(e) =>
                  handleInputChange("roundTitle", e.target.value)
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
                      !editedRound.roundDateTime && "text-muted-foreground"
                    )}
                  >
                    {editedRound.roundDateTime
                      ? format(
                          new Date(editedRound.roundDateTime),
                          "PPP"
                        )
                      : <span>Select Date</span>}
                    <CalendarIcon className="ml-auto h-4 w-4" />
                  </Button>
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
              <Label htmlFor="venue">Venue</Label>
              <Input
                id="venue"
                value={editedRound.venue}
                onChange={(e) =>
                  handleInputChange("venue", e.target.value)
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="roundLink">Round Link</Label>
              <Input
                id="roundLink"
                value={editedRound.roundLink}
                onChange={(e) =>
                  handleInputChange("roundLink", e.target.value)
                }
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#001F3F] hover:bg-slate-700"
            >
              Update Round
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditRound;
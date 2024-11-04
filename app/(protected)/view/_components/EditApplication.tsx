import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateApplication} from "@/app/actions";
import { ApplicationData } from "@/lib/types";
import { Edit } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { TheToaster } from "@/components/ui/use-toast";
import { EditApplicationProps } from "@/lib/types";

const EditApplication: React.FC<EditApplicationProps> = ({ application, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = TheToaster();
  const [editedApplication, setEditedApplication] = useState<ApplicationData>({
    companyName: application.companyName,
    stipend: application.stipend ?? 0,
    ctc: application.ctc ?? 0,
    role: application.role,
    location: application.location,
    link: application.link || "",
    notifications: application.notifications,
  });

  async function handleUpdateApplication(e: React.FormEvent) {
    e.preventDefault();
    await updateApplication(application.id, editedApplication);
    toast({
      title: "Application edited successfully!",
    });
    setIsOpen(false);
    onUpdate();
  }

  function handleInputChange(
    field: keyof ApplicationData,
    value: string | number | boolean
  ) {
    setEditedApplication((prevApp) => ({
      ...prevApp,
      [field]: value,
    }));
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Edit className="ml-4" size={16} />
      </DialogTrigger>
      <DialogContent className="md:ml-10 mt-5 text-[#001F3F]">
        <DialogHeader>
          <DialogTitle>Edit Application</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleUpdateApplication}>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={editedApplication.companyName}
                onChange={(e) =>
                  handleInputChange("companyName", e.target.value)
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={editedApplication.role}
                onChange={(e) =>
                  handleInputChange("role", e.target.value)
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={editedApplication.location}
                onChange={(e) =>
                  handleInputChange("location", e.target.value)
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="stipend">Stipend</Label>
              <Input
                id="stipend"
                type="number"
                value={editedApplication.stipend || ""}
                onChange={(e) =>
                  handleInputChange("stipend", parseInt(e.target.value) || 0)
                }
              />
            </div>
            <div>
              <Label htmlFor="ctc">CTC</Label>
              <Input
                id="ctc"
                type="number"
                value={editedApplication.ctc || ""}
                onChange={(e) =>
                  handleInputChange("ctc", parseInt(e.target.value) || 0)
                }
              />
            </div>
            <div>
              <Label htmlFor="link">Link</Label>
              <Input
                id="link"
                value={editedApplication.link || ""}
                onChange={(e) =>
                  handleInputChange("link", e.target.value)
                }
              />
            </div>
            <div>
              <Label htmlFor="notifications" className="text-[16px]">Notifications</Label>
              <Checkbox
                id="notifications"
                checked={editedApplication.notifications}
                onCheckedChange={(checked) =>
                handleInputChange("notifications", checked)
                }
                className="ml-8"
               />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#001F3F] hover:bg-slate-700"
            >
              Update Application
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditApplication;
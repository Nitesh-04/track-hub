import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { updateApplication } from "../_actions/actions";
import { ApplicationData } from "@/lib/types";
import { Edit } from "lucide-react";
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

  const [editing,setEditing] = useState(false);

  async function handleUpdateApplication(e: React.FormEvent) {
    e.preventDefault();
    try {
      setEditing(true);
      await updateApplication(application.id, editedApplication);
      toast({
        title: "Application edited successfully!",
      });
      setIsOpen(false);
      onUpdate();
    } catch (error) {
      console.error("Error updating application:", error);
      toast({
        variant: "destructive",
        title: "Failed to update application",
        description: "Please try again",
      });
    }
    finally {
      setEditing(false);
    }

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
              <label htmlFor="companyName" className="block mb-1">Company Name</label>
              <input
                id="companyName"
                value={editedApplication.companyName}
                onChange={(e) => handleInputChange("companyName", e.target.value)}
                required
                className="border border-[#001F3F] rounded px-1 w-full"
              />
            </div>
            <div>
              <label htmlFor="role" className="block mb-1">Role</label>
              <input
                id="role"
                value={editedApplication.role}
                onChange={(e) => handleInputChange("role", e.target.value)}
                required
                className="border border-[#001F3F] rounded px-1 w-full"
              />
            </div>
            <div>
              <label htmlFor="location" className="block mb-1">Location</label>
              <input
                id="location"
                value={editedApplication.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                required
                className="border border-[#001F3F] rounded px-1 w-full"
              />
            </div>
            <div>
              <label htmlFor="stipend" className="block mb-1">Stipend</label>
              <input
                id="stipend"
                type="number"
                value={editedApplication.stipend || ""}
                onChange={(e) => handleInputChange("stipend", parseInt(e.target.value) || 0)}
                className="border border-[#001F3F] rounded px-1 w-full"
              />
            </div>
            <div>
              <label htmlFor="ctc" className="block mb-1">CTC</label>
              <input
                id="ctc"
                type="number"
                value={editedApplication.ctc || ""}
                onChange={(e) => handleInputChange("ctc", parseInt(e.target.value) || 0)}
                className="border border-[#001F3F] rounded px-1 w-full"
              />
            </div>
            <div>
              <label htmlFor="link" className="block mb-1">Link</label>
              <input
                id="link"
                value={editedApplication.link || ""}
                onChange={(e) => handleInputChange("link", e.target.value)}
                className="border border-[#001F3F] rounded px-1 w-full"
              />
            </div>
            <div className="flex items-center">
              <input
                id="notifications"
                type="checkbox"
                checked={editedApplication.notifications}
                onChange={(e) => handleInputChange("notifications", e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="notifications" className="text-[16px]">Notifications</label>
            </div>
            <button
              type="submit"
              disabled={editing}
              className="w-1/2 mx-auto bg-[#001F3F] hover:bg-slate-700 text-white rounded p-2"
            >
              {editing ? "Updating..." : "Update Application"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditApplication;

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/clerk-react";
import { CirclePlus, Loader2 } from "lucide-react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import GlobalApi from "@/service/GlobalApi"; // Corrected import path
import { useNavigate } from "react-router-dom";

const AddResume = () => {
  /*~~~~~~~~$ States $~~~~~~~~*/
  const [openDailog, setOpenDialog] = useState(false);
  const [resumeTitle, setResumeTitle] = useState("");
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const naviagation = useNavigate();

  /*~~~~~~~~$ Handlers $~~~~~~~~*/
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleResumeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResumeTitle(e.target.value);
    const resumeId = uuidv4();
    console.log(resumeId + resumeTitle);
  };

  const handleCreateResume = async () => {
    setLoading(true);
    const uuid = uuidv4();
    const data = {
      data: {
        title: resumeTitle,
        resumeId: uuid,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        userName: user?.fullName,
      },
    };

    try {
      await GlobalApi.createNewResume(data).then((res) => {
        console.log(res);

        if (res) {
          setLoading(false);
          naviagation(`/dashboard/resume/${res.data.data.documentId}/edit`);
        }

        handleCloseDialog();
      });
      console.log("Resume created successfully");
    } catch (error) {
      console.error("Error creating resume:", error);
      console.log(data)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resume">
      <Button
        className="bg-transparent border-none shadow-none outline-none hover:bg-transparent"
        onClick={handleOpenDialog}
      >
        <CirclePlus size={50} className="opacity-75" />
      </Button>
      <Dialog open={openDailog}>
        <DialogContent className="bg-white rounded-xl">
          <DialogHeader>
            <DialogTitle>Create a new resume</DialogTitle>
            <DialogDescription>Add your resume title.</DialogDescription>
            <Input
              placeholder="Enter resume title"
              onChange={handleResumeTitle}
            />
            <div className="flex items-center justify-end space-x-2">
              <Button onClick={handleCloseDialog} variant={"ghost"}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateResume}
                disabled={!resumeTitle || loading}
              >
                {loading ? <Loader2 className="animate-spin" /> : "Create"}
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddResume;

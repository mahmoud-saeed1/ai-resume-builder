import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { CirclePlus } from "lucide-react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const AddResume = () => {
  /*~~~~~~~~$ States $~~~~~~~~*/
  const [openDailog, setOpenDialog] = useState(false);
  const [resumeTitle, setResumeTitle] = useState("");

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
            <DialogTitle>create a new resume</DialogTitle>
            <DialogDescription>add your resume title.</DialogDescription>
            <Input
              placeholder="enter resume title"
              onChange={handleResumeTitle}
            />
            <div className="flex items-center justify-end space-x-2">
              <Button onClick={handleCloseDialog} variant={"ghost"}>
                Cancel
              </Button>
              <Button onClick={handleCloseDialog} disabled={!resumeTitle}>create</Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddResume;

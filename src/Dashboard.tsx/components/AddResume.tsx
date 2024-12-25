import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUser } from "@clerk/clerk-react";
import { CirclePlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import GlobalApi from "@/service/GlobalApi"; // Corrected import path
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import InputErrorMessage from "@/ui/InputErrorMessage";
import Button from "@/ui/Button";
import Label from "@/ui/Label";
import Input from "@/ui/Input";

const AddResume = () => {
  /*~~~~~~~~$ States & Hooks $~~~~~~~~*/
  const [openDialog, setOpenDialog] = useState(false);
  const { user } = useUser();
  const [isloading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Set up react-hook-form
  const { register, reset, handleSubmit, formState: { errors } } = useForm<FormData>();

  /*~~~~~~~~$ Handlers $~~~~~~~~*/
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  interface ResumeData {
    data: {
      title: string;
      resumeId: string;
      userEmail: string | undefined;
      userName: string | undefined;
    };
  }

  interface FormData {
    title: string;
  }

  const handleCreateResume = async (data: FormData) => {
    setIsLoading(true);
    const resumeId = uuidv4();
    const resumeData: ResumeData = {
      data: {
        title: data.title,
        resumeId: resumeId,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        userName: user?.fullName ?? undefined,
      },
    };

    try {
      const res = await GlobalApi.createNewResume(resumeData);
      console.log(res);

      if (res) {
        toast.success("Resume created successfully!");
        setIsLoading(false);
        navigate(`/dashboard/resume/${res.data.data.documentId}/edit`);
      }

      handleCloseDialog();
    } catch (error) {
      console.error("Error creating resume:", error);
      toast.error("Error creating resume.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    handleCloseDialog();

    setIsLoading(false);
  }

  return (
    <div className="resume">
      <Button
        className="resume__add-btn"
        onClick={handleOpenDialog}
      >
        <CirclePlus size={50} className="resume__add-icon" />
      </Button>
      <Dialog open={openDialog}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Create a new resume</DialogTitle>
            <form onSubmit={handleSubmit(handleCreateResume)} className="resume__form">
              <div className="add__resume-form">

                <Label htmlFor="title">Resume Title</Label>
                <Input
                  id="title"
                  placeholder="Enter resume title"
                  {...register("title", {
                    required: "Resume title is required",
                    minLength: { value: 3, message: "Title must be at least 3 characters" },
                  })}
                  className={`${errors.title ? "resume__input--error" : ""}`}
                />
                {errors.title && <InputErrorMessage msg={errors.title.message} />}
              </div>
              <div className="resume__actions">
                <Button onClick={handleCancel} variant="cancel">
                  Cancel
                </Button>
                <Button type="submit" disabled={isloading} isLoading={isloading}>
                  Create
                </Button>
              </div>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddResume;
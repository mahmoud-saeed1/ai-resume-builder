import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Bounce } from "react-toastify";
import GlobalApi from "@/service/GlobalApi";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,

} from "@/components/ui/alert-dialog";
import { ChevronDown, Pencil, Eye, Trash, User } from "lucide-react";
import { AxiosError } from "axios";
import { IErrorResponse } from "@/interfaces";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import Button from "@/ui/Button";

interface ResumeItemProps {
  resumeId: string;
  resumeTitle: string;
  resumeSummary: string;
  createdAt?: string;
  updatedAt?: string;
}

const ResumeItem = ({ resumeId, resumeTitle, resumeSummary, createdAt, updatedAt }: ResumeItemProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const [openAlert, setOpenAlert] = useState(false);

  // Format dates to a readable format
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleDeleteResume = async () => {
    setIsDeleting(true);
    try {
      const { status } = await GlobalApi.DeleteResume(resumeId);
      if (status === 200) {
        toast.success("Resume deleted successfully.", {
          autoClose: 1000,
          theme: "light",
          transition: Bounce,
        });
        setOpenAlert(false);
      }
    } catch (error) {
      const err = error as AxiosError<IErrorResponse>;
      toast.error(err.response?.data.error.message, {
        autoClose: 2000,
        theme: "light",
        transition: Bounce,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => navigate(`/dashboard/resume/${resumeId}/edit`);
  const handleView = () => navigate(`/my-resume/${resumeId}/view`);
  const handleOpenAlertDialog = () => setOpenAlert(true);
  const handleCloseAlertDialog = () => setOpenAlert(false);

  // Framer Motion variants for cleaner code
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <motion.div className="resume-item" variants={cardVariants} initial="hidden" animate="visible">
      <div className="resume-item__icon">
        <User className="resume-item__icon-file" />
      </div>

      <div className="resume-item__content">
        <div className="resume-item__header">
          <h2 className="resume-item__title">{resumeTitle}</h2>
          <DropdownMenu>
            <DropdownMenuTrigger><ChevronDown className="resume-item__dropdown-icon" /></DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white">
              <DropdownMenuLabel>Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleEdit}><Pencil className="resume-item__menu-icon" /> Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={handleView}><Eye className="resume-item__menu-icon" /> View</DropdownMenuItem>
              <DropdownMenuItem onClick={handleOpenAlertDialog}><Trash className="resume-item__menu-icon" /> Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="resume-item__separator" />

        <p className="resume-item__summary">{resumeSummary}</p>
        <div className="resume-item__dates">
          <span>Created: {formatDate(createdAt)}</span>
          <span>Updated: {formatDate(updatedAt)}</span>
        </div>
      </div>

      <AlertDialog open={openAlert}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your resume and remove your data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={handleCloseAlertDialog} variant={"cancel"}>Cancel</Button>
            <Button isLoading={isDeleting} variant={"danger"} onClick={handleDeleteResume} disabled={isDeleting}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default ResumeItem;

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
  AlertDialogCancel,
  AlertDialogAction
} from "@/components/ui/alert-dialog";
import { ChevronDown, Pencil, Eye, Trash, Loader2Icon } from "lucide-react";
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

interface ResumeItemProps {
  resumeId: string;
  resumeTitle: string;
  resumeSummary: string;
}

const ResumeItem = ({ resumeId, resumeTitle, resumeSummary }: ResumeItemProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const [openAlert, setOpenAlert] = useState(false);

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
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <motion.div
      className="resume-item"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="resume-item__header">
        <h2 className="resume-item__title">{resumeTitle}</h2>
        <DropdownMenu>
          <DropdownMenuTrigger><ChevronDown className="resume-item__dropdown-icon" /></DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleEdit}><Pencil className="resume-item__menu-icon" /> Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={handleView}><Eye className="resume-item__menu-icon" /> View</DropdownMenuItem>
            <DropdownMenuItem onClick={handleOpenAlertDialog}><Trash className="resume-item__menu-icon" /> Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialog open={openAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your resume and remove your data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCloseAlertDialog}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteResume} disabled={isDeleting}>
                {isDeleting ? <Loader2Icon className='animate-spin' /> : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <p className="resume-item__summary">{resumeSummary}</p>
    </motion.div>
  );
};

export default ResumeItem;

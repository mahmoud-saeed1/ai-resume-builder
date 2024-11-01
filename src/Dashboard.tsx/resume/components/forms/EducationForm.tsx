import { useContext, useEffect, useState } from "react";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { IErrorResponse, IEducation } from "@/interfaces";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import { AxiosError } from "axios";
import GlobalApi from "@/service/GlobalApi";
import Button from "@/ui/Button";
import { v4 as uuidv4 } from "uuid";

const EducationForm = () => {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)!;
  const [education, setEducation] = useState<IEducation[]>(resumeInfo.education || []);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const params = useParams<{ id: string }>();

  /*~~~~~~~~$ Handlers $~~~~~~~~*/
  const handleInputChange = (
    eduId: string,
    field: keyof IEducation,
    value: string | boolean
  ) => {
    setEducation((prev) =>
      prev.map((edu) => (edu.edId === eduId ? { ...edu, [field]: value } : edu))
    );
    setResumeInfo((prev) => ({
      ...prev,
      education,
    }));
  };

  const handleOnSubmit = async () => {
    setIsLoading(true);
    if (!params?.id) {
      toast.error("ID parameter is missing.", {
        autoClose: 2000,
        theme: "light",
        transition: Bounce,
      });
      setIsLoading(false);
      return;
    }

    try {
      const { status } = await GlobalApi.UpdateResumeDetails(params.id, { education });

      if (status === 200) {
        toast.success("Education saved successfully.", {
          autoClose: 1000,
          theme: "light",
          transition: Bounce,
        });
      }
    } catch (error) {
      const err = error as AxiosError<IErrorResponse>;
      if (err.response?.data.error.details) {
        err.response.data.error.details.errors.forEach((e) => {
          toast.error(e.message, {
            autoClose: 2000,
            theme: "light",
            transition: Bounce,
          });
        });
      } else {
        toast.error(err.response?.data.error.message, {
          autoClose: 2000,
          theme: "light",
          transition: Bounce,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEducation = () => {
    const newEducation: IEducation = {
      edId: uuidv4(),
      universityName: "",
      startDate: "",
      endDate: "",
      currentlyStudy: false,
      degree: "",
      major: "",
      minor: "",
      description: "",
    };
    setEducation((prev) => [...prev, newEducation]);
    setResumeInfo((prev) => ({
      ...prev,
      education: [...education, newEducation],
    }));
  };

  const handleRemoveEducation = (eduId: string) => {
    setEducation((prev) => prev.filter((edu) => edu.edId !== eduId));
    setResumeInfo((prev) => ({
      ...prev,
      education: education.filter((edu) => edu.edId !== eduId),
    }));
  };

  const handleMoveEducation = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    const updatedEducation = [...education];
    const movedEducation = updatedEducation.splice(index, 1);
    updatedEducation.splice(newIndex, 0, movedEducation[0]);
    setEducation(updatedEducation);
    setResumeInfo((prev) => ({
      ...prev,
      education: updatedEducation,
    }));
  };

  const animationVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  };

  useEffect(() => {
    console.log("Education Component: ", education);
  }, [education]);

  return (
    <div className="grid gap-4 p-4">
      <h2 className="text-lg font-semibold">Education</h2>

      {education.length === 0 ? (
        <motion.div
          variants={animationVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="border p-4 rounded-lg shadow-md"
        >
          <p className="text-center">No education added yet</p>
        </motion.div>
      ) : (
        <AnimatePresence>
          {education.map((edu, index) => (
            <motion.div
              key={edu.edId}
              variants={animationVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="border p-4 rounded-lg shadow-md space-y-4"
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-sm">Education #{index + 1}</h4>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={index === 0}
                    onClick={() => handleMoveEducation(index, "up")}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMoveEducation(index, "down")}
                    disabled={index === (resumeInfo.education || []).length - 1}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveEducation(edu.edId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <form>
                <input
                  type="text"
                  placeholder="University Name"
                  value={edu.universityName}
                  onChange={(e) =>
                    handleInputChange(edu.edId, "universityName", e.target.value)
                  }
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={(e) =>
                    handleInputChange(edu.edId, "degree", e.target.value)
                  }
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Major"
                  value={edu.major}
                  onChange={(e) =>
                    handleInputChange(edu.edId, "major", e.target.value)
                  }
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Minor (Optional)"
                  value={edu.minor || ""}
                  onChange={(e) =>
                    handleInputChange(edu.edId, "minor", e.target.value)
                  }
                  className="w-full p-2 border rounded"
                />
                <div className="flex gap-4">
                  <input
                    type="date"
                    placeholder="Start Date"
                    value={edu.startDate}
                    onChange={(e) =>
                      handleInputChange(edu.edId, "startDate", e.target.value)
                    }
                    className="w-full p-2 border rounded"
                  />
                  {!edu.currentlyStudy && (
                    <input
                      type="date"
                      placeholder="End Date"
                      value={edu.endDate || ""}
                      onChange={(e) =>
                        handleInputChange(edu.edId, "endDate", e.target.value)
                      }
                      className="w-full p-2 border rounded"
                    />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    title="Currently Studying"
                    checked={edu.currentlyStudy}
                    onChange={(e) =>
                      handleInputChange(edu.edId, "currentlyStudy", e.target.checked)
                    }
                  />
                  <label>Currently Studying</label>
                </div>
                <textarea
                  placeholder="Description"
                  value={edu.description}
                  onChange={(e) =>
                    handleInputChange(edu.edId, "description", e.target.value)
                  }
                  className="w-full p-2 border rounded"
                />
              </form>

              <div className="flex justify-end">
                <Button
                  type="button"
                  variant={"danger"}
                  size="sm"
                  onClick={() => handleRemoveEducation(edu.edId)}
                >
                  Remove
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}

      <Button
        type="button"
        onClick={handleAddEducation}
        variant="outline"
        className="mb-4"
      >
        Add Education
      </Button>

      <Button
        type="submit"
        variant="success"
        isLoading={isLoading}
        onClick={handleOnSubmit}
      >
        Save
      </Button>
    </div>
  );
};

export default EducationForm;

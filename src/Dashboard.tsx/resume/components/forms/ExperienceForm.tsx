import { useContext, useEffect, useState } from "react";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { IErrorResponse, IExperience } from "@/interfaces";
import RichTextEditor from "./RichTextEditor";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import { AxiosError } from "axios";
import GlobalApi from "@/service/GlobalApi";
import Button from "@/ui/Button";
import { v4 as uuidv4 } from "uuid";

const ExperienceForm = () => {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)!;
  const [experience, setExperience] = useState<IExperience[]>(
    resumeInfo.experience || []
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const params = useParams<{ id: string }>();
  /*~~~~~~~~$ Handlers $~~~~~~~~*/
  const handleInputChange = (
    exId: string,
    field: keyof IExperience,
    value: string | boolean
  ) => {
    setExperience((prev) =>
      prev.map((exp) => (exp.exId === exId ? { ...exp, [field]: value } : exp))
    );
    setResumeInfo((prev) => ({
      ...prev,
      experience,
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

    // const experienceListString = JSON.stringify(experience);

    try {
      const { status } = await GlobalApi.UpdateResumeDetails(params.id, {
        experience,
      });

      if (status === 200) {
        toast.success("Experience saved successfully.", {
          autoClose: 1000,
          theme: "light",
          transition: Bounce,
        });
      }
    } catch (error) {
      const err = error as AxiosError<IErrorResponse>;
      console.log("Error", err);
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

  const handleAddExperience = () => {
    const newExperience: IExperience = {
      exId: uuidv4(),
      title: "",
      companyName: "",
      city: "",
      state: "",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
      workSummary: "",
    };
    setExperience((prev) => [...prev, newExperience]);
    setResumeInfo((prev) => ({
      ...prev,
      experience: [...experience, newExperience],
    }));
  };

  const handleRemoveExperience = (exId: string) => {
    setExperience((prev) => prev.filter((exp) => exp.exId !== exId));
    setResumeInfo((prev) => ({
      ...prev,
      experience: experience.filter((exp) => exp.exId !== exId),
    }));
  };

  const handleMoveExperience = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    const updatedExperience = [...experience];
    const movedExperience = updatedExperience.splice(index, 1);
    updatedExperience.splice(newIndex, 0, movedExperience[0]);
    setExperience(updatedExperience);
    setResumeInfo((prev) => ({
      ...prev,
      experience: updatedExperience,
    }));
  };

  const animationVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  };

  useEffect(() => {
    console.log("Experience Form: ", experience);
  }, [experience]);

  return (
    <div className="grid gap-4 p-4">
      <h2 className="text-lg font-semibold">Experience</h2>

      {experience.length === 0 ? (
        <motion.div
          variants={animationVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="border p-4 rounded-lg shadow-md"
        >
          <p className="text-center">No experience added yet</p>
        </motion.div>
      ) : (
        <AnimatePresence>
          {experience.map((exp, index) => (
            <motion.div
              key={exp.exId}
              variants={animationVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="border p-4 rounded-lg shadow-md space-y-4"
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-sm">
                  Experience #{index + 1}
                </h4>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={index === 0}
                    onClick={() => handleMoveExperience(index, "up")}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMoveExperience(index, "down")}
                    disabled={
                      index === (resumeInfo.experience || []).length - 1
                    }
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveExperience(exp.exId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <form>
                <input
                  type="text"
                  placeholder="Position Title"
                  value={exp.title}
                  onChange={(e) =>
                    handleInputChange(exp.exId, "title", e.target.value)
                  }
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Company Name"
                  value={exp.companyName}
                  onChange={(e) =>
                    handleInputChange(exp.exId, "companyName", e.target.value)
                  }
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={exp.city}
                  onChange={(e) =>
                    handleInputChange(exp.exId, "city", e.target.value)
                  }
                  className="w-full p-2 border rounded"
                />
                <div className="flex gap-4">
                  <input
                    type="date"
                    placeholder="Start Date"
                    value={exp.startDate}
                    onChange={(e) =>
                      handleInputChange(exp.exId, "startDate", e.target.value)
                    }
                    className="w-full p-2 border rounded"
                  />
                  {!exp.currentlyWorking && (
                    <input
                      type="date"
                      placeholder="End Date"
                      value={exp.endDate || ""}
                      onChange={(e) =>
                        handleInputChange(exp.exId, "endDate", e.target.value)
                      }
                      className="w-full p-2 border rounded"
                    />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    title="Currently Working"
                    checked={exp.currentlyWorking}
                    onChange={(e) =>
                      handleInputChange(
                        exp.exId,
                        "currentlyWorking",
                        e.target.checked
                      )
                    }
                  />
                  <label>Currently Working</label>
                </div>
              </form>

              <RichTextEditor
                index={index}
                onRichTextEditorChange={(content) =>
                  handleInputChange(exp.exId, "workSummary", content)
                }
                defaultValue={exp.workSummary}
              />

              <div className="flex justify-end">
                <Button
                  type="button"
                  variant={"danger"}
                  size="sm"
                  onClick={() => handleRemoveExperience(exp.exId)}
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
        onClick={handleAddExperience}
        variant="outline"
        className="mb-4"
      >
        Add Experience
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

export default ExperienceForm;

import { useContext, useState } from "react";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { IErrorResponse, IExperience, IFormProbs } from "@/interfaces";
import RichTextEditor from "./RichTextEditor";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useParams } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import { AxiosError } from "axios";
import GlobalApi from "@/service/GlobalApi";
import Button from "@/ui/Button";
import { v4 as uuidv4 } from "uuid";
import { VForm } from "@/animation";
import FormInput from "./FormInputs";

const ExperienceForm = ({
  enableNextBtn,
  handleEnableNextBtn,
  handleDisableNextBtn,
}: IFormProbs) => {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)!;
  const [experienceList, setExperienceList] = useState<IExperience[]>(
    resumeInfo?.experience || []
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const params = useParams<{ resumeId: string }>();
  /*~~~~~~~~$ Handlers $~~~~~~~~*/
  const handleInputChange = (
    exId: string,
    field: keyof IExperience,
    value: string | boolean
  ) => {
    setExperienceList((prev) =>
      prev.map((exp) => (exp.exId === exId ? { ...exp, [field]: value } : exp))
    );
    setResumeInfo((prev) => ({
      ...prev,
      experience: experienceList,
    }));

    handleDisableNextBtn();
  };

  const handleOnSubmit = async () => {
    setIsLoading(true);
    if (!params?.resumeId) {
      toast.error("ID parameter is missing.", {
        autoClose: 2000,
        theme: "light",
        transition: Bounce,
      });
      setIsLoading(false);
      return;
    }

    try {
      const { status } = await GlobalApi.UpdateResumeData(params.resumeId, {
        experience: experienceList,
      });

      if (status === 200) {
        toast.success("Experience saved successfully.", {
          autoClose: 1000,
          theme: "light",
          transition: Bounce,
        });
        handleEnableNextBtn();
      }
    } catch (error) {
      const err = error as AxiosError<IErrorResponse>;
      console.log("Error", err);
      toast.error(err.response?.data.error.message, {
        autoClose: 2000,
        theme: "light",
        transition: Bounce,
      });
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
    setExperienceList((prev) => [...prev, newExperience]);
    setResumeInfo((prev) => ({
      ...prev,
      experience: [...experienceList, newExperience],
    }));
  };

  const handleRemoveExperience = (exId: string) => {
    setExperienceList((prev) => prev.filter((exp) => exp.exId !== exId));
    setResumeInfo((prev) => ({
      ...prev,
      experience: experienceList.filter((exp) => exp.exId !== exId),
    }));
  };

  const handleMoveExperience = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    const updatedExperience = [...experienceList];
    const movedExperience = updatedExperience.splice(index, 1);
    updatedExperience.splice(newIndex, 0, movedExperience[0]);
    setExperienceList(updatedExperience);
    setResumeInfo((prev) => ({
      ...prev,
      experience: updatedExperience,
    }));
  };

  return (
    <div className="resume-form">
      <h2 className="form-title">Experience</h2>

      <div className="form__scroll-bar">
        {experienceList.length === 0 ? (
          <motion.div
            variants={VForm}
            initial="initial"
            animate="animate"
            exit="exit"
            className="border p-4 rounded-lg shadow-md"
          >
            <p className="text-center">No experience added yet</p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {experienceList.map((exp, index) => (
              <motion.div
                key={exp.exId}
                variants={VForm}
                initial="initial"
                animate="animate"
                exit="exit"
                className="from__container"
              >
                {/*~~~~~~~~$ Form Header $~~~~~~~~*/}
                <div className="form__container-header">
                  <h4>
                    Experience #{index + 1}
                  </h4>

                  {/*~~~~~~~~$ Move Buttons $~~~~~~~~*/}
                  <div className="move__btn-container">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={index === 0}
                      onClick={() => handleMoveExperience(index, "up")}
                    >
                      <ChevronUp className="move-icon" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMoveExperience(index, "down")}
                      disabled={
                        index === ((resumeInfo?.experience || []).length - 1)
                      }
                    >
                      <ChevronDown className="move-icon" />
                    </Button>
                  </div>
                </div>

                <form className="form-content">
                  {/*~~~~~~~~$ Form Inputs $~~~~~~~~*/}
                  <FormInput
                    id={uuidv4()}
                    label="Title"
                    placeholder="Enter Title"
                    defaultValue={exp.title}
                    onChange={(e) =>
                      handleInputChange(exp.exId, "title", e.target.value)
                    }
                    required
                  />

                  <FormInput
                    id={uuidv4()}
                    label="Company Name"
                    placeholder="Enter Company Name"
                    defaultValue={exp.companyName}
                    onChange={(e) =>
                      handleInputChange(exp.exId, "companyName", e.target.value)
                    }
                    required
                  />

                  <FormInput
                    id={uuidv4()}
                    label="City"
                    placeholder="Enter City"
                    defaultValue={exp.city}
                    onChange={(e) =>
                      handleInputChange(exp.exId, "city", e.target.value)
                    }
                    required
                  />

                  {/*~~~~~~~~$ Date Inputs $~~~~~~~~*/}
                  <div className="form__date-btn">
                    <FormInput
                      id={uuidv4()}
                      type="date"
                      label="Start Date"
                      placeholder="Enter Start Date"
                      defaultValue={exp.startDate}
                      onChange={(e) =>
                        handleInputChange(exp.exId, "startDate", e.target.value)
                      }
                      required
                    />
                    {!exp.currentlyWorking && (
                      <FormInput
                        id={uuidv4()}
                        type="date"
                        label="End Date"
                        placeholder="Enter End Date"
                        defaultValue={exp.endDate ?? ""}
                        onChange={(e) =>
                          handleInputChange(exp.exId, "endDate", e.target.value)
                        }
                        required
                      />
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      id={uuidv4()}
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
                      required
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

                {/*~~~~~~~~$ Remove Button $~~~~~~~~*/}
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
      </div>

      <div>
        <Button
          type="button"
          onClick={handleAddExperience}
          variant="success"
          className="mb-4"
          fullWidth
        >
          Add Experience
        </Button>

        <Button
          type="submit"
          isLoading={isLoading}
          onClick={handleOnSubmit}
          disabled={enableNextBtn}
          fullWidth
        >
          Save Experience
        </Button>
      </div>
    </div>
  );
};

export default ExperienceForm;

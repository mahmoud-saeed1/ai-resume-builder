import { useContext, useState } from "react";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { IErrorResponse, IEducation, IFormProbs } from "@/interfaces";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useParams } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import { AxiosError } from "axios";
import GlobalApi from "@/service/GlobalApi";
import { v4 as uuidv4 } from "uuid";
import { VForm } from "@/animation";
import FormInput from "./FormInputs";
import Label from "@/ui/Label";
import FormTextarea from "./FormTextArea";
import FormSelect from "./FormSelect";
import Button from "@/ui/Button";

const EducationForm = ({
  enableNextBtn,
  handleEnableNextBtn,
  handleDisableNextBtn,
}: IFormProbs) => {

  /*~~~~~~~~$ Context $~~~~~~~~*/
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)!;

  /*~~~~~~~~$ States $~~~~~~~~*/
  const [educationList, setEducationList] = useState<IEducation[]>(
    resumeInfo?.education || []
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const params = useParams<{ resumeId: string }>();

  /*~~~~~~~~$ Handlers $~~~~~~~~*/
  const handleInputChange = (
    edId: string,
    field: keyof IEducation,
    value: string | boolean
  ) => {
    setEducationList((prev) =>
      prev.map((edu) => (edu.edId === edId ? { ...edu, [field]: value } : edu))
    );
    setResumeInfo((prev) => ({
      ...prev,
      education: educationList,
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
      const educationWithoutId = educationList.map((edu) => {
        const { id, ...rest } = edu;
        return rest;
      });

      const personalDataWithoutId = resumeInfo?.personalData
        ? resumeInfo.personalData.map(({ id, ...rest }) => rest)
        : [];

      const { status } = await GlobalApi.UpdateResumeData(params.resumeId, {
        personalData: personalDataWithoutId,
        education: educationWithoutId,
      });

      if (status === 200) {
        toast.success("Education saved successfully.", {
          autoClose: 1000,
          theme: "light",
          transition: Bounce,
        });
        handleEnableNextBtn();
      }
    } catch (error) {
      const err = error as AxiosError<IErrorResponse>;
      toast.error(err.response?.data.error.message, {
        autoClose: 2000,
        theme: "light",
        transition: Bounce,
      });
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
    setEducationList((prev) => [...prev, newEducation]);
    setResumeInfo((prev) => ({
      ...prev,
      education: [...educationList, newEducation],
    }));
  };

  const handleRemoveEducation = (edId: string) => {
    setEducationList((prev) => prev.filter((edu) => edu.edId !== edId));
    setResumeInfo((prev) => ({
      ...prev,
      education: educationList.filter((edu) => edu.edId !== edId),
    }));
  };

  const handleMoveEducation = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    const updatedEducation = [...educationList];
    const movedEducation = updatedEducation.splice(index, 1);
    updatedEducation.splice(newIndex, 0, movedEducation[0]);
    setEducationList(updatedEducation);
    setResumeInfo((prev) => ({
      ...prev,
      education: updatedEducation,
    }));
  };


  return (
    <div className="resume-form">
      <h2 className="form-title">education</h2>


      <div className="form__scroll-bar">
        {educationList.length === 0 ? (
          <motion.div
            variants={VForm}
            initial="initial"
            animate="animate"
            exit="exit"
            className="border p-4 rounded-lg shadow-md"
          >
            <p className="text-center">No education added yet</p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {educationList.map((edu, index) => (
              <motion.div
                key={edu.edId}
                variants={VForm}
                initial="initial"
                animate="animate"
                exit="exit"
                className="from__container"
              >
                {/*~~~~~~~~$ Form Header $~~~~~~~~*/}
                <div className="form__container-header">
                  <h4>
                    Education #{index + 1}
                  </h4>

                  {/*~~~~~~~~$ Move Buttons $~~~~~~~~*/}
                  <div className="move__btn-container">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={index === 0}
                      onClick={() => handleMoveEducation(index, "up")}
                    >
                      <ChevronUp className="move-icon" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMoveEducation(index, "down")}
                      disabled={
                        index === (resumeInfo?.education || []).length - 1
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
                    label="University Name"
                    placeholder="University Name"
                    defaultValue={edu.universityName}
                    onChange={(e) =>
                      handleInputChange(
                        edu.edId,
                        "universityName",
                        e.target.value
                      )
                    }
                    required
                  />

                  <FormSelect
                    id={uuidv4()}
                    label="Degree"
                    defaultValue={edu.degree}
                    onChange={(e) =>
                      handleInputChange(edu.edId, "degree", e.target.value)
                    }
                    required
                  >
                    <option value="" disabled>
                      Select Degree
                    </option>
                    <option value="Bachelor">Bachelor</option>
                    <option value="Master">Master</option>
                    <option value="Doctorate">Doctorate</option>
                    <option value="Associate">Associate</option>
                    <option value="Diploma">Diploma</option>
                    <option value="Certificate">Certificate</option>
                    <option value="High School">High School</option>
                    <option value="Vocational">Vocational</option>
                  </FormSelect>

                  <FormInput
                    id={uuidv4()}
                    label="Major"
                    placeholder="Major"
                    defaultValue={edu.major}
                    onChange={(e) =>
                      handleInputChange(edu.edId, "major", e.target.value)
                    }
                    required
                  />

                  <FormInput
                    id={uuidv4()}
                    label="Minor"
                    placeholder="Minor"
                    defaultValue={edu.minor}
                    onChange={(e) =>
                      handleInputChange(edu.edId, "minor", e.target.value)
                    }
                  />

                  {/*~~~~~~~~$ Date Inputs $~~~~~~~~*/}
                  <div className="form__date-btn">
                    <FormInput
                      id={uuidv4()}
                      type="date"
                      label="Start Date"
                      placeholder="Start Date"
                      defaultValue={edu.startDate}
                      onChange={(e) =>
                        handleInputChange(edu.edId, "startDate", e.target.value)
                      }
                      required
                    />
                    {!edu.currentlyStudy && (
                      <FormInput
                        id={uuidv4()}
                        type="date"
                        label="End Date"
                        placeholder="End Date"
                        defaultValue={edu.endDate}
                        onChange={(e) =>
                          handleInputChange(edu.edId, "endDate", e.target.value)
                        }
                        required
                      />
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      title="Currently Studying"
                      checked={edu.currentlyStudy}
                      onChange={(e) =>
                        handleInputChange(
                          edu.edId,
                          "currentlyStudy",
                          e.target.checked
                        )
                      }
                    />
                    <Label>Currently Studying</Label>
                  </div>

                  {/*~~~~~~~~$ Description $~~~~~~~~*/}
                  <FormTextarea
                    id={uuidv4()}
                    label="Description"
                    placeholder="Description"
                    defaultValue={edu.description}
                    onChange={(e) =>
                      handleInputChange(edu.edId, "description", e.target.value)
                    }
                  />
                </form>

                {/*~~~~~~~~$ Remove Button $~~~~~~~~*/}
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
      </div>


      <div>
        <Button
          type="button"
          onClick={handleAddEducation}
          variant="success"
          className="mb-4"
          fullWidth
        >
          Add Education
        </Button>

        <Button
          type="submit"
          isLoading={isLoading}
          onClick={handleOnSubmit}
          disabled={enableNextBtn}
          fullWidth
        >
          Save Education
        </Button>
      </div>

    </div>
  );
};

export default EducationForm;

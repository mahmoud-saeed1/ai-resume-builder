import { useContext, useEffect, useState } from "react";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { IExperience, IErrorResponse } from "@/interfaces";
import RichTextEditor from "./RichTextEditor";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Bounce, toast } from "react-toastify";
import GlobalApi from "@/service/GlobalApi";
import { AxiosError } from "axios";
import FormInput from "./FormInputs";
import { useParams } from "react-router-dom";
import { SExperience } from "@/validation";

const ExperienceForm = () => {
  /*~~~~~~~~$ States $~~~~~~~~*/
  const [experience, setExperience] = useState<IExperience[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /*~~~~~~~~$ Context $~~~~~~~~*/
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext) ?? {};
  if (!setResumeInfo) throw new Error("ResumeInfoContext is undefined");

  const params = useParams<{ id: string }>();

  /*~~~~~~~~$ Form $~~~~~~~~*/
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IExperience>({
    resolver: yupResolver(SExperience),
  });

  /*~~~~~~~~$ Handlers $~~~~~~~~*/
  const handleInputChange = (
    id: string,
    key: string,
    value: string | boolean
  ) => {
    const updatedExperience = experience.map((exp) =>
      exp.id === id ? { ...exp, [key]: value } : exp
    );
    setExperience(updatedExperience);
    setResumeInfo((prev) => ({
      ...prev,
      experience: updatedExperience,
    }));
  };
 

  const handleAddExperience = () => {
    const newExperience: IExperience = {
      id: Date.now().toString(),
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

  const handleRemoveExperience = (id: string) => {
    setExperience((prev) => prev.filter((exp) => exp.id !== id));
    setResumeInfo((prev) => ({
      ...prev,
      experience: experience.filter((exp) => exp.id !== id),
    }));
  };

  const handleMoveExperience = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    const updatedExperience = [...experience];
    const [movedExperience] = updatedExperience.splice(index, 1);
    updatedExperience.splice(newIndex, 0, movedExperience);
    setExperience(updatedExperience);
    setResumeInfo((prev) => ({
      ...prev,
      experience: updatedExperience,
    }));
  };

  const handleOnSubmit: SubmitHandler<IExperience> = async (data) => {
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
      const { status } = await GlobalApi.UpdateResumeDetails(params.id, {
        data,
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

  /*~~~~~~~~$ Animation Variants $~~~~~~~~*/
  const animationVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  };

  /*~~~~~~~~$ useEffect $~~~~~~~~*/
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
              key={exp.id}
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
                      index === (resumeInfo?.experience ?? []).length - 1
                    }
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveExperience(exp.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <form onSubmit={handleSubmit(handleOnSubmit)}>
                {experience.map((exp, index) => (
                  <div key={exp.id} className="experience-section">
                    <FormInput
                      label="Job Title"
                      name="title"
                      placeholder="Enter job title"
                      register={register("title")}
                      errorMessage={errors.title?.message}
                      onChange={(e) =>
                        handleInputChange(exp.id, "title", e.target.value)
                      }
                    />
                    <FormInput
                      label="Company Name"
                      name="companyName"
                      placeholder="Enter company name"
                      register={register("companyName")}
                      errorMessage={errors.companyName?.message}
                      onChange={(e) =>
                        handleInputChange(exp.id, "companyName", e.target.value)
                      }
                    />
                    <FormInput
                      label="City"
                      name="city"
                      placeholder="Enter city"
                      register={register("city")}
                      errorMessage={errors.city?.message}
                      onChange={(e) =>
                        handleInputChange(exp.id, "city", e.target.value)
                      }
                    />
                    <FormInput
                      label="State"
                      name="state"
                      placeholder="Enter state"
                      register={register("state")}
                      errorMessage={errors.state?.message}
                      onChange={(e) =>
                        handleInputChange(exp.id, "state", e.target.value)
                      }
                    />
                    <div className="flex gap-4">
                      <FormInput
                        label="Start Date"
                        name="startDate"
                        type="date"
                        placeholder="Enter start date"
                        register={register("startDate")}
                        errorMessage={errors.startDate?.message}
                        onChange={(e) =>
                          handleInputChange(exp.id, "startDate", e.target.value)
                        }
                      />
                      <FormInput
                        label="End Date"
                        name="endDate"
                        type="date"
                        placeholder="Enter end date"
                        register={register("endDate")}
                        errorMessage={errors.endDate?.message}
                        onChange={(e) =>
                          handleInputChange(exp.id, "endDate", e.target.value)
                        }
                      />
                    </div>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={exp.currentlyWorking}
                        onChange={(e) =>
                          handleInputChange(
                            exp.id,
                            "currentlyWorking",
                            e.target.checked
                          )
                        }
                      />
                      <span>Currently Working</span>
                    </label>
                    <FormInput
                      label="Work Summary"
                      name="workSummary"
                      placeholder="Describe your role"
                      register={register("workSummary")}
                      errorMessage={errors.workSummary?.message}
                      onChange={(e) =>
                        handleInputChange(exp.id, "workSummary", e.target.value)
                      }
                    />

                    {/* Control Buttons */}
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => handleMoveExperience(index, "up")}
                        disabled={index === 0}
                      >
                        Move Up
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveExperience(index, "down")}
                        disabled={index === experience.length - 1}
                      >
                        Move Down
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveExperience(exp.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddExperience}
                  className="btn-primary"
                >
                  Add Experience
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary"
                >
                  {isLoading ? "Saving..." : "Save Experience"}
                </button>
              </form>

              <RichTextEditor
                index={index}
                onRichTextEditorChange={(content) =>
                  handleInputChange(exp.id, "workSummary", content)
                }
                defaultValue={exp.workSummary}
              />

              <div className="flex justify-end">
                <Button
                  variant={"destructive"}
                  size="sm"
                  onClick={() => handleRemoveExperience(exp.id)}
                >
                  Remove
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}

      <Button onClick={handleAddExperience} variant="outline" className="mb-4">
        Add Experience
      </Button>
    </div>
  );
};

export default ExperienceForm;

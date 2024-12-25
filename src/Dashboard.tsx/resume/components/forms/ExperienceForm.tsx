import { useContext, useEffect, useState, ChangeEvent, useCallback } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { IFormProbs, IExperience, IErrorResponse } from "@/interfaces";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useParams } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import GlobalApi from "@/service/GlobalApi";
import Button from "@/ui/Button";
import RichTextEditor from "./RichTextEditor";
import NoData from "./NoData";
import FormInput from "./FormInput";
import { AxiosError } from "axios";
import { experienceSchema } from "@/validation";

const ExperienceForm = ({
  enableNextBtn,
  handleEnableNextBtn,
  handleDisableNextBtn,
}: IFormProbs) => {

  /*~~~~~~~~$ States $~~~~~~~~*/
  const [isLoading, setIsLoading] = useState(false);

  /*~~~~~~~~$ Context $~~~~~~~~*/
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)!;

  const params = useParams<{ resumeId: string }>();

  /*~~~~~~~~$ Forms $~~~~~~~~*/
  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<{ experience: IExperience[] }>({
    resolver: yupResolver(experienceSchema),
    defaultValues: {
      experience: resumeInfo?.experience || [],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "experience",
  });


  const experience = watch("experience");

  /*~~~~~~~~$ Effects $~~~~~~~~*/
  //! Sync local state with resumeInfo context
  useEffect(() => {
    if (resumeInfo?.experience) {
      reset({ experience: resumeInfo.experience });
    }
  }, [reset]);

  useEffect(() => {
    experience?.forEach((exp, index) => {
      if (exp.currentlyWorking) {
        setValue(`experience.${index}.endDate`, "");
        trigger(`experience.${index}.endDate`);
      }
    });

    // Real-time update of context when experience changes
    setResumeInfo((prev) => ({
      ...prev,
      experience: (experience ?? []).map(exp => ({
        ...exp,
        currentlyWorking: exp.currentlyWorking ?? false,
      })),
    }));
  }, [setValue, trigger, setResumeInfo]);


  /*~~~~~~~~$ Handlers $~~~~~~~~*/
  const handleUpdateResumeInfo = useCallback(
    (updatedExperience: IExperience[]) => {
      setResumeInfo((prev) => ({
        ...prev,
        experience: updatedExperience,
      }));
    },
    [setResumeInfo]
  );

  const handleAddExperience = () => {
    const newExperience = {
      title: "",
      companyName: "",
      city: "",
      state: "",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
      workSummary: "",
    };
    append(newExperience);
    handleDisableNextBtn();
  };

  //! udpate context values while input changes
  const handleInputChange = useCallback(
    (index: number, field: keyof IExperience, value: string | boolean) => {
      setValue(`experience.${index}.${field}`, value, { shouldValidate: true });
      trigger(`experience.${index}.${field}`);

      handleDisableNextBtn();

      setResumeInfo((prev) => {
        const updatedExperience = [...(prev?.experience || [])];
        updatedExperience[index] = {
          ...updatedExperience[index],
          [field]: value,
          ...(field === "currentlyWorking" && !value
            ? { endDate: "" } // Reset endDate if currentlyWorking is toggled to false
            : {}),
        };
        return { ...prev, experience: updatedExperience };
      });

      // If currentlyWorking is toggled to false, set endDate to today's date or a default value
      if (field === "currentlyWorking" && !value) {
        setValue(`experience.${index}.endDate`, new Date().toISOString().split("T")[0]); // Set to today's date
        trigger(`experience.${index}.endDate`);
      }
    },
    [setValue, trigger, setResumeInfo, handleDisableNextBtn]
  );

  const handleChange =
    (index: number, field: keyof IExperience) =>
      (e: ChangeEvent<HTMLInputElement>) => {
        handleInputChange(index, field, e.target.type === 'checkbox' ? e.target.checked : e.target.value);
      };


  const handleRemoveExperience = (index: number) => {
    remove(index);
    handleDisableNextBtn();
  };

  const handleMoveExperience = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    move(index, newIndex);
  };

  const handleOnSubmit = async (data: { experience: IExperience[] }) => {
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
      const experienceWithoutId = data.experience.map(({ id, ...rest }) => {
        console.log(id)
        return rest;
      });
      
      const { status } = await GlobalApi.UpdateResumeData(params.resumeId, {
        experience: experienceWithoutId,
      });

      if (status === 200) {
        toast.success("Experience saved successfully.", {
          autoClose: 1000,
          theme: "light",
          transition: Bounce,
        });
        handleUpdateResumeInfo(experienceWithoutId);
        handleEnableNextBtn();
      }
    } catch (error) {
      const err = error as AxiosError<IErrorResponse>;
      console.error("API Error Response:", err.response);
      toast.error(err.response?.data.error.message || "An error occurred", {
        autoClose: 2000,
        theme: "light",
        transition: Bounce,
      });
    } finally {
      setIsLoading(false);
    }
  };

  {/*~~~~~~~~$ Reusable Render Function $~~~~~~~~*/ }
  const dynamicFormInput = ({
    name,
    label,
    index,
    type = "text",
    className,
  }: {
    name: `experience.${number}.${keyof IExperience}`;
    label: string;
    index: number;
    type?: string;
    className?: string;
  }) => {
    return (
      <Controller
        name={name}
        control={control}
        defaultValue={experience?.[index]?.[name.split(".")[2] as keyof IExperience] || ""}
        render={({ field }) => (
          <FormInput
            {...field}
            ref={field.ref}
            id={name}
            type={type}
            label={label}
            placeholder={`Enter ${label}`}
            errorMessage={
              errors.experience?.[index]?.[
                name.split(".")[2] as keyof IExperience
              ]?.message
            }
            onChange={(e) =>
              handleChange(index, name.split(".")[2] as keyof IExperience)(e)
            }
            className={className}
          />
        )}
      />
    );
  };

  return (
    <div className="resume-form">
      <h2 className="form-title">Experience</h2>
      <div className="form__scroll-bar">
        {fields.length === 0 ? (
          <NoData message="No Experience added yet." />
        ) : (
          <AnimatePresence>
            {fields.map((field, index) => (
              <motion.div
                key={field.id}
                variants={{
                  initial: { opacity: 0, y: 10 },
                  animate: { opacity: 1, y: 0 },
                  exit: { opacity: 0, y: -10 },
                }}
                initial="initial"
                animate="animate"
                exit="exit"
                className="form__container"
              >

                {/*~~~~~~~~$ Form Header $~~~~~~~~*/}
                <div className="form__container-header">
                  <h4>Experience #{index + 1}</h4>

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
                      disabled={index === fields.length - 1}
                    >
                      <ChevronDown className="move-icon" />
                    </Button>
                  </div>
                </div>

                {/*~~~~~~~~$ Form Inputs $~~~~~~~~*/}
                <form className="form-content">

                  {/*~~~~~~~~$ Title Input $~~~~~~~~*/}
                  {dynamicFormInput({ name: `experience.${index}.title`, label: "Title", index })}

                  {/*~~~~~~~~$ Company Name Input $~~~~~~~~*/}
                  {dynamicFormInput({ name: `experience.${index}.companyName`, label: "Company Name", index })}

                  {/*~~~~~~~~$ City Input $~~~~~~~~*/}
                  {dynamicFormInput({ name: `experience.${index}.city`, label: "City", index })}

                  {/*~~~~~~~~$ State Input $~~~~~~~~*/}
                  {dynamicFormInput({ name: `experience.${index}.state`, label: "State", index })}

                  {/*~~~~~~~~$ Start Date Input $~~~~~~~~*/}
                  {dynamicFormInput({ name: `experience.${index}.startDate`, label: "Start Date", index, type: "date" })}

                  {/*~~~~~~~~$ End Date Input $~~~~~~~~*/}
                  {!experience[index]?.currentlyWorking && dynamicFormInput({
                    name: `experience.${index}.endDate`,
                    label: "End Date",
                    index,
                    type: "date",
                  })}


                  {/*~~~~~~~~$ Currently Working Input $~~~~~~~~*/}
                  {
                    dynamicFormInput({ name: `experience.${index}.currentlyWorking`, label: "currently works", index, type: "checkbox", className: "flex items-center shadow-none flex-row-reverse" })
                  }

                  {/*~~~~~~~~$ Work Summary Input $~~~~~~~~*/}
                  <Controller
                    name={`experience.${index}.workSummary`}
                    control={control}
                    render={({ field }) => (
                      <RichTextEditor
                        {...field}
                        index={index}
                        defaultValue={field.value}
                        onRichTextEditorChange={(value) =>
                          setValue(`experience.${index}.workSummary`, value)
                        }
                      />
                    )}
                  />
                </form>

                {/*~~~~~~~~$ Remove Btn $~~~~~~~~*/}
                <div className="remove-btn">
                  <Button
                    type="button"
                    variant={"danger"}
                    size="sm"
                    onClick={() => handleRemoveExperience(index)}
                  >
                    Remove
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/*~~~~~~~~$ Add & Save Buttons $~~~~~~~~*/}
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
          onClick={handleSubmit(handleOnSubmit)}
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
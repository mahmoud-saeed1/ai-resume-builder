import { useContext, useEffect, useState, ChangeEvent, useCallback } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { IFormProbs, IEducation, IErrorResponse } from "@/interfaces";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useParams } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import GlobalApi from "@/service/GlobalApi";
import Button from "@/ui/Button";
import NoData from "./NoData";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import { AxiosError } from "axios";
import { EducationSchema } from "@/validation";
import { EducationDegrees } from "@/constants";

const EducationForm = ({
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
  } = useForm<{ education: IEducation[] }>({
    resolver: yupResolver(EducationSchema),
    defaultValues: {
      education: resumeInfo?.education || [],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "education",
  });

  const education = watch("education");

  /*~~~~~~~~$ Effects $~~~~~~~~*/
  //! Sync local state with resumeInfo context
  useEffect(() => {
    if (resumeInfo?.education) {
      reset({ education: resumeInfo.education });
    }
  }, [reset]);

  useEffect(() => {
    education?.forEach((exp, index) => {
      if (exp.currentlyStudy) {
        setValue(`education.${index}.endDate`, "");
        trigger(`education.${index}.endDate`);
      }
    });

  
    setResumeInfo((prev) => ({
      ...prev,
      education: (education ?? []).map(exp => ({
        ...exp,
        currentlyStudy: exp.currentlyStudy ?? false,
      })),
    }));
  }, [setValue, trigger, setResumeInfo]);

  const handleUpdateResumeInfo = useCallback(
    (updatedEducation: IEducation[]) => {
      setResumeInfo((prev) => ({
        ...prev,
        education: updatedEducation,
      }));
    },
    [setResumeInfo]
  );

  const handleAddEducation = () => {
    const newEducation: IEducation = {
      universityName: "",
      startDate: "",
      endDate: "",
      currentlyStudy: false,
      degree: "",
      major: "",
      minor: "",
      description: "",
    };
    append(newEducation);
    handleDisableNextBtn();
  };

  const handleInputChange = useCallback(
    (index: number, field: keyof IEducation, value: string | boolean) => {
      setValue(`education.${index}.${field}`, value, { shouldValidate: true });
      trigger(`education.${index}.${field}`);

      handleDisableNextBtn();

      //! Real-time update of context when education changes
      setResumeInfo((prev) => {
        const updatedEducation = [...(prev?.education || [])];
        updatedEducation[index] = {
          ...updatedEducation[index],
          [field]: value,
          ...(field === "currentlyStudy" && !value
            ? { endDate: "" } // Reset endDate if currentlyStudy is toggled to false
            : {}),
        };
        return { ...prev, education: updatedEducation };
      });

      // If currentlyStudy is toggled to false, set endDate to today's date or a default value
      if (field === "currentlyStudy" && !value) {
        setValue(
          `education.${index}.endDate`,
          new Date().toISOString().split("T")[0]
        );
        trigger(`education.${index}.endDate`);
      }
    },
    [setValue, trigger, setResumeInfo, handleDisableNextBtn]
  );

  const handleChange =
    (index: number, field: keyof IEducation) =>
      (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        handleInputChange(index, field, e.target.type === "checkbox" ? e.target.checked : e.target.value);
      };

  const handleRemoveEducation = (index: number) => {
    remove(index);
    handleDisableNextBtn();
  };

  const handleMoveEducation = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    move(index, newIndex);
  };

  const handleOnSubmit = async (data: { education: IEducation[] }) => {
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
      const educationWithoutId = data.education.map(({ id, ...rest }) => {
        console.log(id)
        return rest
      });

      const { status } = await GlobalApi.UpdateResumeData(params.resumeId, {
        education: educationWithoutId,
      });

      if (status === 200) {
        toast.success("Education saved successfully.", {
          autoClose: 1000,
          theme: "light",
          transition: Bounce,
        });
        handleUpdateResumeInfo(educationWithoutId);
        handleEnableNextBtn();
      }
    } catch (error) {
      const err = error as AxiosError<IErrorResponse>;
      toast.error(err.response?.data.error.message || "An error occurred", {
        autoClose: 2000,
        theme: "light",
        transition: Bounce,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const dynamicFormInput = ({
    name,
    label,
    index,
    type = "text",
    className,
  }: {
    name: `education.${number}.${keyof IEducation}`;
    label: string;
    index: number;
    type?: string;
    className?: string;
  }) => (
    <Controller
      name={name}
      control={control}
      defaultValue={education?.[index]?.[name.split(".")[2] as keyof IEducation] || ""}
      render={({ field }) => (
        <FormInput
          {...field}
          ref={field.ref}
          id={name}
          type={type}
          label={label}
          placeholder={`Enter ${label}`}
          errorMessage={
            errors.education?.[index]?.[
              name.split(".")[2] as keyof IEducation
            ]?.message
          }
          onChange={(e) =>
            handleChange(index, name.split(".")[2] as keyof IEducation)(e)
          }
          className={className}
        />
      )}
    />
  );

  return (
    <div className="resume-form">
      <h2 className="form-title">Education</h2>
      <div className="form__scroll-bar">
        {fields.length === 0 ? (
          <NoData message="No Education added yet." />
        ) : (
          <AnimatePresence>
            {fields.map((field, index) => (
              <motion.div
                key={field.id + index}
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
                <div className="form__container-header">
                  <h4>Education #{index + 1}</h4>
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
                      disabled={index === fields.length - 1}
                      onClick={() => handleMoveEducation(index, "down")}
                    >
                      <ChevronDown className="move-icon" />
                    </Button>
                  </div>
                </div>
                <form className="form-content">
                  {dynamicFormInput({ name: `education.${index}.universityName`, label: "University Name", index })}
                  <Controller
                    name={`education.${index}.degree`}
                    control={control}
                    defaultValue={education?.[index]?.degree || ""}
                    render={({ field }) => (
                      <FormSelect
                        {...field}
                        id={`education.${index}.degree`}
                        label="Degree"
                        errorMessage={errors.education?.[index]?.degree?.message}
                        onChange={(e) => handleChange(index, "degree")(e as ChangeEvent<HTMLInputElement | HTMLSelectElement>)}
                      >
                        {EducationDegrees.map((degree) => (<option key={degree.value} value={degree.value}>{degree.label}</option>))}
                      </FormSelect>
                    )}
                  />
                  {dynamicFormInput({ name: `education.${index}.major`, label: "Major", index })}
                  {dynamicFormInput({ name: `education.${index}.minor`, label: "Minor", index })}
                  <div className="form__date-btn">
                    {dynamicFormInput({ name: `education.${index}.startDate`, label: "Start Date", index, type: "date" })}
                    {!education[index].currentlyStudy && (
                      dynamicFormInput({ name: `education.${index}.endDate`, label: "End Date", index, type: "date" })
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      title="Currently Studying"
                      checked={education[index].currentlyStudy}
                      onChange={(e) => handleInputChange(index, "currentlyStudy", e.target.checked)}
                    />
                    <label>Currently Studying</label>
                  </div>

                  {dynamicFormInput({ name: `education.${index}.description`, label: "Description", index })}



                </form>
                <div className="remove-btn">
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveEducation(index)}
                  >
                    Remove
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
      <Button
        type="button"
        variant="success"
        className="mb-4"
        fullWidth
        onClick={handleAddEducation}
      >
        Add Education
      </Button>
      <Button
        type="submit"
        isLoading={isLoading}
        fullWidth
        onClick={handleSubmit(handleOnSubmit)}
        disabled={enableNextBtn}
      >
        Save Education
      </Button>
    </div>
  );
}

export default EducationForm;
import { useContext, useEffect, useState, ChangeEvent, useCallback } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { ISkills, IErrorResponse, IFormProbs } from "@/interfaces";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useParams } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import GlobalApi from "@/service/GlobalApi";
import Button from "@/ui/Button";
import FormInput from "./FormInput";
import NoData from "./NoData";
import { AxiosError } from "axios";
import { SkillsSchema } from "@/validation"; // Ensure you import the correct validation schema
import StarRatings from "react-star-ratings";

const SkillsForm = ({
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
  } = useForm<{ skills: ISkills[] }>({
    resolver: yupResolver(SkillsSchema),
    defaultValues: {
      skills: resumeInfo?.skills || [],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "skills",
  });

  const skills = watch("skills");

  /*~~~~~~~~$ Effects $~~~~~~~~*/
  useEffect(() => {
    if (resumeInfo?.skills) {
      reset({ skills: resumeInfo.skills });
    }
  }, [reset]);

  /*~~~~~~~~$ Handlers $~~~~~~~~*/
  const handleUpdateResumeInfo = useCallback(
    (updatedSkills: ISkills[]) => {
      setResumeInfo((prev) => ({
        ...prev,
        skills: updatedSkills,
      }));
    },
    [setResumeInfo]
  );

  const handleAddSkill = () => {
    const newSkill: ISkills = {
      name: "",
      rating: 0,
    };
    append(newSkill);
    handleDisableNextBtn();
  };

  const handleInputChange = useCallback(
    (index: number, field: keyof ISkills, value: string | number) => {
      setValue(`skills.${index}.${field}`, value, { shouldValidate: true });
      trigger(`skills.${index}.${field}`);
      handleDisableNextBtn();

      //! Real-time update of context when project changes
      setResumeInfo((prev) => {
        const updatedSkills = [...(prev?.skills || [])];
        updatedSkills[index] = {
          ...updatedSkills[index],
          [field]: value,
        };
        return { ...prev, skills: updatedSkills };
      });
    },
    [setValue, trigger, handleDisableNextBtn]
  );

  const handleChange =
    (index: number, field: keyof ISkills) =>
      (e: ChangeEvent<HTMLInputElement>) => {
        handleInputChange(index, field, e.target.value);
      };

  const handleStarRatingChange = (index: number, newRating: number) => {
    handleInputChange(index, "rating", newRating);
  };

  const handleRemoveSkill = (index: number) => {
    remove(index);
    handleDisableNextBtn();
  };

  const handleMoveSkill = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    move(index, newIndex);
  };

  const handleOnSubmit = async (data: { skills: ISkills[] }) => {
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
      const skillsWithoutId = data.skills.map(({ id, ...rest }) => { console.log(id); return rest; });
      const { status } = await GlobalApi.UpdateResumeData(params.resumeId, {
        skills: skillsWithoutId,
      });

      if (status === 200) {
        toast.success("Skills saved successfully.", {
          autoClose: 1000,
          theme: "light",
          transition: Bounce,
        });
        handleUpdateResumeInfo(data.skills);
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
  }: {
    name: `skills.${number}.${keyof ISkills}`;
    label: string;
    index: number;
  }) => (
    <Controller
      name={name}
      control={control}
      defaultValue={skills?.[index]?.[name.split("")[2] as keyof ISkills] || ""}
      render={({ field }) => (
        <FormInput
          {...field}
          id={name}
          type="text"
          label={label}
          placeholder={`Enter ${label}`}
          errorMessage={errors.skills?.[index]?.[name.split(".")[2] as keyof ISkills]?.message}
          onChange={(e) => handleChange(index, name.split(".")[2] as keyof ISkills)(e)}
        />
      )}
    />
  );

  return (
    <div className="resume-form">
      <h2 className="form-title">Skills</h2>

      <div className="form__scroll-bar">
        {fields.length === 0 ? (
          <NoData message="No skills added yet." />
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
                <div className="form__container-header">
                  <h4>Skill #{index + 1}</h4>
                  <div className="move__btn-container">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={index === 0}
                      onClick={() => handleMoveSkill(index, "up")}
                    >
                      <ChevronUp className="move-icon" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={index === fields.length - 1}
                      onClick={() => handleMoveSkill(index, "down")}
                    >
                      <ChevronDown className="move-icon" />
                    </Button>
                  </div>
                </div>
                <form className="form-content">
                  {dynamicFormInput({ name: `skills.${index}.name`, label: "Skill Name", index })}
                  <div className="space-x-2">
                    <label>Rating</label>
                    <StarRatings
                      rating={skills[index]?.rating ?? 0}
                      starRatedColor="gold"
                      starHoverColor="gold"
                      changeRating={(newRating) => handleStarRatingChange(index, newRating)}
                      numberOfStars={5}
                      name={`rating-${index}`}
                      starDimension="20px"
                      starSpacing="5px"
                    />
                  </div>
                </form>
                <div className="remove-btn">
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveSkill(index)}
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
        onClick={handleAddSkill}
      >
        Add Skill
      </Button>

      <Button
        type="submit"
        isLoading={isLoading}
        fullWidth
        onClick={handleSubmit(handleOnSubmit)}
        disabled={enableNextBtn}
      >
        Save Skills
      </Button>
    </div>
  );
};

export default SkillsForm;

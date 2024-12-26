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
  /*~~~~~~~~$ Context $~~~~~~~~*/
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)!;
  const params = useParams<{ resumeId: string }>();
  const [isLoading, setIsLoading] = useState(false);

  /*~~~~~~~~$ Forms $~~~~~~~~*/
  const {
    control,
    handleSubmit,
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

  /*~~~~~~~~$ Effects $~~~~~~~~*/
  useEffect(() => {
    reset({ skills: resumeInfo?.skills || [] });
  }, [reset]);

  useEffect(() => {
    const updatedSkills = fields.map((skill) => ({
      ...skill,
      skId: skill.skId || Date.now().toString(), // Ensure skId is set if not present
    }));

    setResumeInfo((prev) => ({
      ...prev,
      skills: updatedSkills,
    }));
  }, [fields, setResumeInfo]);

  /*~~~~~~~~$ Handlers $~~~~~~~~*/
  const handleAddSkill = () => {
    const newSkill: ISkills = {
      skId: Date.now().toString(), // Unique ID for each skill
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
      const { status } = await GlobalApi.UpdateResumeData(params.resumeId, {
        skills: data.skills,
      });

      if (status === 200) {
        toast.success("Skills saved successfully.", {
          autoClose: 1000,
          theme: "light",
          transition: Bounce,
        });
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
                <div className="form-content">
                  {dynamicFormInput({ name: `skills.${index}.name`, label: "Skill Name", index })}
                  <label>Rating</label>
                  <StarRatings
                    rating={field.rating ?? 0}
                    starRatedColor="gold"
                    starHoverColor="gold"
                    changeRating={(newRating) => handleStarRatingChange(index, newRating)}
                    numberOfStars={5}
                    name={`rating-${index}`}
                    starDimension="20px"
                    starSpacing="5px"
                  />
                </div>
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

// import { useContext, useEffect, useState } from "react";
// import { ResumeInfoContext } from "@/context/ResumeInfoContext";
// import { IErrorResponse, IFormProbs, ISkills } from "@/interfaces";
// import { v4 as uuidv4 } from "uuid";
// import { motion, AnimatePresence } from "framer-motion";
// import { ChevronDown, ChevronUp } from "lucide-react";
// import Button from "@/ui/Button";
// import StarRatings from "react-star-ratings"; // Importing the react-star-ratings library
// import { useParams } from "react-router-dom";
// import { VForm } from "@/animation";
// import { Bounce, toast } from "react-toastify";
// import GlobalApi from "@/service/GlobalApi";
// import { AxiosError } from "axios";
// import FormInput from "./FormInput";
// import NoData from "./NoData";

// const SkillsForm = ({
//   enableNextBtn,
//   handleEnableNextBtn,
//   handleDisableNextBtn,
// }: IFormProbs) => {
//   const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)!;
//   const [skillsList, setSkillsList] = useState<ISkills[]>(
//     resumeInfo?.skills || []
//   );
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const params = useParams<{ resumeId: string }>();

//   /*~~~~~~~~$ Get Form List Data $~~~~~~~~*/
//   useEffect(() => {
//     if (resumeInfo?.skills && resumeInfo.skills.length > 0) {
//       setSkillsList(resumeInfo.skills);
//     }

//   }, [])

//   const handleInputChange = (
//     skillId: string,
//     field: keyof ISkills,
//     value: string | number
//   ) => {
//     const updatedSkills = skillsList.map((skill) =>
//       skill.skId === skillId ? { ...skill, [field]: value } : skill
//     );
//     setSkillsList(updatedSkills);
//     setResumeInfo((prev) => ({
//       ...prev,
//       skills: updatedSkills,
//     }));

//     handleDisableNextBtn();
//   };

//   const handleOnSubmit = async () => {
//     setIsLoading(true);
//     if (!params?.resumeId) {
//       toast.error("ID parameter is missing.", {
//         autoClose: 2000,
//         theme: "light",
//         transition: Bounce,
//       });
//       setIsLoading(false);
//       return;
//     }
//     try {
//       const { status } = await GlobalApi.UpdateResumeData(params.resumeId, {
//         skills: skillsList,
//       });

//       if (status === 200) {
//         toast.success("skills saved successfully.", {
//           autoClose: 1000,
//           theme: "light",
//           transition: Bounce,
//         });

//         handleEnableNextBtn();
//       }
//     } catch (error) {
//       const err = error as AxiosError<IErrorResponse>;
//       toast.error(err.response?.data.error.message, {
//         autoClose: 2000,
//         theme: "light",
//         transition: Bounce,
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleAddSkill = () => {
//     const newSkill: ISkills = {
//       skId: uuidv4(),
//       name: "",
//       rating: 0,
//     };
//     setSkillsList([...skillsList, newSkill]);
//     setResumeInfo((prev) => ({
//       ...prev,
//       skills: [...skillsList, newSkill],
//     }));
//   };

//   const handleRemoveSkill = (skillId: string) => {
//     const updatedSkills = skillsList.filter((skill) => skill.skId !== skillId);
//     setSkillsList(updatedSkills);
//     setResumeInfo((prev) => ({
//       ...prev,
//       skills: updatedSkills,
//     }));
//   };

//   const handleMoveSkill = (index: number, direction: "up" | "down") => {
//     const newIndex = direction === "up" ? index - 1 : index + 1;
//     const updatedSkills = [...skillsList];
//     const movedSkill = updatedSkills.splice(index, 1);
//     updatedSkills.splice(newIndex, 0, movedSkill[0]);
//     setSkillsList(updatedSkills);
//     setResumeInfo((prev) => ({
//       ...prev,
//       skills: updatedSkills,
//     }));
//   };

//   useEffect(() => {
//     console.log(skillsList);
//   }, [skillsList]);

//   return (
//     <div className="resume-form">
//       <h2 className="form-title">Skills</h2>

//       <div className="form__scroll-bar">
//         {skillsList.length === 0 ? (
//           <NoData message="No skills added yet." />
//         ) : (
//           <AnimatePresence>
//             {skillsList.map((skill, index) => (
//               <motion.div
//                 key={index}
//                 variants={VForm}
//                 initial="initial"
//                 animate="animate"
//                 exit="exit"
//                 className="from__container"
//               >
//                 {/*~~~~~~~~$ Form Header $~~~~~~~~*/}
//                 <div className="form__container-header">
//                   <h4 className="font-semibold text-sm">Skill #{index + 1}</h4>

//                   {/*~~~~~~~~$ Move Buttons $~~~~~~~~*/}
//                   <div className="move__btn-container">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       disabled={index === 0}
//                       onClick={() => handleMoveSkill(index, "up")}
//                     >
//                       <ChevronUp className="move-icon" />
//                     </Button>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => handleMoveSkill(index, "down")}
//                       disabled={index === skillsList.length - 1}
//                     >
//                       <ChevronDown className="move-icon" />
//                     </Button>
//                   </div>
//                 </div>

//                 <form className="form-content">

//                   {/*~~~~~~~~$ Form Inputs $~~~~~~~~*/}
//                   <FormInput
//                     id={uuidv4()}
//                     placeholder="Skill Name"
//                     label="Skill Name"
//                     type="text"
//                     defaultValue={skill.name}
//                     onChange={(e) =>
//                       handleInputChange(skill.skId, "name", e.target.value)
//                     }
//                   />

//                   <StarRatings
//                     rating={skill.rating}
//                     starRatedColor="gold"
//                     starHoverColor="gold"
//                     changeRating={(newRating) =>
//                       handleInputChange(skill.skId, "rating", newRating)
//                     }
//                     numberOfStars={5}
//                     name="rating"
//                     starDimension="20px"
//                     starSpacing="5px"
//                   />
//                 </form>

//                 {/*~~~~~~~~$ Remove Button $~~~~~~~~*/}
//                 <div className="remove-btn">
//                   <Button
//                     type="button"
//                     variant="danger"
//                     size="sm"
//                     onClick={() => handleRemoveSkill(skill.skId)}
//                   >
//                     Remove
//                   </Button>
//                 </div>
//               </motion.div>
//             ))}
//           </AnimatePresence>
//         )}
//       </div>

//       {/*~~~~~~~~$ Add & Save Button $~~~~~~~~*/}
//       <div>
//         <Button
//           type="button"
//           onClick={handleAddSkill}
//           variant="success"
//           className="mb-4"
//           fullWidth
//         >
//           Add Skill
//         </Button>
//         <Button
//           type="submit"
//           isLoading={isLoading}
//           onClick={handleOnSubmit}
//           disabled={enableNextBtn}
//           fullWidth
//         >
//           Save Skills
//         </Button>
//       </div>

//     </div>
//   );
// };

// export default SkillsForm;

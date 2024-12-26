import { useContext, useEffect, useState, ChangeEvent, useCallback } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { IFormProbs, ILanguages, IErrorResponse } from "@/interfaces";
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
import { LanguagesSchema } from "@/validation"; // Assuming you have a validation schema for languages

const proficiencyLevels = ["Beginner", "Intermediate", "Advanced", "Fluent"];

const LanguagesForm = ({
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
  } = useForm<{ languages: ILanguages[] }>({
    resolver: yupResolver(LanguagesSchema), // Assuming you have a schema for languages
    defaultValues: {
      languages: resumeInfo?.languages || [],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "languages",
  });

  const languages = watch("languages");

  /*~~~~~~~~$ Effects $~~~~~~~~*/
  useEffect(() => {
    if (resumeInfo?.languages) {
      reset({ languages: resumeInfo.languages });
    }
  }, [reset]);

  useEffect(() => {
    setResumeInfo((prev) => ({
      ...prev,
      languages: languages.map((lang) => ({
        ...lang,
      })),
    }));
  }, [languages, setResumeInfo]);

  const handleAddLanguage = () => {
    const newLanguage: ILanguages = {
      laId: Date.now().toString(), 
      name: "",
      proficiency: "",
    };
    append(newLanguage);
    handleDisableNextBtn();
  };

  const handleInputChange = useCallback(
    (index: number, field: keyof ILanguages, value: string) => {
      setValue(`languages.${index}.${field}`, value, { shouldValidate: true });
      trigger(`languages.${index}.${field}`);
      handleDisableNextBtn();
    },
    [setValue, trigger, handleDisableNextBtn]
  );

  const handleChange =
    (index: number, field: keyof ILanguages) =>
      (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        handleInputChange(index, field, e.target.value);
      };

  const handleRemoveLanguage = (index: number) => {
    remove(index);
    handleDisableNextBtn();
  };

  const handleMoveLanguage = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    move(index, newIndex);
  };

  const handleOnSubmit = async (data: { languages: ILanguages[] }) => {
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
        languages: data.languages,
      });

      if (status === 200) {
        toast.success("Languages saved successfully.", {
          autoClose: 1000,
          theme: "light",
          transition: Bounce,
        });
        setResumeInfo((prev) => ({
          ...prev,
          languages: data.languages,
        }));
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
    name: `languages.${number}.${keyof ILanguages}`;
    label: string;
    index: number;
  }) => (
    <Controller
      name={name}
      control={control}
      defaultValue={languages?.[index]?.[name.split(".")[2] as keyof ILanguages] || ""}
      render={({ field }) => (
        <FormInput
          {...field}
          id={name}
          label={label}
          placeholder={`Enter ${label}`}
          errorMessage={errors.languages?.[index]?.[name.split(".")[2] as keyof ILanguages]?.message}
          onChange={(e) => handleChange(index, name.split(".")[2] as keyof ILanguages)(e)}
        />
      )}
    />
  );

  return (
    <div className="resume-form">
      <h2 className="form-title">Languages</h2>
      <div className="form__scroll-bar">
        {fields.length === 0 ? (
          <NoData message="No Languages added yet." />
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
                  <h4>Language #{index + 1}</h4>
                  <div className="move__btn-container">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={index === 0}
                      onClick={() => handleMoveLanguage(index, "up")}
                    >
                      <ChevronUp className="move-icon" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={index === fields.length - 1}
                      onClick={() => handleMoveLanguage(index, "down")}
                    >
                      <ChevronDown className="move-icon" />
                    </Button>
                  </div>
                </div>
                <form className="form-content">
                  {dynamicFormInput({ name: `languages.${index}.name`, label: "Language", index })}
                  <Controller
                    name={`languages.${index}.proficiency`}
                    control={control}
                    defaultValue={languages?.[index]?.proficiency || ""}
                    render={({ field }) => (
                      <FormSelect
                        {...field}
                        id={`languages.${index}.proficiency`}
                        label="Proficiency"
                        errorMessage={errors.languages?.[index]?.proficiency?.message}
                        onChange={(e) => handleChange(index, "proficiency")(e as ChangeEvent<HTMLInputElement | HTMLSelectElement>)}
                      >
                        {proficiencyLevels.map((level) => (<option key={level} value={level}>{level}</option>))}
                      </FormSelect>
                    )}
                  />
                </form>
                <div className="remove-btn">
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveLanguage(index)}
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
        onClick={handleAddLanguage}
      >
        Add Language
      </Button>
      <Button
        type="submit"
        isLoading={isLoading}
        fullWidth
        onClick={handleSubmit(handleOnSubmit)}
        disabled={enableNextBtn}
      >
        Save Languages
      </Button>
    </div>
  );
};

export default LanguagesForm;


// import { useContext, useEffect, useState } from "react";
// import { ResumeInfoContext } from "@/context/ResumeInfoContext";
// import { ILanguages, IErrorResponse, IFormProbs } from "@/interfaces";
// import { motion, AnimatePresence } from "framer-motion";
// import { ChevronDown, ChevronUp } from "lucide-react";
// import { useParams } from "react-router-dom";
// import { Bounce, toast } from "react-toastify";
// import { AxiosError } from "axios";
// import GlobalApi from "@/service/GlobalApi";
// import Button from "@/ui/Button";
// import { v4 as uuidv4 } from "uuid";
// import FormInput from "./FormInput";
// import FormSelect from "./FormSelect";
// import NoData from "./NoData";

// const proficiencyLevels = ["Beginner", "Intermediate", "Advanced", "Fluent"];

// const LanguagesForm = ({
//   enableNextBtn,
//   handleEnableNextBtn,
//   handleDisableNextBtn,
// }: IFormProbs) => {
//   const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)!;
//   const [languagesList, setLanguagesList] = useState<ILanguages[]>(
//     resumeInfo?.languages || []
//   );
//   const [isLoading, setIsLoading] = useState<boolean>(false);

//   const params = useParams<{ resumeId: string }>();

//   /*~~~~~~~~$ Get Form List Data $~~~~~~~~*/
//   useEffect(() => {
//     if (resumeInfo?.languages && resumeInfo.languages.length > 0) {
//       setLanguagesList(resumeInfo.languages);
//     }

//   }, [])

//   /*~~~~~~~~$ Handlers $~~~~~~~~*/
//   const handleInputChange = (
//     langId: string,
//     field: keyof ILanguages,
//     value: string
//   ) => {
//     setLanguagesList((prev) =>
//       prev.map((lang) =>
//         lang.laId === langId ? { ...lang, [field]: value } : lang
//       )
//     );
//     setResumeInfo((prev) => ({
//       ...prev,
//       languages: languagesList,
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
//         languages: languagesList,
//       });

//       if (status === 200) {
//         toast.success("Languages saved successfully.", {
//           autoClose: 1000,
//           theme: "light",
//           transition: Bounce,
//         });

//         handleEnableNextBtn();
//       }
//     } catch (error) {
//       const err = error as AxiosError<IErrorResponse>;
//       if (err.response?.data.error.details) {
//         err.response.data.error.details.errors.forEach((e) => {
//           toast.error(e.message, {
//             autoClose: 2000,
//             theme: "light",
//             transition: Bounce,
//           });
//         });
//       } else {
//         toast.error(err.response?.data.error.message, {
//           autoClose: 2000,
//           theme: "light",
//           transition: Bounce,
//         });
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleAddLanguage = () => {
//     const newLanguage: ILanguages = {
//       laId: uuidv4(),
//       name: "",
//       proficiency: "",
//     };
//     setLanguagesList((prev) => [...prev, newLanguage]);
//     setResumeInfo((prev) => ({
//       ...prev,
//       languages: [...languagesList, newLanguage],
//     }));
//   };

//   const handleRemoveLanguage = (langId: string) => {
//     setLanguagesList((prev) => prev.filter((lang) => lang.laId !== langId));
//     setResumeInfo((prev) => ({
//       ...prev,
//       languages: languagesList.filter((lang) => lang.laId !== langId),
//     }));
//   };

//   const handleMoveLanguage = (index: number, direction: "up" | "down") => {
//     const newIndex = direction === "up" ? index - 1 : index + 1;
//     const updatedLanguages = [...languagesList];
//     const movedLanguage = updatedLanguages.splice(index, 1);
//     updatedLanguages.splice(newIndex, 0, movedLanguage[0]);
//     setLanguagesList(updatedLanguages);
//     setResumeInfo((prev) => ({
//       ...prev,
//       languages: updatedLanguages,
//     }));
//   };

//   const animationVariants = {
//     initial: { opacity: 0, y: -10 },
//     animate: { opacity: 1, y: 0 },
//     exit: { opacity: 0, y: 10 },
//   };

//   useEffect(() => {
//     console.log("Languages Component: ", languagesList);
//   }, [languagesList]);

//   return (
//     <div className="resume-form">
//       <h2 className="form-title">Languages</h2>

//       <div className="form__scroll-bar">
//         {languagesList.length === 0 ? (
//           <NoData message="No Languages added yet." />
//         ) : (
//           <AnimatePresence>
//             {languagesList.map((lang, index) => (
//               <motion.div
//                 key={lang.laId}
//                 variants={animationVariants}
//                 initial="initial"
//                 animate="animate"
//                 exit="exit"
//                 className="from__container"
//               >

//                 {/*~~~~~~~~$ Form Header $~~~~~~~~*/}
//                 <div className="form__container-header">
//                   <h4 className="font-semibold text-sm">Language #{index + 1}</h4>

//                   {/*~~~~~~~~$ Move Buttons $~~~~~~~~*/}
//                   <div className="move__btn-container">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       disabled={index === 0}
//                       onClick={() => handleMoveLanguage(index, "up")}
//                     >
//                       <ChevronUp className="move-icon" />
//                     </Button>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => handleMoveLanguage(index, "down")}
//                       disabled={index === languagesList.length - 1}
//                     >
//                       <ChevronDown className="move-icon" />
//                     </Button>
//                   </div>
//                 </div>

//                 <form className="form-content">

//                   {/*~~~~~~~~$ Form Inputs $~~~~~~~~*/}
//                   <FormInput
//                     id={uuidv4()}
//                     placeholder="Language"
//                     label="Language"
//                     type="text"
//                     defaultValue={lang.name}
//                     onChange={(e) =>
//                       handleInputChange(lang.laId, "name", e.target.value)
//                     }
//                   />

//                   <FormSelect
//                     id={uuidv4()}
//                     label="Proficiency"
//                     defaultValue={lang.proficiency}
//                     onChange={(e) =>
//                       handleInputChange(lang.laId, "proficiency", e.target.value)
//                     }
//                   >
//                     {proficiencyLevels.map((level) => (
//                       <option key={level} value={level}>
//                         {level}
//                       </option>
//                     ))}
//                   </FormSelect>
//                 </form>

//                 {/*~~~~~~~~$ Remove Button $~~~~~~~~*/}
//                 <div className="remove-btn">
//                   <Button
//                     type="button"
//                     variant="danger"
//                     size="sm"
//                     onClick={() => handleRemoveLanguage(lang.laId)}
//                   >
//                     Remove
//                   </Button>
//                 </div>
//               </motion.div>
//             ))}
//           </AnimatePresence>
//         )}

//       </div>


//       <div>
//         <Button
//           type="button"
//           onClick={handleAddLanguage}
//           variant="success"
//           className="mb-4"
//           fullWidth
//         >
//           Add Language
//         </Button>

//         <Button
//           type="submit"
//           isLoading={isLoading}
//           onClick={handleOnSubmit}
//           disabled={enableNextBtn}
//           fullWidth
//         >
//           Save Languages
//         </Button>
//       </div>

//     </div>
//   );
// };

// export default LanguagesForm;

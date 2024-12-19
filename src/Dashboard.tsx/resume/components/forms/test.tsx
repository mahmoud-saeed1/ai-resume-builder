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
    setValue,
    reset,
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

  //! Sync local state with resumeInfo context
  useEffect(() => {
    if (resumeInfo?.experience) {
      reset({ experience: resumeInfo.experience });
    }
  }, [reset]);

  const experience = watch("experience");

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


    const handleUpdateResumeInfo = useCallback(
      (updatedExperience: IExperience[]) => {
        setResumeInfo((prev) => ({
          ...prev,
          experience: updatedExperience,
        }));
      },
      [setResumeInfo]
    );


/*~~~~~~~~$ Handlers $~~~~~~~~*/
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
    setResumeInfo((prev) => {
      const updatedExperience = [...(prev?.experience || [])];
      updatedExperience[index] = { ...updatedExperience[index], [field]: value };
      return { ...prev, experience: updatedExperience };
    });
  },
  [setValue, trigger, setResumeInfo]
);


  const handleChange =
    (index: number, field: keyof IExperience) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      handleInputChange(index, field, e.target.value);
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
      const experienceWithoutId = data.experience.map(({ id, ...rest }) => rest);
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
      toast.error(err.response?.data.error.message, {
        autoClose: 2000,
        theme: "light",
        transition: Bounce,
      });
    } finally {
      setIsLoading(false);
    }
  };

  {/*~~~~~~~~$ Reusable Render Function $~~~~~~~~*/}
  const dynamicFormInput = ({ name, label, index, type = "text", className }: { name: `experience.${number}.${keyof IExperience}`; label: string; index: number; type?: string; className?:string }) => {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <FormInput
            {...field}
            id={name}
            type={type}
            label={label}
            placeholder={`Enter ${label}`}
            errorMessage={errors.experience?.[index]?.[name.split('.')[2] as keyof IExperience]?.message}
            defaultValue={field.value as string}
            onChange={(e) => handleChange(index, name.split('.')[2] as keyof IExperience)(e)}
            className={className}
          />
        )}
      />
    );
  } 

  useEffect(() => {
    console.log("context data", resumeInfo);
  }
  ,[resumeInfo])
  
  

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
                    dynamicFormInput({name:`experience.${index}.currentlyWorking`, label:"currently works" ,index, type:"checkbox", className:"flex items-center shadow-none flex-row-reverse"})
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





// import { useCallback, useContext, useEffect, useState, useMemo } from "react";
// import { ResumeInfoContext } from "@/context/ResumeInfoContext";
// import { IErrorResponse, IExperience, IFormProbs } from "@/interfaces";
// import RichTextEditor from "./RichTextEditor";
// import { motion, AnimatePresence } from "framer-motion";
// import { ChevronDown, ChevronUp } from "lucide-react";
// import { useParams } from "react-router-dom";
// import { Bounce, toast } from "react-toastify";
// import { AxiosError } from "axios";
// import GlobalApi from "@/service/GlobalApi";
// import Button from "@/ui/Button";
// import { v4 as uuidv4 } from "uuid";
// import { VForm } from "@/animation";
// import FormInput from "./FormInputs";
// import NoData from "./NoData";

// const ExperienceForm = ({
//   enableNextBtn,
//   handleEnableNextBtn,
//   handleDisableNextBtn,
// }: IFormProbs) => {
//   const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)!;
//   const [experienceList, setExperienceList] = useState<IExperience[]>(() => resumeInfo?.experience || []);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const params = useParams<{ resumeId: string }>();

//   // Memoized Form Inputs to avoid re-renders
//   const memoizedExperienceList = useMemo(() => experienceList, [experienceList]);

//   /*~~~~~~~~$ Update Local State $~~~~~~~~*/
//   const updateResumeInfo = useCallback(
//     (updatedExperience: IExperience[]) => {
//       setResumeInfo((prev) => ({
//         ...prev,
//         experience: updatedExperience,
//       }));
//     },
//     [setResumeInfo]
//   );

//   /*~~~~~~~~$ Get Form List Data $~~~~~~~~*/
//   useEffect(() => {
//     if ((resumeInfo?.experience?.length ?? 0) > 0) {
//       setExperienceList(resumeInfo?.experience ?? []);
//     }
//   }, [resumeInfo]);

//   /*~~~~~~~~$ Handlers $~~~~~~~~*/
//   const handleInputChange = useCallback(
//     (exId: string, field: keyof IExperience, value: string | boolean) => {
//       const updatedExperience = experienceList.map((exp) =>
//         exp.exId === exId ? { ...exp, [field]: value } : exp
//       );
//       setExperienceList(updatedExperience);
//       updateResumeInfo(updatedExperience);
//       handleDisableNextBtn();
//     },
//     [experienceList, handleDisableNextBtn, updateResumeInfo]
//   );

//   const handleAddExperience = useCallback(() => {
//     const newExperience: IExperience = {
//       exId: uuidv4(),
//       title: "",
//       companyName: "",
//       city: "",
//       state: "",
//       startDate: "",
//       endDate: "",
//       currentlyWorking: false,
//       workSummary: "",
//     };
//     setExperienceList((prev) => [...prev, newExperience]);
//     updateResumeInfo([...experienceList, newExperience]);
//   }, [experienceList, updateResumeInfo]);

//   const handleRemoveExperience = useCallback(
//     (exId: string) => {
//       const updatedExperience = experienceList.filter((exp) => exp.exId !== exId);
//       setExperienceList(updatedExperience);
//       updateResumeInfo(updatedExperience);
//     },
//     [experienceList, updateResumeInfo]
//   );

//   const handleMoveExperience = useCallback(
//     (index: number, direction: "up" | "down") => {
//       const newIndex = direction === "up" ? index - 1 : index + 1;
//       const updatedExperience = [...experienceList];
//       const movedExperience = updatedExperience.splice(index, 1);
//       updatedExperience.splice(newIndex, 0, movedExperience[0]);
//       setExperienceList(updatedExperience);
//       updateResumeInfo(updatedExperience);
//     },
//     [experienceList, updateResumeInfo]
//   );

//   const handleOnSubmit = useCallback(async () => {
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
//         experience: experienceList,
//       });

//       if (status === 200) {
//         toast.success("Experience saved successfully.", {
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
//   }, [experienceList, handleEnableNextBtn, params]);

//   /*~~~~~~~~$ Reusable Render Function $~~~~~~~~*/
//   const renderFormInput = useCallback(
//     (id: string, type: string = "text", label: string, placeholder: string, value: string, field: keyof IExperience) => (
//       <FormInput
//         id={id}
//         type={type}
//         label={label}
//         placeholder={placeholder}
//         defaultValue={value}
//         onChange={(e) => handleInputChange(id, field, e.target.value)}
//         required
//       />
//     ),
//     [handleInputChange]
//   );

//   return (
//     <div className="resume-form">
//       <h2 className="form-title">Experience</h2>
//       <div className="form__scroll-bar">
//         {memoizedExperienceList.length === 0 ? (
//           <NoData message="No Experience added yet." />
//         ) : (
//           <AnimatePresence>
//             {memoizedExperienceList.map((exp, index) => (
//               <motion.div
//                 key={exp.exId}
//                 variants={VForm}
//                 initial="initial"
//                 animate="animate"
//                 exit="exit"
//                 className="from__container"
//               >
//                 <div className="form__container-header">
//                   <h4>Experience #{index + 1}</h4>
//                   <div className="move__btn-container">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       disabled={index === 0}
//                       onClick={() => handleMoveExperience(index, "up")}
//                     >
//                       <ChevronUp className="move-icon" />
//                     </Button>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => handleMoveExperience(index, "down")}
//                       disabled={index === memoizedExperienceList.length - 1}
//                     >
//                       <ChevronDown className="move-icon" />
//                     </Button>
//                   </div>
//                 </div>

//                 <form className="form-content">
//                   {renderFormInput(exp.exId, "text", "Title", "Enter Title", exp.title, "title")}
//                   {renderFormInput(exp.exId, "text", "Company Name", "Enter Company Name", exp.companyName, "companyName")}
//                   {renderFormInput(exp.exId, "text", "City", "Enter City", exp.city, "city")}
//                   {renderFormInput(exp.exId, "text", "State", "Enter State", exp.state, "state")}

//                   <div className="form__date-btn">
//                     {renderFormInput(exp.exId, "date", "Start Date", "Enter Start Date", exp.startDate, "startDate")}
//                     {!exp.currentlyWorking &&
//                       renderFormInput(exp.exId, "date", "End Date", "Enter End Date", exp.endDate || "", "endDate")}
//                   </div>

//                   <div className="flex items-center space-x-2">
//                     <input
//                       id={uuidv4()}
//                       type="checkbox"
//                       title="Currently Working"
//                       checked={exp.currentlyWorking}
//                       onChange={(e) =>
//                         handleInputChange(exp.exId, "currentlyWorking", e.target.checked)
//                       }
//                       required
//                     />
//                     <label>Currently Working</label>
//                   </div>
//                 </form>

//                 <RichTextEditor
//                   index={index}
//                   onRichTextEditorChange={(content) =>
//                     handleInputChange(exp.exId, "workSummary", content)
//                   }
//                   defaultValue={exp.workSummary}
//                 />

//                 <div className="remove-btn">
//                   <Button
//                     type="button"
//                     variant={"danger"}
//                     size="sm"
//                     onClick={() => handleRemoveExperience(exp.exId)}
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
//           onClick={handleAddExperience}
//           variant="success"
//           className="mb-4"
//           fullWidth
//         >
//           Add Experience
//         </Button>

//         <Button
//           type="submit"
//           isLoading={isLoading}
//           onClick={handleOnSubmit}
//           disabled={enableNextBtn}
//           fullWidth
//         >
//           Save Experience
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default ExperienceForm;



// import { useContext, useEffect, useState } from "react";
// import { ResumeInfoContext } from "@/context/ResumeInfoContext";
// import { IErrorResponse, IExperience, IFormProbs } from "@/interfaces";
// import RichTextEditor from "./RichTextEditor";
// import { motion, AnimatePresence } from "framer-motion";
// import { ChevronDown, ChevronUp } from "lucide-react";
// import { useParams } from "react-router-dom";
// import { Bounce, toast } from "react-toastify";
// import { AxiosError } from "axios";
// import GlobalApi from "@/service/GlobalApi";
// import Button from "@/ui/Button";
// import { v4 as uuidv4 } from "uuid";
// import { VForm } from "@/animation";
// import FormInput from "./FormInputs";
// import NoData from "./NoData";

// const ExperienceForm = ({
//   enableNextBtn,
//   handleEnableNextBtn,
//   handleDisableNextBtn,
// }: IFormProbs) => {
//   const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)!;
//   const [experienceList, setExperienceList] = useState<IExperience[]>(
//     resumeInfo?.experience || []
//   );
//   const [isLoading, setIsLoading] = useState<boolean>(false);

//   const params = useParams<{ resumeId: string }>();

//   /*~~~~~~~~$ Get Form List Data $~~~~~~~~*/
//   useEffect(()=>{
//     if (resumeInfo?.experience && resumeInfo.experience.length > 0) {
//       setExperienceList(resumeInfo.experience);
//     }
    
// },[])

//   /*~~~~~~~~$ Handlers $~~~~~~~~*/
//   const handleInputChange = (
//     exId: string,
//     field: keyof IExperience,
//     value: string | boolean
//   ) => {
//     setExperienceList((prev) =>
//       prev.map((exp) => (exp.exId === exId ? { ...exp, [field]: value } : exp))
//     );
//     setResumeInfo((prev) => ({
//       ...prev,
//       experience: experienceList,
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
//         experience: experienceList,
//       });

//       if (status === 200) {
//         toast.success("Experience saved successfully.", {
//           autoClose: 1000,
//           theme: "light",
//           transition: Bounce,
//         });
//         handleEnableNextBtn();
//       }
//     } catch (error) {
//       const err = error as AxiosError<IErrorResponse>;
//       console.log("Error", err);
//       toast.error(err.response?.data.error.message, {
//         autoClose: 2000,
//         theme: "light",
//         transition: Bounce,
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleAddExperience = () => {
//     const newExperience: IExperience = {
//       exId: uuidv4(),
//       title: "",
//       companyName: "",
//       city: "",
//       state: "",
//       startDate: "",
//       endDate: "",
//       currentlyWorking: false,
//       workSummary: "",
//     };
//     setExperienceList((prev) => [...prev, newExperience]);
//     setResumeInfo((prev) => ({
//       ...prev,
//       experience: [...experienceList, newExperience],
//     }));
//   };

//   const handleRemoveExperience = (exId: string) => {
//     setExperienceList((prev) => prev.filter((exp) => exp.exId !== exId));
//     setResumeInfo((prev) => ({
//       ...prev,
//       experience: experienceList.filter((exp) => exp.exId !== exId),
//     }));
//   };

//   const handleMoveExperience = (index: number, direction: "up" | "down") => {
//     const newIndex = direction === "up" ? index - 1 : index + 1;
//     const updatedExperience = [...experienceList];
//     const movedExperience = updatedExperience.splice(index, 1);
//     updatedExperience.splice(newIndex, 0, movedExperience[0]);
//     setExperienceList(updatedExperience);
//     setResumeInfo((prev) => ({
//       ...prev,
//       experience: updatedExperience,
//     }));
//   };

//   return (
//     <div className="resume-form">
//       <h2 className="form-title">Experience</h2>

//       <div className="form__scroll-bar">
//         {experienceList.length === 0 ? (
//           <NoData message="No Experience added yet." />
//         ) : (
//           <AnimatePresence>
//             {experienceList.map((exp, index) => (
//               <motion.div
//                 key={exp.exId}
//                 variants={VForm}
//                 initial="initial"
//                 animate="animate"
//                 exit="exit"
//                 className="from__container"
//               >
//                 {/*~~~~~~~~$ Form Header $~~~~~~~~*/}
//                 <div className="form__container-header">
//                   <h4>
//                     Experience #{index + 1}
//                   </h4>

//                   {/*~~~~~~~~$ Move Buttons $~~~~~~~~*/}
//                   <div className="move__btn-container">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       disabled={index === 0}
//                       onClick={() => handleMoveExperience(index, "up")}
//                     >
//                       <ChevronUp className="move-icon" />
//                     </Button>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => handleMoveExperience(index, "down")}
//                       disabled={
//                         index === ((resumeInfo?.experience || []).length - 1)
//                       }
//                     >
//                       <ChevronDown className="move-icon" />
//                     </Button>
//                   </div>
//                 </div>

//                 <form className="form-content">
//                   {/*~~~~~~~~$ Form Inputs $~~~~~~~~*/}
//                   <FormInput
//                     id={uuidv4()}
//                     label="Title"
//                     placeholder="Enter Title"
//                     defaultValue={exp.title}
//                     onChange={(e) =>
//                       handleInputChange(exp.exId, "title", e.target.value)
//                     }
//                     required
//                   />

//                   <FormInput
//                     id={uuidv4()}
//                     label="Company Name"
//                     placeholder="Enter Company Name"
//                     defaultValue={exp.companyName}
//                     onChange={(e) =>
//                       handleInputChange(exp.exId, "companyName", e.target.value)
//                     }
//                     required
//                   />

//                   <FormInput
//                     id={uuidv4()}
//                     label="City"
//                     placeholder="Enter City"
//                     defaultValue={exp.city}
//                     onChange={(e) =>
//                       handleInputChange(exp.exId, "city", e.target.value)
//                     }
//                     required
//                   />

//                   {/*~~~~~~~~$ Date Inputs $~~~~~~~~*/}
//                   <div className="form__date-btn">
//                     <FormInput
//                       id={uuidv4()}
//                       type="date"
//                       label="Start Date"
//                       placeholder="Enter Start Date"
//                       defaultValue={exp.startDate}
//                       onChange={(e) =>
//                         handleInputChange(exp.exId, "startDate", e.target.value)
//                       }
//                       required
//                     />
//                     {!exp.currentlyWorking && (
//                       <FormInput
//                         id={uuidv4()}
//                         type="date"
//                         label="End Date"
//                         placeholder="Enter End Date"
//                         defaultValue={exp.endDate ?? ""}
//                         onChange={(e) =>
//                           handleInputChange(exp.exId, "endDate", e.target.value)
//                         }
//                         required
//                       />
//                     )}
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <input
//                       id={uuidv4()}
//                       type="checkbox"
//                       title="Currently Working"
//                       checked={exp.currentlyWorking}
//                       onChange={(e) =>
//                         handleInputChange(
//                           exp.exId,
//                           "currentlyWorking",
//                           e.target.checked
//                         )
//                       }
//                       required
//                     />
//                     <label>Currently Working</label>
//                   </div>
//                 </form>

//                 <RichTextEditor
//                   index={index}
//                   onRichTextEditorChange={(content) =>
//                     handleInputChange(exp.exId, "workSummary", content)
//                   }
//                   defaultValue={exp.workSummary}
//                 />

//                 {/*~~~~~~~~$ Remove Button $~~~~~~~~*/}
//                 <div className="remove-btn">
//                   <Button
//                     type="button"
//                     variant={"danger"}
//                     size="sm"
//                     onClick={() => handleRemoveExperience(exp.exId)}
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
//           onClick={handleAddExperience}
//           variant="success"
//           className="mb-4"
//           fullWidth
//         >
//           Add Experience
//         </Button>

//         <Button
//           type="submit"
//           isLoading={isLoading}
//           onClick={handleOnSubmit}
//           disabled={enableNextBtn}
//           fullWidth
//         >
//           Save Experience
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default ExperienceForm;



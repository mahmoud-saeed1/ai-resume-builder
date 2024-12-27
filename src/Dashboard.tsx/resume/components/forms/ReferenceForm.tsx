import { useContext, useEffect, useState, ChangeEvent, useCallback } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { IFormProbs, IReferences, IErrorResponse } from "@/interfaces";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useParams } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import GlobalApi from "@/service/GlobalApi";
import Button from "@/ui/Button";
import NoData from "./NoData";
import FormInput from "./FormInput";
import { AxiosError } from "axios";
import { ReferenceSchema } from "@/validation";

const ReferenceForm = ({
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
  } = useForm<{ references: IReferences[] }>({
    resolver: yupResolver(ReferenceSchema),
    defaultValues: {
      references: resumeInfo?.references || [],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "references",
  });

  const references = watch("references");

  /*~~~~~~~~$ Effects $~~~~~~~~*/
  useEffect(() => {
    if (resumeInfo?.references) {
      reset({ references: resumeInfo.references });
    }
  }, [resumeInfo, reset]);

  /*~~~~~~~~$ Handlers $~~~~~~~~*/
  const handleUpdateResumeInfo = useCallback(
    (updatedReferences: { references: IReferences[] }) => {
      setResumeInfo((prev) => ({
        ...prev,
        references: updatedReferences.references,
      }));
    },
    [setResumeInfo]
  );

  const handleAddReference = () => {
    const newReference: IReferences = {
      name: "",
      position: "",
      company: "",
      contact: "",
    };
    append(newReference);
    handleDisableNextBtn();

    setResumeInfo((prev) => {
      const updatedReferences = [...(prev?.references || []), newReference];
      return {
        ...prev,
        references: updatedReferences,
      };
    });
  };

  const handleInputChange = useCallback(
    (index: number, field: keyof IReferences, value: string) => {
      setValue(`references.${index}.${field}`, value, { shouldValidate: true });
      trigger(`references.${index}.${field}`);
      handleDisableNextBtn();

      setResumeInfo((prev) => {
        const updatedReferences = [...(prev?.references || [])];
        updatedReferences[index] = {
          ...updatedReferences[index],
          [field]: value,
        };
        return { ...prev, references: updatedReferences };
      });
    },
    [setValue, trigger, handleDisableNextBtn, setResumeInfo]
  );

  const handleChange =
    (index: number, field: keyof IReferences) =>
      (e: ChangeEvent<HTMLInputElement>) => {
        handleInputChange(index, field, e.target.value);
      };

  const handleRemoveReference = (index: number) => {
    remove(index);
    handleDisableNextBtn();
  };

  const handleMoveReference = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    move(index, newIndex);
  };

  const handleOnSubmit = async (data: { references: IReferences[] }) => {
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
      const referencesWithoutId = data.references.map(({ id, ...rest }) => { console.log(id); return rest; });
      const { status } = await GlobalApi.UpdateResumeData(params.resumeId, {
        references: referencesWithoutId,
      });

      if (status === 200) {
        toast.success("References saved successfully.", {
          autoClose: 1000,
          theme: "light",
          transition: Bounce,
        });
        handleUpdateResumeInfo({ references: data.references });
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
    name: `references.${number}.${keyof IReferences}`;
    label: string;
    index: number;
  }) => (
    <Controller
      name={name}
      control={control}
      defaultValue={references?.[index]?.[name.split(".")[2] as keyof IReferences] || ""}
      render={({ field }) => (
        <FormInput
          {...field}
          id={name}
          label={label}
          placeholder={`Enter ${label}`}
          errorMessage={
            errors.references?.[index]?.[name.split(".")[2] as keyof IReferences]?.message
          }
          onChange={(e) => handleChange(index, name.split(".")[2] as keyof IReferences)(e)}
        />
      )}
    />
  );

  return (
    <div className="resume-form">
      <h2 className="form-title">References</h2>
      <div className="form__scroll-bar">
        {fields.length === 0 ? (
          <NoData message="No References added yet." />
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
                  <h4>Reference #{index + 1}</h4>
                  <div className="move__btn-container">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={index === 0}
                      onClick={() => handleMoveReference(index, "up")}
                    >
                      <ChevronUp className="move-icon" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={index === fields.length - 1}
                      onClick={() => handleMoveReference(index, "down")}
                    >
                      <ChevronDown className="move-icon" />
                    </Button>
                  </div>
                </div>
                <form className="form-content">
                  {dynamicFormInput({ name: `references.${index}.name`, label: "Name", index })}
                  {dynamicFormInput({ name: `references.${index}.position`, label: "Position", index })}
                  {dynamicFormInput({ name: `references.${index}.company`, label: "Company", index })}
                  {dynamicFormInput({ name: `references.${index}.contact`, label: "Contact", index })}
                </form>
                <div className="remove-btn">
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveReference(index)}
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
        onClick={handleAddReference}
      >
        Add Reference
      </Button>
      <Button
        type="submit"
        isLoading={isLoading}
        fullWidth
        onClick={handleSubmit(handleOnSubmit)}
        disabled={enableNextBtn}
      >
        Save References
      </Button>
    </div>
  );
};

export default ReferenceForm;


// import { useContext, useEffect, useState, ChangeEvent, useCallback } from "react";
// import { useForm, useFieldArray, Controller } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { ResumeInfoContext } from "@/context/ResumeInfoContext";
// import { IFormProbs, IReferences, IErrorResponse } from "@/interfaces";
// import { motion, AnimatePresence } from "framer-motion";
// import { ChevronDown, ChevronUp } from "lucide-react";
// import { useParams } from "react-router-dom";
// import { Bounce, toast } from "react-toastify";
// import GlobalApi from "@/service/GlobalApi";
// import Button from "@/ui/Button";
// import NoData from "./NoData";
// import FormInput from "./FormInput";
// import { AxiosError } from "axios";
// import { ReferenceSchema } from "@/validation"; // Import your validation schema here

// const ReferenceForm = ({
//   enableNextBtn,
//   handleEnableNextBtn,
//   handleDisableNextBtn,
// }: IFormProbs) => {
//   /*~~~~~~~~$ States $~~~~~~~~*/
//   const [isLoading, setIsLoading] = useState(false);

//   /*~~~~~~~~$ Context $~~~~~~~~*/
//   const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)!;
//   const params = useParams<{ resumeId: string }>();

//   /*~~~~~~~~$ Forms $~~~~~~~~*/
//   const {
//     control,
//     handleSubmit,
//     watch,
//     reset,
//     setValue,
//     trigger,
//     formState: { errors },
//   } = useForm<{ references: IReferences[] }>({
//     resolver: yupResolver(ReferenceSchema),
//     defaultValues: {
//       references: resumeInfo?.references || [],
//     },
//   });

//   const { fields, append, remove, move } = useFieldArray({
//     control,
//     name: "references",
//   });

//   const references = watch("references");

//   /*~~~~~~~~$ Effects $~~~~~~~~*/
//   useEffect(() => {
//     if (resumeInfo?.references) {
//       reset({ references: resumeInfo.references });
//     }
//   }, [reset]);

//   /*~~~~~~~~$ Handlers $~~~~~~~~*/
//   const handleUpdateResumeInfo = useCallback(
//     (updatedReferences: { references: IReferences[] }) => {
//       setResumeInfo((prev) => ({
//         ...prev,
//         references: updatedReferences.references,
//       }));
//     },
//     [setResumeInfo]
//   );

//   const handleAddReference = () => {
//     const newReference: IReferences = {
//       name: "",
//       position: "",
//       company: "",
//       contact: "",
//     };
//     append(newReference);
//     handleDisableNextBtn();

//     //! Real-time update of context when project changes
//     setResumeInfo((prev) => {
//       const updatedReferences = [...(prev?.references || []), newReference];
//       return {
//         ...prev,
//         references: updatedReferences,
//       };
//     });

//   };

//   const handleInputChange = useCallback(
//     (index: number, field: keyof IReferences, value: string) => {
//       setValue(`references.${index}.${field}`, value, { shouldValidate: true });
//       trigger(`references.${index}.${field}`);
//       handleDisableNextBtn();

//       //! Real-time update of context
//       setResumeInfo((prev) => {
//         const updatedReferences = [...(prev?.references || [])];
//         updatedReferences[index] = {
//           ...updatedReferences[index],
//           [field]: value,
//         };
//         return { ...prev, references: updatedReferences };
//       });
//     },
//     [setValue, trigger, handleDisableNextBtn]
//   );

//   const handleChange =
//     (index: number, field: keyof IReferences) =>
//       (e: ChangeEvent<HTMLInputElement>) => {
//         handleInputChange(index, field, e.target.value);
//       };

//   const handleRemoveReference = (index: number) => {
//     remove(index);
//     handleDisableNextBtn();
//   };

//   const handleMoveReference = (index: number, direction: "up" | "down") => {
//     const newIndex = direction === "up" ? index - 1 : index + 1;
//     move(index, newIndex);
//   };

//   const handleOnSubmit = async (data: { references: IReferences[] }) => {
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
//       const referencesWithoutId = data.references.map(({ id, ...rest }) => { console.log(id); return rest; });
//       const { status } = await GlobalApi.UpdateResumeData(params.resumeId, {
//         references: referencesWithoutId,
//       });

//       if (status === 200) {
//         toast.success("References saved successfully.", {
//           autoClose: 1000,
//           theme: "light",
//           transition: Bounce,
//         });
//         handleUpdateResumeInfo({ references: data.references });
//         handleEnableNextBtn();
//       }
//     } catch (error) {
//       const err = error as AxiosError<IErrorResponse>;
//       toast.error(err.response?.data.error.message || "An error occurred", {
//         autoClose: 2000,
//         theme: "light",
//         transition: Bounce,
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const dynamicFormInput = ({
//     name,
//     label,
//     index,
//   }: {
//     name: `references.${number}.${keyof IReferences}`;
//     label: string;
//     index: number;
//   }) => (
//     <Controller
//       name={name}
//       control={control}
//       defaultValue={references?.[index]?.[name.split(".")[2] as keyof IReferences] || ""}
//       render={({ field }) => (
//         <FormInput
//           {...field}
//           id={name}
//           label={label}
//           placeholder={`Enter ${label}`}
//           errorMessage={errors.references?.[index]?.[name.split(".")[2] as keyof IReferences]?.message}
//           onChange={(e) => handleChange(index, name.split(".")[2] as keyof IReferences)(e)}
//         />
//       )}
//     />
//   );

//   return (
//     <div className="resume-form">
//       <h2 className="form-title">References</h2>
//       <div className="form__scroll-bar">
//         {fields.length === 0 ? (
//           <NoData message="No References added yet." />
//         ) : (
//           <AnimatePresence>
//             {fields.map((field, index) => (
//               <motion.div
//                 key={index}
//                 variants={{
//                   initial: { opacity: 0, y: 10 },
//                   animate: { opacity: 1, y: 0 },
//                   exit: { opacity: 0, y: -10 },
//                 }}
//                 initial="initial"
//                 animate="animate"
//                 exit="exit"
//                 className="form__container"
//               >
//                 <div className="form__container-header">
//                   <h4>Reference #{index + 1}</h4>
//                   <div className="move__btn-container">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       disabled={index === 0}
//                       onClick={() => handleMoveReference(index, "up")}
//                     >
//                       <ChevronUp className="move-icon" />
//                     </Button>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       disabled={index === fields.length - 1}
//                       onClick={() => handleMoveReference(index, "down")}
//                     >
//                       <ChevronDown className="move-icon" />
//                     </Button>
//                   </div>
//                 </div>
//                 <form className="form-content">
//                   {dynamicFormInput({ name: `references.${index}.name`, label: "Name", index })}
//                   {dynamicFormInput({ name: `references.${index}.position`, label: "Position", index })}
//                   {dynamicFormInput({ name: `references.${index}.company`, label: "Company", index })}
//                   {dynamicFormInput({ name: `references.${index}.contact`, label: "Contact", index })}
//                 </form>
//                 <div className="remove-btn">
//                   <Button
//                     type="button"
//                     variant="danger"
//                     size="sm"
//                     onClick={() => handleRemoveReference(index)}
//                   >
//                     Remove
//                   </Button>
//                 </div>
//               </motion.div>
//             ))}
//           </AnimatePresence>
//         )}
//       </div>
//       <Button
//         type="button"
//         variant="success"
//         className="mb-4"
//         fullWidth
//         onClick={handleAddReference}
//       >
//         Add Reference
//       </Button>
//       <Button
//         type="submit"
//         isLoading={isLoading}
//         fullWidth
//         onClick={handleSubmit(handleOnSubmit)}
//         disabled={enableNextBtn}
//       >
//         Save References
//       </Button>
//     </div>
//   );
// };

// export default ReferenceForm;
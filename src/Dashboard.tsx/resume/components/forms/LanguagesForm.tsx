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
    resolver: yupResolver(LanguagesSchema),
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

  /*~~~~~~~~$ Handlers $~~~~~~~~*/
  const handleUpdateResumeInfo = useCallback(
    (updatedLanguages: ILanguages[]) => {
      setResumeInfo((prev) => ({
        ...prev,
        languages: updatedLanguages,
      }));
    },
    [setResumeInfo]
  );

  const handleAddLanguage = () => {
    const newLanguage: ILanguages = {
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

      //! Real-time update of context when project changes
      setResumeInfo((prev) => {
        const updatedLanguages = [...(prev?.languages || [])];
        updatedLanguages[index] = {
          ...updatedLanguages[index],
          [field]: value,
        };
        return { ...prev, languages: updatedLanguages };
      });
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
      const languagesWithoutId = data.languages.map(({ id, ...rest }) => { console.log(id); return rest; });
      const { status } = await GlobalApi.UpdateResumeData(params.resumeId, {
        languages: languagesWithoutId,
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
        handleUpdateResumeInfo(data.languages);
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
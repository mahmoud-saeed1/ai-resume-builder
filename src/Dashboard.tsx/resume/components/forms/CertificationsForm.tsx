import { useContext, useEffect, useState, ChangeEvent, useCallback } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { ICertification, IErrorResponse, IFormProbs } from "@/interfaces";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useParams } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import GlobalApi from "@/service/GlobalApi";
import Button from "@/ui/Button";
import FormInput from "./FormInput";
import NoData from "./NoData";
import { AxiosError } from "axios";
import { CertificationSchema } from "@/validation"; // Ensure you import the correct validation schema

const CertificationsForm = ({
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
  } = useForm<{ certifications: ICertification[] }>({
    resolver: yupResolver(CertificationSchema),
    defaultValues: {
      certifications: resumeInfo?.certifications || [],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "certifications",
  });

  /*~~~~~~~~$ Effects $~~~~~~~~*/
  useEffect(() => {
    reset({ certifications: resumeInfo?.certifications || [] });
  }, [reset]);

  useEffect(() => {
    const updatedCertifications = fields.map((cert) => ({
      ...cert,
      ceId: cert.ceId || Date.now().toString(), // Ensure ceId is set if not present
    }));

    setResumeInfo((prev) => ({
      ...prev,
      certifications: updatedCertifications,
    }));
  }, [fields, setResumeInfo]);

  /*~~~~~~~~$ Handlers $~~~~~~~~*/
  const handleAddCertification = () => {
    const newCertification: ICertification = {
      ceId: Date.now().toString(), // Unique ID for each certification
      title: "",
      issuer: "",
      date: "",
    };
    append(newCertification);
    handleDisableNextBtn();
  };

  const handleInputChange = useCallback(
    (index: number, field: keyof ICertification, value: string) => {
      setValue(`certifications.${index}.${field}`, value, { shouldValidate: true });
      trigger(`certifications.${index}.${field}`);
      handleDisableNextBtn();
    },
    [setValue, trigger, handleDisableNextBtn]
  );

  const handleChange =
    (index: number, field: keyof ICertification) =>
      (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        handleInputChange(index, field, e.target.value);
      };

  const handleRemoveCertification = (index: number) => {
    remove(index);
    handleDisableNextBtn();
  };

  const handleMoveCertification = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    move(index, newIndex);
  };

  const handleOnSubmit = async (data: { certifications: ICertification[] }) => {
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
        certifications: data.certifications,
      });

      if (status === 200) {
        toast.success("Certifications saved successfully.", {
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
    type = "text",
  }: {
    name: `certifications.${number}.${keyof ICertification}`;
    label: string;
    index: number;
    type?: string;
  }) => (
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
          errorMessage={errors.certifications?.[index]?.[name.split(".")[2] as keyof ICertification]?.message}
          onChange={(e) => handleChange(index, name.split(".")[2] as keyof ICertification)(e)}
        />
      )}
    />
  );

  return (
    <div className="resume-form">
      <h2 className="form-title">Certifications</h2>

      <div className="form__scroll-bar">
        {fields.length === 0 ? (
          <NoData message="No Certifications added yet." />
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
                  <h4>Certification #{index + 1}</h4>
                  <div className="move__btn-container">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={index === 0}
                      onClick={() => handleMoveCertification(index, "up")}
                    >
                      <ChevronUp className="move-icon" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={index === fields.length - 1}
                      onClick={() => handleMoveCertification(index, "down")}
                    >
                      <ChevronDown className="move-icon" />
                    </Button>
                  </div>
                </div>
                <form className="form-content">
                  {dynamicFormInput({ name: `certifications.${index}.title`, label: "Title", index })}
                  {dynamicFormInput({ name: `certifications.${index}.issuer`, label: "Issuer", index })}
                  {dynamicFormInput({ name: `certifications.${index}.date`, label: "Date", index, type: "date" })}
                </form>
                <div className="remove-btn">
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveCertification(index)}
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
        onClick={handleAddCertification}
      >
        Add Certification
      </Button>

      <Button
        type="submit"
        isLoading={isLoading}
        fullWidth
        onClick={handleSubmit(handleOnSubmit)}
        disabled={enableNextBtn}
      >
        Save Certifications
      </Button>
    </div>
  );
};

export default CertificationsForm;

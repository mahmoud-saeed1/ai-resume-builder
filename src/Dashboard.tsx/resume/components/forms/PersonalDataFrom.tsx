import { useContext, useEffect, useState, ChangeEvent, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { IFormProbs, IPersonalData, IErrorResponse } from "@/interfaces";
import { Bounce, toast } from "react-toastify";
import GlobalApi from "@/service/GlobalApi";
import FormInput from "./FormInput";
import { AxiosError } from "axios";
import { SPersonalData } from "@/validation"; // Ensure you import the correct validation schema
import FormContainer from "./FormContainer";

const PersonalDataForm = ({
  enableNextBtn,
  handleEnableNextBtn,
  handleDisableNextBtn,
}: IFormProbs) => {
  /*~~~~~~~~$ States $~~~~~~~~*/
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /*~~~~~~~~$ Context $~~~~~~~~*/
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext) ?? {};
  const params = useParams<{ resumeId: string }>();

  /*~~~~~~~~$ Forms $~~~~~~~~*/
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IPersonalData>({
    resolver: yupResolver(SPersonalData),
    defaultValues: resumeInfo?.personalData?.[0] || {},
  });


  /*~~~~~~~~$ Effects $~~~~~~~~*/
  useEffect(() => {
    if (resumeInfo?.personalData?.length) {
      const data = resumeInfo.personalData[0];
      Object.keys(data).forEach((key) => {
        setValue(key as keyof IPersonalData, data[key as keyof IPersonalData]);
      });
    }
  }, [resumeInfo, setValue]);

  /*~~~~~~~~$ Handlers $~~~~~~~~*/
  const handleInputChange = useCallback(
    (name: keyof IPersonalData, value: string) => {
      setValue(name, value, { shouldValidate: true });
      handleDisableNextBtn();

      // Real-time update of context
      setResumeInfo?.((prev) => {
        if (!prev) return prev;
        const updatedPersonalData: IPersonalData = {
          firstName: prev.personalData?.[0]?.firstName || '',
          lastName: prev.personalData?.[0]?.lastName || '',
          jobTitle: prev.personalData?.[0]?.jobTitle || '',
          phone: prev.personalData?.[0]?.phone || '',
          email: prev.personalData?.[0]?.email || '',
          address: prev.personalData?.[0]?.address || '',
          [name]: value,
        };
        return { ...prev, personalData: [updatedPersonalData] };
      });
    },
    [setValue, handleDisableNextBtn, setResumeInfo]
  );

  const handleUpdateResumeInfo = useCallback(
    (updatedPersonalData: IPersonalData) => {
      setResumeInfo?.((prev) => ({
        ...prev,
        personalData: [updatedPersonalData],
      }));
    },
    [setResumeInfo]
  );

  const handleOnSubmit = async (data: IPersonalData) => {
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
      const personalDataWithoutId = {
        firstName: data.firstName,
        lastName: data.lastName,
        jobTitle: data.jobTitle,
        phone: data.phone,
        email: data.email,
        address: data.address
      };
      const { status } = await GlobalApi.UpdateResumeData(params.resumeId, {
        personalData: [personalDataWithoutId],
      });

      if (status === 200) {
        toast.success("Personal data saved successfully.", {
          autoClose: 1000,
          theme: "light",
          transition: Bounce,
        });
        handleUpdateResumeInfo(personalDataWithoutId);
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

  return (
    <FormContainer formTitle="Personal Data" handleOnSubmit={handleSubmit(handleOnSubmit)} isLoading={isLoading} enableNextBtn={enableNextBtn}>
      <form onSubmit={handleSubmit(handleOnSubmit)} className="form-content">
        {["firstName", "lastName", "jobTitle", "phone", "email", "address"].map((field) => (
          <FormInput
            key={field}
            id={field}
            label={field.charAt(0).toUpperCase() + field.slice(1)}
            placeholder={`Enter ${field.charAt(0).toUpperCase() + field.slice(1)}`}
            {...register(field as keyof IPersonalData)}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(field as keyof IPersonalData, e.target.value)}
            errorMessage={errors[field as keyof IPersonalData]?.message}
          />
        ))}
      </form>
    </FormContainer>
  );
};

export default PersonalDataForm;

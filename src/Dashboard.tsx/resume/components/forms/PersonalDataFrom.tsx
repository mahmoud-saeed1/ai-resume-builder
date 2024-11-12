import { IErrorResponse, IFormProbs, IPersonalData } from "@/interfaces";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SPersonalData } from "@/validation";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { useContext, useEffect, useState } from "react";
import GlobalApi from "@/service/GlobalApi";
import { useParams } from "react-router-dom";
import { toast, Bounce } from "react-toastify";
import Button from "@/ui/Button";
import { AxiosError } from "axios";
import FormInput from "./FormInputs";

const PersonalDataForm = ({
  enableNextBtn,
  handleEnableNextBtn,
  handleDisableNextBtn,
}: IFormProbs) => {
  /*~~~~~~~~$ States $~~~~~~~~*/
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /*~~~~~~~~$ Context $~~~~~~~~*/
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext) ?? {};

  if (!setResumeInfo) {
    throw new Error("ResumeInfoContext is undefined");
  }

  const params = useParams<{ resumeId: string }>();

  useEffect(() => {
    console.log("Resume ID: ", params.resumeId);
    console.log("Resume Info: ", resumeInfo);
  }
    , [resumeInfo]);

  /*~~~~~~~~$ Form $~~~~~~~~*/
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IPersonalData>({
    resolver: yupResolver(SPersonalData),
  });

  /*~~~~~~~~$ Handlers $~~~~~~~~*/
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResumeInfo((prev) => ({
      ...prev,
      personalData: prev?.personalData ?? [],
      [name]: value,
    }));
    handleDisableNextBtn();
  };

  const handleOnSubmit: SubmitHandler<IPersonalData> = async (data) => {
    setIsLoading(true);


    if (!params?.resumeId) {
      toast.error("ID parameter is missing.", {
        autoClose: 2000,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    try {
      const { status } = await GlobalApi.UpdateResumeData(params.resumeId, {
        personalData: [data],
      });
      if (status === 200) {
        toast.success("Data saved successfully.", {
          autoClose: 1000,
          theme: "light",
          transition: Bounce,
        });
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

  return (
    <form onSubmit={handleSubmit(handleOnSubmit)}>
      {["firstName", "lastName", "jobTitle", "phone", "email", "address"].map(
        (field) => (
          <FormInput
            id={field}
            label={field}
            key={field}
            placeholder={field.replace(/^\w/, (c) => c.toUpperCase())}
            register={register(field as keyof IPersonalData)}
            onChange={handleInputChange}
            defaultValue={
              resumeInfo?.personalData?.[0]?.[field as keyof IPersonalData] ?? ""
            }
            errorMessage={errors[field as keyof IPersonalData]?.message}
          />
        )
      )}
      <Button isLoading={isLoading} disabled={enableNextBtn}>
        Save Personal Data
      </Button>
    </form>
  );
};

export default PersonalDataForm;

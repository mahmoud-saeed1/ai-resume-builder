import { IErrorResponse, IPersonalData, IPersonalDataForm } from "@/interfaces";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SPersonalData } from "@/validation";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { useContext, useState } from "react";
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
}: IPersonalDataForm) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext) ?? {};

  if (!setResumeInfo) {
    throw new Error("ResumeInfoContext is undefined");
  }

  const params = useParams<{ id: string }>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IPersonalData>({
    resolver: yupResolver(SPersonalData),
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResumeInfo((prev) => ({
      ...prev,
      personalData: {
        ...prev.personalData,
        [name]: value,
      },
    }));
    handleDisableNextBtn();
  };

  const handleOnSubmit: SubmitHandler<IPersonalData> = async (data) => {
    setIsLoading(true);

    if (!params?.id) {
      toast.error("ID parameter is missing.", {
        autoClose: 2000,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    try {
      const { status } = await GlobalApi.UpdateResumeDetails(params.id, data);
      if (status === 200) {
        toast.success("Data saved successfully.", {
          autoClose: 1000,
          theme: "light",
          transition: Bounce,
        });
        handleEnableNextBtn();
      }
    } catch (error) {
      const errorObj = error as AxiosError<IErrorResponse>;
      toast.error(`${errorObj.response?.data.error.message}`, {
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
      {
        Object.keys(resumeInfo?.personalData || {}).map((key) => (
          <FormInput
            key={key}
            placeholder={key}
            register={register(key as keyof IPersonalData)}
            onChange={handleInputChange}
            defaultValue={resumeInfo?.personalData[key as keyof IPersonalData]}
            errorMessage={errors[key as keyof IPersonalData]}
          />
        ))
      }
      <Button isLoading={isLoading} disabled={enableNextBtn}>
        Save
      </Button>
    </form>
  );
};

export default PersonalDataForm;

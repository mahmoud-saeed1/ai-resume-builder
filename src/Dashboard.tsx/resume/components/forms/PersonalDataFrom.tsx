import { IErrorResponse, IFormProbs, IPersonalData } from "@/interfaces";
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
}: IFormProbs) => {
  /*~~~~~~~~$ States $~~~~~~~~*/
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /*~~~~~~~~$ Context $~~~~~~~~*/
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext) ?? {};

  if (!setResumeInfo) {
    throw new Error("ResumeInfoContext is undefined");
  }

  const params = useParams<{ id: string }>();

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
      [name]: value,
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
      const err = error as AxiosError<IErrorResponse>;
      if (err.response?.data.error.details) {
        err.response.data.error.details.errors.forEach((e) => {
          toast.error(e.message, {
            autoClose: 2000,
            theme: "light",
            transition: Bounce,
          });
        });
      } else {
        toast.error(err.response?.data.error.message, {
          autoClose: 2000,
          theme: "light",
          transition: Bounce,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleOnSubmit)}>
      {/* {Object.keys(resumeInfo?.personalData || {}).map((key) => (
        <FormInput
          key={key}
          placeholder={key}
          register={register(key as keyof IPersonalData)}
          onChange={handleInputChange}
          defaultValue={resumeInfo?.personalData[key as keyof IPersonalData]}
          errorMessage={errors[key as keyof IPersonalData]}
        />
      ))} */}
      <FormInput
        placeholder="First Name"
        register={register("firstName")}
        onChange={handleInputChange}
        defaultValue={resumeInfo?.firstName}
        errorMessage={errors.firstName}
      />
      <FormInput
        placeholder="Last Name"
        register={register("lastName")}
        onChange={handleInputChange}
        defaultValue={resumeInfo?.lastName}
        errorMessage={errors.lastName}
      />
      <FormInput
        placeholder="Job Title"
        register={register("jobTitle")}
        onChange={handleInputChange}
        defaultValue={resumeInfo?.jobTitle}
        errorMessage={errors.jobTitle}
      />
      <FormInput
        placeholder="Phone"
        register={register("phone")}
        onChange={handleInputChange}
        defaultValue={resumeInfo?.phone}
        errorMessage={errors.phone}
      />
      <FormInput
        placeholder="Email"
        register={register("email")}
        onChange={handleInputChange}
        defaultValue={resumeInfo?.email}
        errorMessage={errors.email}
      />
      <FormInput
        placeholder="Address"
        register={register("address")}
        onChange={handleInputChange}
        defaultValue={resumeInfo?.address}
        errorMessage={errors.address}
      />
      <Button isLoading={isLoading} disabled={enableNextBtn}>
        Save
      </Button>
    </form>
  );
};

export default PersonalDataForm;

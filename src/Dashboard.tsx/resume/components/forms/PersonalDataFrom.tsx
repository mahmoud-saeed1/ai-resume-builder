import { IErrorResponse, IPersonalData, IPersonalDataForm } from "@/interfaces";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SPersonalData } from "@/validation";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { useContext, useState } from "react";
import GlobalApi from "@/service/GlobalApi";
import { useParams } from "react-router-dom";
import { toast, Bounce } from "react-toastify";
import Input from "@/ui/Input";
import Label from "@/ui/Label";
import Button from "@/ui/Button";
import InputErrorMessage from "@/ui/InputErrorMessage";
import { AxiosError } from "axios";
import { TPersonalData } from "@/types";

const PersonalDataForm = ({
  enableNextBtn,
  handleEnableNextBtn,
  handleDisableNextBtn,
}: IPersonalDataForm) => {
  /*~~~~~~~~$ States $~~~~~~~~*/
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /*~~~~~~~~$ Context $~~~~~~~~*/
  const { setResumeInfo } = useContext(ResumeInfoContext) ?? {};

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
      personalData: {
        ...prev.personalData,
        [name]: value,
      },
    }));
    handleDisableNextBtn();
  };

  const handleOnSubmit: SubmitHandler<IPersonalData> = async (data) => {
    // ** Loading case handling
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
      // ** fulfilled case handling
      const { status } = await GlobalApi.UpdateResumeDetails(params.id, data);
      if (status === 200) {
        toast.success("Data saved successfully.", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });

        handleEnableNextBtn();
      }
    } catch (error) {
      // ** rejected case handling
      const errorObj = error as AxiosError<IErrorResponse>;

      toast.error(`${errorObj.response?.data.error.message}`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormInput = (name: TPersonalData, placeholder: string) => (
    <div>
      <Label>{placeholder}</Label>
      <Input
        type="text"
        placeholder={placeholder}
        {...register(name)}
        onChange={handleInputChange}
      />
      {errors[name] && <InputErrorMessage msg={errors[name].message} />}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(handleOnSubmit)}>
      {renderFormInput("firstName", "First Name")}
      {renderFormInput("lastName", "Last Name")}
      {renderFormInput("jobTitle", "Job Title")}
      {renderFormInput("phone", "Phone")}
      {renderFormInput("email", "Email")}
      {renderFormInput("address", "Address")}
      <Button
        className="capitalize"
        isLoading={isLoading}
        disabled={enableNextBtn}
      >
        save
      </Button>
    </form>
  );
};

export default PersonalDataForm;

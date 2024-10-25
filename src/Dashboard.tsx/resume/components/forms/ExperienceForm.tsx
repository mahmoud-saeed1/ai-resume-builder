// ExperienceForm.tsx
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SExperience } from "@/validation";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { useContext, useState } from "react";
import GlobalApi from "@/service/GlobalApi";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { IExperience, IErrorResponse } from "@/interfaces";
import Input from "@/ui/Input";
import Label from "@/ui/Label";
import Button from "@/ui/Button";
import InputErrorMessage from "@/ui/InputErrorMessage";
import { AxiosError } from "axios";

const ExperienceForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setResumeInfo } = useContext(ResumeInfoContext) ?? {};
  const params = useParams<{ id: string }>();

  const { register, handleSubmit, formState: { errors } } = useForm<IExperience>({
    resolver: yupResolver(SExperience),
  });

  const handleOnSubmit: SubmitHandler<IExperience> = async (data) => {
    if (!params?.id) {
      toast.error("ID parameter is missing.", { autoClose: 2000 });
      return;
    }

    setIsLoading(true);
    try {
      const { status } = await GlobalApi.UpdateResumeDetails(params.id, data);
      if (status === 200) {
        toast.success("Experience saved successfully.", { autoClose: 1000 });
      }
    } catch (error) {
      const errorObj = error as AxiosError<IErrorResponse>;
      toast.error(`${errorObj.response?.data.error.message}`, { autoClose: 2000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleOnSubmit)}>
      <Label>Title</Label>
      <Input {...register("title")} placeholder="Title" />
      {errors.title && <InputErrorMessage msg={errors.title.message} />}
      {/* Repeat for other fields */}
      <Button isLoading={isLoading}>Save Experience</Button>
    </form>
  );
};

export default ExperienceForm;

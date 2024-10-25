import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SSummery } from "@/validation";
import { ISummary, IErrorResponse } from "@/interfaces";
import { useContext, useState } from "react";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import GlobalApi from "@/service/GlobalApi";
import { toast, Bounce } from "react-toastify";
import Input from "@/ui/Input";
import Label from "@/ui/Label";
import Button from "@/ui/Button";
import InputErrorMessage from "@/ui/InputErrorMessage";
import { AxiosError } from "axios";

interface ISummaryFormProps {
  enableNextBtn: boolean;
  handleEnableNextBtn: () => void;
  handleDisableNextBtn: () => void;
}

const SummaryForm = ({
  enableNextBtn,
  handleEnableNextBtn,
  handleDisableNextBtn,
}: ISummaryFormProps) => {
  const { setResumeInfo } = useContext(ResumeInfoContext) ?? {};
  if (!setResumeInfo) throw new Error("ResumeInfoContext is undefined");

  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ISummary>({
    resolver: yupResolver(SSummery),
  });

  const onSubmit: SubmitHandler<ISummary> = async (data) => {
    setIsLoading(true);
    try {
      const response = await GlobalApi.updateSummary(data); // Update API call accordingly
      toast.success("Summary updated!", { theme: "light", transition: Bounce });
      handleEnableNextBtn();
      setResumeInfo((prev) => ({ ...prev, summary: data.content }));
    } catch (error) {
      const axiosError = error as AxiosError<IErrorResponse>;
      toast.error(axiosError.response?.data.error.message, { theme: "light", transition: Bounce });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-summary">
      <Label>Summary</Label>
      <Input
        type="text"
        placeholder="Summary Content"
        {...register("content")}
        onChange={handleDisableNextBtn}
      />
      {errors.content && <InputErrorMessage msg={errors.content.message} />}
      <Button isLoading={isLoading} disabled={enableNextBtn}>Save</Button>
    </form>
  );
};

export default SummaryForm;

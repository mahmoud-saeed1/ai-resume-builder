import { IPersonalData } from "@/interfaces";
import Input from "@/ui/Input";
import Label from "@/ui/Label";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SPersonalData } from "@/validation";
import InputErrorMessage from "@/ui/InputErrorMessage";
import Button from "@/ui/Button";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { useContext } from "react";

const PersonalDataFrom = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IPersonalData>({ resolver: yupResolver(SPersonalData) });
  const onSubmit: SubmitHandler<IPersonalData> = (data) => console.log(data);

  console.log(watch("firstName")); 

  // connect inputs changing with context
  const resumeInfoContext = useContext(ResumeInfoContext);
  if (!resumeInfoContext) {
    throw new Error("ResumeInfoContext is undefined");
  }
  const { setResumeInfo } = resumeInfoContext;

  // handle inputs changing with context
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResumeInfo((prev) => ({
      ...prev,
      personalData: {
        ...prev.personalData,
        [name]: value,
      },
    }));
  };
 

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/*~~~~~~~~$ First Name $~~~~~~~~*/}
      <div>
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          placeholder="Enter your first name"
          {...register("firstName")}
          onChange={handleInputChange}
        />

        {errors.firstName?.message && (
          <InputErrorMessage msg={errors.firstName?.message} />
        )}
      </div>

      {/*~~~~~~~~$ Last Name $~~~~~~~~*/}
      <div>
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          id="lastName"
          placeholder="Enter your last name"
          {...register("lastName")}
          onChange={handleInputChange}
        />
        {errors.lastName?.message && (
          <InputErrorMessage msg={errors.lastName?.message} />
        )}
      </div>

      {/*~~~~~~~~$ Job Title $~~~~~~~~*/}
      <div>
        <Label htmlFor="jobTitle">Job Title</Label>
        <Input
          id="jobTitle"
          placeholder="Enter your job title"
          {...register("jobTitle")}
          onChange={handleInputChange}
        />
        {errors.jobTitle?.message && (
          <InputErrorMessage msg={errors.jobTitle?.message} />
        )}
      </div>

      {/*~~~~~~~~$ Phone $~~~~~~~~*/}
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          placeholder="Enter your phone number"
          {...register("phone")}
          onChange={handleInputChange}
        />
        {errors.phone?.message && (
          <InputErrorMessage msg={errors.phone?.message} />
        )}
      </div>
      {/*~~~~~~~~$ Email $~~~~~~~~*/}
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          placeholder="Enter your email"
          {...register("email")}
          onChange={handleInputChange}
        />
        {errors.email?.message && (
          <InputErrorMessage msg={errors.email?.message} />
        )}
      </div>

      {/*~~~~~~~~$ Address $~~~~~~~~*/}
      <div>
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          placeholder="Enter your address"
          {...register("address")}
          onChange={handleInputChange}
        />
        {errors.address?.message && (
          <InputErrorMessage msg={errors.address?.message} />
        )}
      </div>

      <Button className="capitalize"> submit </Button>
    </form>
  );
};

export default PersonalDataFrom;

import { ChangeEvent } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import Label from "@/ui/Label";
import Input from "@/ui/Input";
import InputErrorMessage from "@/ui/InputErrorMessage";

interface FormInputProps {
  id: string;
  label: string;
  name: string;
  placeholder: string;
  register: UseFormRegisterReturn;
  errorMessage?: string;
  type?: string;
  defaultValue?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

function FormInput({
  id,
  placeholder,
  register,
  onChange,
  defaultValue,
  errorMessage,
  type = "text",
}: FormInputProps) {
  return (
    <div>
      <Label htmlFor={id}>{placeholder}</Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        {...register}
        onChange={onChange}
        defaultValue={defaultValue}
      />
      {errorMessage && <InputErrorMessage msg={errorMessage} />}
    </div>
  );
}

export default FormInput;

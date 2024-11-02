import { ChangeEvent } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import Label from "@/ui/Label";
import Input from "@/ui/Input";
import InputErrorMessage from "@/ui/InputErrorMessage";

interface FormInputProps {
  id: string;
  label: string;
  placeholder: string;
  register?: UseFormRegisterReturn;
  required?: boolean;
  errorMessage?: string;
  type?: string;
  defaultValue?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

function FormInput({
  id,
  label,
  placeholder,
  register,
  required = false,
  onChange,
  defaultValue,
  errorMessage,
  type = "text",
}: FormInputProps) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        {...register}
        onChange={onChange}
        defaultValue={defaultValue}
        required={required}
      />
      {errorMessage && <InputErrorMessage msg={errorMessage} />}
    </div>
  );
}

export default FormInput;

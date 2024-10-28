import React from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";
import Label from "@/ui/Label";
import Input from "@/ui/Input";
import InputErrorMessage from "@/ui/InputErrorMessage";

interface FormInputProps {
  placeholder: string;
  register: UseFormRegisterReturn;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  defaultValue?: string;
  errorMessage?: FieldError | undefined;
  type?: string;
}

function FormInput({
  placeholder,
  register,
  onChange,
  defaultValue,
  errorMessage,
  type = "text",
}: FormInputProps) {
  return (
    <div>
      <Label htmlFor={placeholder}>{placeholder}</Label>
      <Input
        id={placeholder}
        type={type}
        placeholder={placeholder}
        {...register}
        onChange={onChange}
        defaultValue={defaultValue}
      />
      {errorMessage && <InputErrorMessage msg={errorMessage.message} />}
    </div>
  );
}

export default FormInput;

import { ChangeEvent, forwardRef } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import Label from "@/ui/Label";
import Input from "@/ui/Input";
import InputErrorMessage from "@/ui/InputErrorMessage";

interface FormInputProp {
  id: string;
  label: string;
  placeholder: string;
  register?: UseFormRegisterReturn;
  required?: boolean;
  errorMessage?: string;
  type?: string;
  defaultValue?: string;
  className?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProp>(
  (
    {
      id,
      label,
      placeholder,
      register,
      required = false,
      onChange,
      defaultValue,
      className = "",
      errorMessage,
      type = "text",
    },
    ref
  ) => {
    return (
      <div className={`${type === "checkbox" ? "w-fit flex items-center flex-row-reverse" : ""} ${className}`}>
        <Label htmlFor={id} className={type === "checkbox" ? "ml-2" : ""}>{label}</Label>
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          onChange={onChange}
          defaultValue={defaultValue}
          required={required}
          className={type === "checkbox" ? "w-fit" : "w-full"}
          {...register}
          ref={ref}
        />
        {errorMessage && <InputErrorMessage msg={errorMessage} />}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;
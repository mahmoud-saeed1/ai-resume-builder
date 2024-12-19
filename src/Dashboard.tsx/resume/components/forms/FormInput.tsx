import { ChangeEvent, forwardRef } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import Label from "@/ui/Label";
import Input from "@/ui/Input";
import InputErrorMessage from "@/ui/InputErrorMessage";

interface FormInputProp {
  id: string;
  label: string;
  placeholder: string;
  register?: UseFormRegisterReturn; // react-hook-form's register
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
    const inputRef = register?.ref || ref;

    return (
      <div className={className}>
        <Label htmlFor={id}>{label}</Label>
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          onChange={onChange}
          defaultValue={defaultValue}
          required={required}
          className="bg-white"
          {...register} // Spread register properties safely
          ref={inputRef} // Ensure no ref conflict
        />
        {errorMessage && <InputErrorMessage msg={errorMessage} />}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;

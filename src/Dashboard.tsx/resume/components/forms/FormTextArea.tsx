import { ChangeEvent, forwardRef } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import Label from "@/ui/Label";
import Textarea from "@/ui/Textarea";
import InputErrorMessage from "@/ui/InputErrorMessage";

interface FormTextareaProps {
  id: string;
  label: string;
  placeholder: string;
  register?: UseFormRegisterReturn;
  required?: boolean;
  errorMessage?: string;
  defaultValue?: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  style?: React.CSSProperties;
}

// Use forwardRef to forward the ref to the Textarea component
const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(({
  id,
  label,
  placeholder,
  register,
  required = false,
  onChange,
  defaultValue,
  errorMessage,
  className,
  style
}, ref) => {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        placeholder={placeholder}
        {...register}
        onChange={onChange}
        defaultValue={defaultValue}
        required={required}
        className={`bg-white ${className}`}
        ref={ref} 
        style={style}
      />
      {errorMessage && <InputErrorMessage msg={errorMessage} />}
    </div>
  );
});

export default FormTextarea;
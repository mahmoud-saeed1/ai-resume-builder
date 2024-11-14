import { ChangeEvent, ReactNode } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import Label from "@/ui/Label";
import InputErrorMessage from "@/ui/InputErrorMessage";
import Select from "@/ui/Select";

interface FormSelectProps {
  id: string;
  label: string;
  register?: UseFormRegisterReturn;
  required?: boolean;
  errorMessage?: string;
  defaultValue?: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  children: ReactNode;
}

const FormSelect = ({
  id,
  label,
  register,
  required = false,
  onChange,
  defaultValue,
  errorMessage,
  children,
}: FormSelectProps) => {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Select
        id={id}
        {...register}
        onChange={onChange}
        defaultValue={defaultValue}
        required={required}
        className="bg-white border rounded p-2 w-full"
      >
        {children}
      </Select>
      {errorMessage && <InputErrorMessage msg={errorMessage} />}
    </div>
  );
};

export default FormSelect;

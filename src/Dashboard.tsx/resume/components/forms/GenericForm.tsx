import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

interface IGenericFormProps<T> {
  defaultValues: T; // Initial values for the form
  validationSchema: Yup.ObjectSchema<any>; // Yup validation schema
  onSubmit: (data: T) => void; // Submit handler
  fields: IFormField<T>[]; // Array of field configurations
  enableNextBtn: boolean; // Indicates if the Next button is enabled
  handleEnableNextBtn: () => void; // Enables the Next button
  handleDisableNextBtn: () => void; // Disables the Next button
}

export interface IFormField<T> {
  name: keyof T; // Field name
  label: string; // Field label
  type: "text" | "textarea" | "select" | "date" | "checkbox"; // Input type
  options?: { label: string; value: string | number }[]; // Options for select fields
  placeholder?: string; // Input placeholder
  required?: boolean; // Whether the field is required
}

function GenericForm<T>({
  defaultValues,
  validationSchema,
  onSubmit,
  fields,
  enableNextBtn,
  handleEnableNextBtn,
  handleDisableNextBtn,
}: IGenericFormProps<T>) {
  const { control, handleSubmit, watch, formState: { errors, isDirty } } = useForm<T>({
    defaultValues,
    resolver: yupResolver(validationSchema),
  });

  React.useEffect(() => {
    // Enable or disable the Next button based on form state
    if (isDirty) {
      handleEnableNextBtn();
    } else {
      handleDisableNextBtn();
    }
  }, [isDirty, handleEnableNextBtn, handleDisableNextBtn]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name as string} className="form-group">
          <label className="block font-medium mb-1">{field.label}</label>
          <Controller
            name={field.name as any}
            control={control}
            render={({ field: controllerField }) => {
              switch (field.type) {
                case "text":
                case "date":
                  return (
                    <input
                      {...controllerField}
                      type={field.type}
                      placeholder={field.placeholder}
                      className={`input ${errors[field.name] ? "input-error" : ""}`}
                    />
                  );
                case "textarea":
                  return (
                    <textarea
                      {...controllerField}
                      placeholder={field.placeholder}
                      className={`textarea ${errors[field.name] ? "textarea-error" : ""}`}
                    />
                  );
                case "select":
                  return (
                    <select
                      {...controllerField}
                      className={`select ${errors[field.name] ? "select-error" : ""}`}
                    >
                      <option value="">Select an option</option>
                      {field.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  );
                case "checkbox":
                  return (
                    <label className="flex items-center space-x-2">
                      <input {...controllerField} type="checkbox" />
                      <span>{field.label}</span>
                    </label>
                  );
                default:
                  return null;
              }
            }}
          />
          {errors[field.name] && (
            <p className="text-red-500 text-sm">{errors[field.name]?.message as string}</p>
          )}
        </div>
      ))}
      <button
        type="submit"
        disabled={!enableNextBtn}
        className={`btn btn-primary ${!enableNextBtn ? "btn-disabled" : ""}`}
      >
        Submit
      </button>
    </form>
  );
}

export default GenericForm;

import { IExperience } from '@/interfaces';
import React from 'react';
import { Control, Controller, FieldError, FieldValues } from 'react-hook-form';
import FormInput from './FormInput';

interface DynamicFormInputProps {
    name: string; // Should match the experience structure
    label: string;
    index: number;
    type?: string;
    className?: string;
    control: Control<FieldValues>; // Accepts any form data structure
    errors: {
        errors: {
            experience?: {
                [index: number]: {
                    [key in keyof IExperience]?: FieldError;
                };
            };
        };
    }; // Ensure this matches your form structure
    handleChange: (index: number, fieldName: keyof IExperience) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DynamicFormInput = ({
    name,
    label,
    index,
    type = "text",
    className,
    control,
    errors,
    handleChange
}: DynamicFormInputProps) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <FormInput
                    {...field}
                    id={name}
                    type={type}
                    label={label}
                    placeholder={`Enter ${label}`}
                    errorMessage={
                        errors.errors.experience?.[index]?.[name.split('.')[2] as keyof IExperience]?.message
                    }
                    defaultValue={field.value}
                    onChange={(e) => handleChange(index, name.split('.')[2] as keyof IExperience)(e)}
                    className={className}
                />
            )}
        />
    );
};
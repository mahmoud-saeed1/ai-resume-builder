// validation.ts
import * as yup from "yup";

// Personal Data Schema
export const SPersonalData = yup
  .object({
    firstName: yup
      .string()
      .required()
      .matches(/^[a-zA-Z\s]+$/, "First name must be a string")
      .min(3),
    lastName: yup
      .string()
      .required()
      .matches(/^[a-zA-Z\s]+$/, "Last name must be a string")
      .min(3),
    jobTitle: yup
      .string()
      .required()
      .matches(/^[a-zA-Z\s]+$/, "Job title must be a string")
      .min(3),
    phone: yup
      .string()
      .required()
      .matches(
        /^(012|015|010)\d{8}$/,
        "Phone number must be matched 010, 012, 015 and 8 digits"
      ),
    email: yup
      .string()
      .email()
      .required()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Email must be a valid email"
      ),
    address: yup
      .string()
      .required()
      .matches(
        /^[#.0-9a-zA-Z\u0600-\u06FF\s,-]+$/,
        "Address must be matched a valid address"
      ),
  })
  .required();

// Summary Schema
export const SSummary = yup
  .object({
    summary: yup.string().required().min(10),
  })
  .required();

export const EducationSchema = yup.object().shape({
  educationList: yup
    .array()
    .of(
      yup.object().shape({
        universityName: yup
          .string()
          .required("University Name is required")
          .max(100, "University Name must be at most 100 characters"),
        degree: yup.string().required("Degree is required"),
        major: yup.string().required("Major is required"),
        minor: yup.string(),
        startDate: yup
          .date()
          .required("Start Date is required")
          .typeError("Start Date must be a valid date"),
        endDate: yup
          .date()
          .nullable()
          .when("currentlyStudy", {
            is: false,
            then: (schema) =>
              schema
                .required("End Date is required")
                .typeError("End Date must be a valid date")
                .min(
                  yup.ref("startDate"),
                  "End Date cannot be before Start Date"
                ),
            otherwise: (schema) => schema.nullable(),
          }),
        currentlyStudy: yup.boolean(),
        description: yup
          .string()
          .max(500, "Description must be at most 500 characters"),
      })
    )
    .required("At least one education entry is required")
    .min(1, "At least one education entry is required"),
});

export const experienceSchema = yup.object().shape({
  experience: yup.array().of(
    yup.object().shape({
      title: yup.string().required("Title is required"),
      companyName: yup.string().required("Company Name is required"),
      city: yup.string().required("City is required"),
      state: yup.string().required("State is required"),
      startDate: yup.string().required("Start Date is required"),
      endDate: yup.string().when("currentlyWorking", (currentlyWorking, schema) => {
        return currentlyWorking ? schema.nullable() : schema.required("End Date is required");
      }),
      currentlyWorking: yup.boolean(),
      workSummary: yup.string().required("Work Summary is required"),
    })
  ).required(), // Ensure the array itself is required
});
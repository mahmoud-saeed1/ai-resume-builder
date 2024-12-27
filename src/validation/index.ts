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
  education: yup
    .array()
    .of(
      yup.object().shape({
        universityName: yup.string().required("University Name is required"),
        startDate: yup.string().required("Start Date is required"),
        endDate: yup
          .string()
          .when("currentlyStudy", (currentlyStudy, schema) =>
            currentlyStudy
              ? schema.nullable()
              : schema.required("End Date is required")
          ),
        currentlyStudy: yup.boolean(),
        degree: yup.string().required("Degree is required"),
        major: yup.string().required("Major is required"),
        minor: yup.string().nullable(),
        description: yup.string().nullable(),
      })
    )
    .required("At least one education entry is required"),
});

export const experienceSchema = yup.object().shape({
  experience: yup
    .array()
    .of(
      yup.object().shape({
        title: yup.string().required("Title is required"),
        companyName: yup.string().required("Company Name is required"),
        city: yup.string().required("City is required"),
        state: yup.string().required("State is required"),
        startDate: yup.string().required("Start Date is required"),
        endDate: yup
          .string()
          .when("currentlyWorking", (currentlyWorking, schema) => {
            return currentlyWorking
              ? schema.nullable()
              : schema.required("End Date is required");
          }),
        currentlyWorking: yup.boolean(),
        workSummary: yup.string().required("Work Summary is required"),
      })
    )
    .required(), // Ensure the array itself is required
});

export const ProjectSchema = yup.object().shape({
  projects: yup
    .array()
    .of(
      yup.object().shape({
        title: yup.string().required("Title is required"),
        description: yup.string().nullable(),
        projectUrl: yup
          .string()
          .nullable() // Allows null or empty values
          .test(
            "is-url-valid",
            "Invalid URL format",
            (value) =>
              !value || // Skip validation if the field is empty
              /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/.test(
                value
              )
          ),
      })
    )
    .required("At least one project entry is required"),
});

export const CertificationSchema = yup.object().shape({
  certifications: yup
    .array()
    .of(
      yup.object().shape({
        title: yup.string().required("Title is required"),
        issuer: yup.string().required("Issuer is required"),
        date: yup.string().required("Date is required"), // Consider using a date type if needed
      })
    )
    .required("At least one certification entry is required"),
});

export const SkillsSchema = yup.object().shape({
  skills: yup.array().of(
    yup.object().shape({
      name: yup.string().required("Skill name is required"),
      rating: yup.number().min(0).max(5).nullable(),
    })
  ),
});

export const LanguagesSchema = yup.object().shape({
  languages: yup.array().of(
    yup.object().shape({
      laId: yup.string().required(),
      name: yup.string().required("Language name is required"),
      proficiency: yup.string().required("Proficiency is required"),
    })
  ),
});

export const ReferenceSchema = yup.object().shape({
  references: yup.array().of(
    yup.object().shape({
      reId: yup.string().required(),
      name: yup.string().required("Name is required"),
      position: yup.string().required("Position is required"),
      company: yup.string().required("Company is required"),
      phone: yup.string().required("Phone is required"),
      email: yup.string().required("Email is required"),
    })
  ),
});

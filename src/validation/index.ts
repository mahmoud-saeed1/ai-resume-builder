// validation.ts
import * as yup from "yup";

// Personal Data Schema
export const SPersonalData = yup
  .object({
    firstName: yup.string().required().matches(/^[a-zA-Z\s]+$/).min(3),
    lastName: yup.string().required().matches(/^[a-zA-Z\s]+$/).min(3),
    jobTitle: yup.string().required().matches(/^[a-zA-Z\s]+$/).min(3),
    phone: yup.string().required().matches(/^(012|015|010)\d{8}$/),
    email: yup.string().email().required().matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    address: yup.string().required().matches(/^[#.0-9a-zA-Z\u0600-\u06FF\s,-]+$/),
  })
  .required();

// Summary Schema
export const SSummary = yup.object({
  summary: yup.string().required().min(10),
}).required();

// Experience Schema
export const SExperience = yup
  .object({
    title: yup.string().required().min(3),
    companyName: yup.string().required().min(3),
    city: yup.string().required(),
    state: yup.string().required(),
    startDate: yup.string().required(),
    currentlyWorking: yup.boolean(),
    workSummary: yup.string().required().min(10),
  })
  .required();

// Education Schema
export const SEducation = yup
  .object({
    universityName: yup.string().required().min(3),
    startDate: yup.string().required(),
    endDate: yup.string().optional(),
    degree: yup.string().required(),
    major: yup.string().required(),
    description: yup.string().optional(),
  })
  .required();

// Skills Schema
export const SSkills = yup.object({
  name: yup.string().required().min(2),
  rating: yup.number().required().min(0).max(100),
}).required();

// Certifications Schema
export const SCertifications = yup.object({
  title: yup.string().required(),
  issuer: yup.string().required(),
  date: yup.string().required(),
}).required();

// Projects Schema
export const SProjects = yup.object({
  title: yup.string().required(),
  description: yup.string().required(),
}).required();

// Languages Schema
export const SLanguages = yup.object({
  name: yup.string().required(),
  proficiency: yup.string().required(),
}).required();

// Hobbies Schema
export const SHobbies = yup.object({
  name: yup.string().required(),
}).required();

// References Schema
export const SReferences = yup.object({
  name: yup.string().required(),
  position: yup.string().required(),
  company: yup.string().required(),
  contact: yup.string().required(),
}).required();


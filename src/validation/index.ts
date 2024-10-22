import * as yup from "yup";

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

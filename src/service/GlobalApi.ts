import { IResumeInfo, IUserResume } from "@/interfaces";
import axios from "axios"; // Use ES6 module import

const API_Key = import.meta.env.VITE_STARPI_API_KEY; // Now TypeScript knows about import.meta.env

const axiosClient = axios.create({
  baseURL: "http://localhost:1337/api/",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_Key}`,
  },
});

const createNewResume = (data: IUserResume) =>
  axiosClient.post("/user-resumes", data);

// const getUserResumes = (userEmail) => axiosClient.get("/user-resumes");

// get user resumes list by email
const getUserResumes = (userEmail: string | undefined) =>
  axiosClient.get(`/user-resumes?filters[userEmail][$eq]=${userEmail}`);

// update user resume by resumeId
const UpdateResumeDetails = (resumeId: string, data: IResumeInfo) =>
  axiosClient.put(`/user-resumes/${resumeId}`, { data });
export default {
  createNewResume,
  getUserResumes,
  UpdateResumeDetails,
};

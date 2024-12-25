import { IResumeInfo, IUserResume } from "@/interfaces";
import axios from "axios";

const API_Key = import.meta.env.VITE_STARPI_API_KEY;

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL + "/api",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_Key}`,
  },
});

console.log(`${import.meta.env.VITE_BASE_URL}/api/user-resumes`);

const CreateNewResume = (data: IUserResume) =>
  axiosClient.post("/user-resumes", data);

const GetUserResumes = (userEmail: string | undefined) =>
  axiosClient.get(`/user-resumes?filters[userEmail][$eq]=${userEmail}`);

const UpdateResumeData = (resumeId: string, data: IResumeInfo) =>
  axiosClient.put(`/user-resumes/${resumeId}`, { data });

const GetResumeById = (resumeId: string) =>
  axiosClient.get(`/user-resumes/${resumeId}?populate=*`);

const DeleteResume = (resumeId: string) =>
  axiosClient.delete(`/user-resumes/${resumeId}`);
export default {
  createNewResume: CreateNewResume,
  GetUserResumes: GetUserResumes,
  UpdateResumeData: UpdateResumeData,
  GetResumeById: GetResumeById,
  DeleteResume: DeleteResume,
};

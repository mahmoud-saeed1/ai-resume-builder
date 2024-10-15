import { IUserResume } from "@/interfaces";
import axios from "axios"; // Use ES6 module import



const API_Key = import.meta.env.VITE_STARPI_API_KEY; // Now TypeScript knows about import.meta.env

const axiosClient = axios.create({
  baseURL: "http://localhost:1337/api/",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_Key}`,
  },
});

const createNewResume = (data:IUserResume) => axiosClient.post("/user-resumes", data);

export default {
  createNewResume,
};

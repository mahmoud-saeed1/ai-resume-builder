import { IResumeInfo } from "@/interfaces";
import { createContext, Dispatch, SetStateAction } from "react";

// Define the context value type
interface ResumeInfoContextType {
  resumeInfo: IResumeInfo;
  setResumeInfo: Dispatch<SetStateAction<IResumeInfo>>;
}

// Initialize the context with a default value (can be an empty object)
export const ResumeInfoContext = createContext<ResumeInfoContextType | undefined>(undefined);

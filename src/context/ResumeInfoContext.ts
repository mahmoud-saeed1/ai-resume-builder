import { IResumeInfo } from "@/interfaces";
import { createContext, Dispatch, SetStateAction } from "react";

// Define the context value type
interface ResumeInfoContextType {
  resumeInfo: IResumeInfo | null;

  setResumeInfo: Dispatch<SetStateAction<IResumeInfo | undefined>>;
}

// Initialize the context with a default value (can be an empty object)
export const ResumeInfoContext = createContext<
  ResumeInfoContextType | undefined
>(undefined);

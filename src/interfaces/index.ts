// export interface IIcon extends React.SVGProps<SVGSVGElement> {
//   className?: string;
// }

export interface IIcon {
  className?: string;
}

export interface IUserResume {
  data: {
    title: string;
    resumeId: string;
    userEmail: string | undefined;
    userName: string | null | undefined;
  };
}

export interface IReusme {
  createdAt?: string;
  documentId?: string;
  id: number;
  locale?: null;
  publishedAt?: string;
  resumeId?: string;
  title?: string;
  updatedAt?: string;
  userEmail?: string;
  userName?: string;
}

export interface IPersonalData {
  firstName: string;
  lastName: string;
  jobTitle: string;
  phone: string;
  email: string;
  address: string;
}

export interface IExperience {
  exId: string;
  title: string;
  companyName: string;
  city: string;
  state: string;
  startDate: string;
  endDate?: string | null;
  currentlyWorking?: boolean;
  workSummary: string;
}

export interface IEducation {
  edId: string;
  universityName: string;
  startDate: string;
  endDate?: string;
  currentlyStudy?: boolean;
  degree: string;
  major: string;
  minor?: string;
  description: string;
}

export interface ISkill {
  id: string;
  name: string;
  rating: number;
}

export interface ICertification {
  id: number;
  title: string;
  issuer: string;
  date: string;
}

export interface IProject {
  id: number;
  title: string;
  description: string;
}

export interface ILanguage {
  id: number;
  name: string;
  proficiency: string;
}

export interface IHobby {
  id: number;
  name: string;
}

export interface IReference {
  id: number;
  name: string;
  position: string;
  company: string;
  contact: string;
}

export interface IResumeInfo {
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  phone?: string;
  email?: string;
  address?: string;
  themeColor?: string;
  summary?: string;
  experience?: IExperience[];
  education?: IEducation[];
  skills?: ISkill[];
  certifications?: ICertification[];
  projects?: IProject[];
  languages?: ILanguage[];
  hobbies?: IHobby[];
  references?: IReference[];
}

export interface IErrorResponse {
  error: {
    details?: {
      errors: {
        message: string;
      }[];
    };
    message?: string;
  };
}

export interface IFormProbs {
  enableNextBtn: boolean;
  handleEnableNextBtn: () => void;
  handleDisableNextBtn: () => void;
}

export interface IGeneratedSummary {
  summary: string;
  experience_level: "Fresher" | "Mid-Level" | "Senior";
}

// interfaces.ts
export interface IExperienceField {
  title: string;
  companyName: string;
  city: string;
  workSummary: string;
}

export interface IExperienceForm {
  experience: IExperienceField[];
}

import { IResumeInfo } from "@/interfaces";
import PersonalDetails from "./preview/PersonalDetails";
import Summary from "./preview/Summary";
import ProfessionalExperience from "./preview/ProfessionalExperience";
import Education from "./preview/Education";
import Skills from "./preview/Skills";

const ResumePreview = (resumeInfo: IResumeInfo) => {
  return (
    <div className="resumePreview">
      <PersonalDetails {...resumeInfo} />
      <Summary summery={resumeInfo.summery} />
      <ProfessionalExperience experience={resumeInfo.experience} />
      <Education education={resumeInfo.education} />
      <Skills skills={resumeInfo.skills} />
      
    </div>
  );
};

export default ResumePreview;

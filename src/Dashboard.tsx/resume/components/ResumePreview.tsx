import PersonalDataPreview from "./preview/PersonalDataPreview";
import SummaryPreview from "./preview/SummaryPreview";
import ProfessionalExperience from "./preview/ExperiencePreview";
import Education from "./preview/EducationPreview";
import Skills from "./preview/Skills";
import { useContext } from "react";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import Languages from "./preview/Languages";

const ResumePreview = () => {
  const resumeInfo = useContext(ResumeInfoContext);

  return (
    <div className="resumePreview">
      {/*~~~~~~~~$ Personal Data Section $~~~~~~~~*/}
      {resumeInfo?.resumeInfo.personalData && (
        <PersonalDataPreview personalData={resumeInfo?.resumeInfo.personalData} />
      )}

      {/*~~~~~~~~$ Summery Section$~~~~~~~~*/}
      {resumeInfo?.resumeInfo.summary && (
        <SummaryPreview summary={resumeInfo?.resumeInfo.summary} />
      )}

      {/*~~~~~~~~$ Professional Experience Section $~~~~~~~~*/}
      {resumeInfo?.resumeInfo.experience && (
        <ProfessionalExperience
          experience={resumeInfo?.resumeInfo.experience}
        />
      )}

      {/*~~~~~~~~$ Education Section $~~~~~~~~*/}
      {resumeInfo?.resumeInfo.education && (
        <Education education={resumeInfo?.resumeInfo.education} />
      )}

      {/*~~~~~~~~$ Skills Section $~~~~~~~~*/}
      {resumeInfo?.resumeInfo.skills && (
        <Skills skills={resumeInfo?.resumeInfo.skills} />
      )}

      {/*~~~~~~~~$ Language Section $~~~~~~~~*/}
      {resumeInfo?.resumeInfo.languages && (
        <Languages languages={resumeInfo.resumeInfo.languages} />
      )}
    </div>
  );
};

export default ResumePreview;

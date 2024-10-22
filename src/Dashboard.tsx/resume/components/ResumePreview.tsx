import PersonalDetails from "./preview/PersonalDetails";
import Summary from "./preview/Summary";
import ProfessionalExperience from "./preview/ProfessionalExperience";
import Education from "./preview/Education";
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
        <PersonalDetails {...resumeInfo?.resumeInfo.personalData} />
      )}

      {/*~~~~~~~~$ Summery Section$~~~~~~~~*/}
      {resumeInfo?.resumeInfo.summery && (
        <Summary summery={resumeInfo?.resumeInfo.summery} />
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

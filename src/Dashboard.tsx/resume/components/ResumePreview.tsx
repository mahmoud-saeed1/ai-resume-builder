import PersonalDataPreview from "./preview/PersonalDataPreview";
import SummaryPreview from "./preview/SummaryPreview";
import ProfessionalExperience from "./preview/ExperiencePreview";
import Education from "./preview/EducationPreview";
import SkillsPreview from "./preview/SkillsPreview";
import { useContext } from "react";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import Languages from "./preview/Languages";
import CertificationsPreview from "./preview/CertificationsPreview";

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
        <SkillsPreview skills={resumeInfo?.resumeInfo.skills} />
      )}

      {/*~~~~~~~~$ Language Section $~~~~~~~~*/}
      {resumeInfo?.resumeInfo.languages && (
        <Languages languages={resumeInfo.resumeInfo.languages} />
      )}

      {/*~~~~~~~~$ Certification Section $~~~~~~~~*/}
      {resumeInfo?.resumeInfo.certifications && (
        <CertificationsPreview certifications={resumeInfo.resumeInfo.certifications} />
      )}
    </div>
  );
};

export default ResumePreview;

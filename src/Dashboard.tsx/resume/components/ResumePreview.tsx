import PersonalDataPreview from "./preview/PersonalDataPreview";
import SummaryPreview from "./preview/SummaryPreview";
import ProfessionalExperience from "./preview/ExperiencePreview";
import Education from "./preview/EducationPreview";
import SkillsPreview from "./preview/SkillsPreview";
import { useContext } from "react";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import LanguagesPreview from "./preview/LanguagesPreview";
import CertificationsPreview from "./preview/CertificationsPreview";
import ProjectsPreview from "./preview/ProjectsPreview";
import ReferencesPreview from "./preview/ReferencesPreview";

const ResumePreview = () => {
  const resumeInfo = useContext(ResumeInfoContext);

  return (
    <div className="resumePreview">
      {/*~~~~~~~~$ Personal Data Section $~~~~~~~~*/}
      {resumeInfo?.resumeInfo.personalData && (
        <PersonalDataPreview
          personalData={resumeInfo?.resumeInfo.personalData}
        />
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
        <LanguagesPreview languages={resumeInfo.resumeInfo.languages} />
      )}

      {/*~~~~~~~~$ Certification Section $~~~~~~~~*/}
      {resumeInfo?.resumeInfo.certifications && (
        <CertificationsPreview
          certifications={resumeInfo.resumeInfo.certifications}
        />
      )}

      {/*~~~~~~~~$ Projects Section $~~~~~~~~*/}
      {resumeInfo?.resumeInfo.projects && (
        <ProjectsPreview projects={resumeInfo?.resumeInfo.projects} />
      )}

      {/*~~~~~~~~$ References Section $~~~~~~~~*/}
      {resumeInfo?.resumeInfo.references && (
        <ReferencesPreview references={resumeInfo?.resumeInfo.references} />
      )}
    </div>
  );
};

export default ResumePreview;

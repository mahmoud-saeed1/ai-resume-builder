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

  const resumeData = resumeInfo?.resumeInfo;

  return (
    <div className="glass-light p-4 rounded-xl" style={{ background: "white" }}>
      {/*~~~~~~~~$ Personal Data Section $~~~~~~~~*/}
      {resumeData?.personalData && (
        <PersonalDataPreview personalData={resumeData.personalData} />
      )}
      {/*~~~~~~~~$ Summary Section $~~~~~~~~*/}
      {resumeData?.summary && (
        <SummaryPreview summary={resumeData.summary} />
      )}
      {/*~~~~~~~~$ Education Section $~~~~~~~~*/}
      {resumeData?.education && (
        <Education education={resumeData.education} />
      )}
      {/*~~~~~~~~$ Professional Experience Section $~~~~~~~~*/}
      {resumeData?.experience && (
        <ProfessionalExperience experience={resumeData.experience} />
      )}

      {/*~~~~~~~~$ Projects Section $~~~~~~~~*/}
      {resumeData?.projects && (
        <ProjectsPreview projects={resumeData.projects} />
      )}
      {/*~~~~~~~~$ Certification Section $~~~~~~~~*/}
      {resumeData?.certifications && (
        <CertificationsPreview certifications={resumeData.certifications} />
      )}
      {/*~~~~~~~~$ Skills Section $~~~~~~~~*/}
      {resumeData?.skills && (
        <SkillsPreview skills={resumeData.skills} />
      )}
      {/*~~~~~~~~$ Language Section $~~~~~~~~*/}
      {resumeData?.languages && (
        <LanguagesPreview languages={resumeData.languages} />
      )}
      {/*~~~~~~~~$ References Section $~~~~~~~~*/}
      {resumeData?.references && (
        <ReferencesPreview references={resumeData.references} />
      )}

    </div>
  );
};

export default ResumePreview;
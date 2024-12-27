import { useContext } from "react";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";

const PersonalDataPreview = () => {
  const { resumeInfo } = useContext(ResumeInfoContext) ?? {};
  
  if (!resumeInfo?.personalData?.length) {
    return <div>No personal data available.</div>;
  }

  const personalData = resumeInfo.personalData[0];

  return (
    <section className="resume-preview__section">
      <h3 className="resume-preview__title">Personal Data</h3>
      <div className="resume-preview__personal-details">
        <h4 className="resume-preview__name">
          {personalData.firstName} {personalData.lastName}
        </h4>
        <p className="resume-preview__job-title">{personalData.jobTitle}</p>
        <p className="resume-preview__details">
          {personalData.address} | {personalData.email} | {personalData.phone}
        </p>
      </div>
    </section>
  );
};

export default PersonalDataPreview;
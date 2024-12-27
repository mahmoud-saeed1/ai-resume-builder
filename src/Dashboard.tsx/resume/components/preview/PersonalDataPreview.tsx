import { IPersonalData } from "@/interfaces";

const PersonalDataPreview = ({ personalData }: { personalData: IPersonalData[] }) => {
  return (
    <section className="resume-preview__section">
      <h3 className="resume-preview__title">Personal Data</h3>
      {personalData.map(({ firstName, lastName, address, email, jobTitle, phone }) => (
        <div key={`${firstName}-${lastName}`} className="resume-preview__personal-details">
          <h4 className="resume-preview__name">
            {firstName} {lastName}
          </h4>
          <p className="resume-preview__job-title">{jobTitle}</p>
          <p className="resume-preview__details">
            {address} | {email} | {phone}
          </p>
        </div>
      ))}
    </section>
  );
};

export default PersonalDataPreview;
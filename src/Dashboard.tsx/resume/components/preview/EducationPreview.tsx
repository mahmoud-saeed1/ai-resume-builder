import { IEducation } from "@/interfaces";

const EducationPreview = ({ education = [] }: { education: IEducation[] }) => {
  
  return (
    <section className="resume-preview__section resume-preview__education">
    <h3 className="resume-preview__section-title">Education</h3>
    {education.map(({ edId, universityName, degree, major, minor, startDate, endDate, description }) => (
      <div key={edId} className="resume-preview__education-item">
        <h4 className="resume-preview__university-name">{universityName}</h4>
        <p className="resume-preview__degree">{degree} in {major}{minor ? `, ${minor}` : ''}</p>
        <p className="resume-preview__dates">{startDate} - {endDate}</p>
        <p className="resume-preview__description">{description}</p>
      </div>
    ))}
  </section>
  );
};

export default EducationPreview;

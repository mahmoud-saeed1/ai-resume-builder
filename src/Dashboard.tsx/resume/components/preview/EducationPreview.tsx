import { IEducation } from "@/interfaces";

const EducationPreview = ({ education = [] }: { education: IEducation[] }) => {

  return (
    <section className="resume-preview__section resume-preview__education">
      <h3 className="resume-preview__section-title">Education</h3>

      <ul className="preview__list-container">
        {education.map(({ universityName, degree, major, minor, startDate, endDate, description, currentlyStudy }) => (
          <li key={universityName + startDate + endDate}>
            <h4 className="resume-preview__university-name inline-block">{universityName}</h4>
            <p className="resume-preview__degree ">{degree} in {major}{minor ? `, ${minor}` : ''}</p>
            <p className="resume-preview__dates">{startDate} - {currentlyStudy ? "Present" : endDate}</p>
            <p className="resume-preview__description">{description}</p>
          </li>
        ))}
      </ul>

    </section>
  );
};

export default EducationPreview;

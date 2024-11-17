import { IExperience } from "@/interfaces";

const ExperiencePreview = ({ experience = [] }: { experience: IExperience[] }) => {
  return (
    <section className="resume-preview__section resume-preview__experience">
      <h3 className="resume-preview__section-title">Experience</h3>
      <ul className="preview__list-container">
        {experience.map(({ exId, title, companyName, city, state, startDate, endDate, currentlyWorking, workSummary }) => (
          <li key={exId} className="resume-preview__experience-item">
            <h4 className="resume-preview__job-title inline-block">{title}</h4>
            <p className="resume-preview__company">{companyName}, {city}, {state}</p>
            <p className="resume-preview__dates">{startDate} - {currentlyWorking ? 'Present' : endDate}</p>
            <p className="resume-preview__work-summary">{workSummary}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ExperiencePreview;

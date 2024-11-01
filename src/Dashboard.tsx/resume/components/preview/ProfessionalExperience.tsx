import { IResumeInfo } from "@/interfaces";

const ProfessionalExperience = ({ experience }: { experience: IResumeInfo["experience"] }) => {
  return (
    <div className="resumePreview__experience">
      <h2 className="resumePreview__experience--heading">Professional Experience</h2>
      {experience.map((job) => (
        <div key={job.exId} className="resumePreview__experience--job">
          <h3>{job.title}</h3>
          <p>{job.companyName} - {job.city}, {job.state}</p>
          <p>{job.startDate} - {job.currentlyWorking ? "Present" : job.endDate}</p>
          <p className="resumePreview__experience--workSummery">{job.workSummary}</p>
        </div>
      ))}
    </div>
  );
};

export default ProfessionalExperience;

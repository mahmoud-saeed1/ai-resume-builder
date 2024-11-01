import { IResumeInfo } from "@/interfaces";

const Education = ({ education }: { education: IResumeInfo["education"] }) => {
  return (
    <div className="resumePreview__education">
      <h2 className="resumePreview__education--heading">Education</h2>
      {education.map((edu) => (
        <div key={edu.edId} className="resumePreview__education--item">
          <h3>{edu.universityName}</h3>
          <p>{edu.degree} in {edu.major}</p>
          <p>{edu.startDate} - {edu.endDate}</p>
          <p className="resumePreview__education--description">{edu.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Education;

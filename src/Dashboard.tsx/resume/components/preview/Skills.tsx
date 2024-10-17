import { IResumeInfo } from "@/interfaces";

const Skills = ({ skills }: { skills: IResumeInfo["skills"] }) => {
  return (
    <div className="resumePreview__skills">
      <h2 className="resumePreview__skills--heading">Skills</h2>
      <ul className="resumePreview__skills--list">
        {skills.map((skill) => (
          <li key={skill.id} className="resumePreview__skills--item">
            <span>{skill.name}</span>
            <span className="resumePreview__skills--rating">{skill.rating}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Skills;

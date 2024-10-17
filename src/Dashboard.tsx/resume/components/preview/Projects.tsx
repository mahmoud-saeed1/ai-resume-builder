// preview/Projects.tsx
import { IProject } from "@/interfaces";

const Projects = ({ projects }: { projects: IProject[] }) => {
  return (
    <div className="resumePreview__projects">
      <h2 className="resumePreview__projects--heading">Projects</h2>
      {projects.map((project) => (
        <div key={project.id} className="resumePreview__projects--item">
          <p className="font-semibold">{project.title}</p>
          <p className="text-gray-500">{project.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Projects;

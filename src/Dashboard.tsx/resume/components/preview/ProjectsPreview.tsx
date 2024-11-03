// preview/Projects.tsx
import { IProjects } from "@/interfaces";

const ProjectsPreview = ({ projects }: { projects: IProjects[] }) => {
  return (
    <section className="resume-preview__section mb-6">
      <h3 className="resume-preview__section-title text-2xl font-semibold text-gray-800 border-b-2 border-gray-300 pb-2">
        Projects
      </h3>
      {projects.map(({ prId, title, description }) => (
        <div
          key={prId}
          className="resume-preview__project-item mb-4 border border-gray-200 p-4 rounded-md"
        >
          <h4 className="resume-preview__project-title text-xl font-bold text-gray-800">
            {title}
          </h4>
          <p className="resume-preview__project-description text-gray-700">
            {description}
          </p>
        </div>
      ))}
    </section>
  );
};

export default ProjectsPreview;

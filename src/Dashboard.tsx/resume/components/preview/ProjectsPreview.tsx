import { IProjects } from "@/interfaces";

const ProjectsPreview = ({ projects }: { projects: IProjects[] }) => {
  return (
    <section className="resume-preview__section mb-6">
      <h3 className="resume-preview__section-title text-2xl font-semibold text-gray-800 border-b-2 border-gray-300 pb-2">
        Projects
      </h3>
      <ul className="preview__list-container">
        {projects.map(({ prId, title, description }) => (
          <li
            key={prId}
          >
            <h4 className="inline-block">
              {title}
            </h4>
            <p className="resume-preview__project-description text-gray-700">
              {description}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ProjectsPreview;

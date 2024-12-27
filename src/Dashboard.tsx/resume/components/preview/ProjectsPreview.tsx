import { IProjects } from "@/interfaces";

const ResumePreview = ({ projects }: { projects: IProjects[] }) => {
  return (
    <div>
      <section className="resume-preview__section mb-6">
        <h3 className="resume-preview__section-title text-2xl font-semibold text-gray-800 border-b-2 border-gray-300 pb-2">
          Projects
        </h3>
        <ul className="preview__list-container">
          {projects.map(({ title, description, projectUrl }, index) => (
            <li key={index}>
              <h4 className="inline-block space-x-2">
                <span>{title}</span><span>{projectUrl && (
                  <a href={projectUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    {`(${projectUrl})`}
                  </a>
                )}</span>
              </h4>
              <p className="resume-preview__project-description text-gray-700">{description}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default ResumePreview;
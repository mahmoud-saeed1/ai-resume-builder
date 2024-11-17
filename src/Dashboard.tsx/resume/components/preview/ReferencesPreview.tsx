// preview/References.tsx
import { IReferences } from "@/interfaces";

const ReferencesPreview = ({ references }: { references: IReferences[] }) => {
  return (
    <section className="resume-preview__section mb-6">
      <h3 className="resume-preview__section-title text-2xl font-semibold text-gray-800 border-b-2 border-gray-300 pb-2">
        References
      </h3>
      <ul className="preview__list-container">
        {references.map(({ company, contact, name, position, reId }) => (
          <li key={reId}>
            <span className="resume-preview__reference-name">{name}</span>
            <span className="resume-preview__reference-position">
              {`, ${position}`}
            </span>
            <span className="resume-preview__reference-company">
              {`, ${company}`}
            </span>
            <span className="resume-preview__reference-contact">
              {`, ${contact}`}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ReferencesPreview;

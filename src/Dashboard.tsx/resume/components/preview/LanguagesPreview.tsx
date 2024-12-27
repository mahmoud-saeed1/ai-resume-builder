import { ILanguages } from "@/interfaces";

const LanguagesPreview = ({ languages }: { languages: ILanguages[] }) => {
  return (
    <section className="resume-preview__section mb-6">
      <h3 className="resume-preview__section-title text-2xl font-semibold text-gray-800 border-b-2 border-gray-300 pb-2">
        Languages
      </h3>
      <ul className="preview__list-container">
        {languages.map(({ name, proficiency }) => (
          <li key={name + proficiency} className="resume-preview__list-item">
            <span className="resume-preview__language-name">{name}</span>
            {proficiency && <span className="resume-preview__language-proficiency">{proficiency}</span>}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default LanguagesPreview;

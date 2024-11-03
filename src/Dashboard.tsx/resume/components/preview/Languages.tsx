import { ILanguages } from "@/interfaces";

const Languages = ({ languages }: { languages: ILanguages[] }) => {
  return (
    <section className="resume-preview__section mb-6">
      <h3 className="resume-preview__section-title text-2xl font-semibold text-gray-800 border-b-2 border-gray-300 pb-2">
        Languages
      </h3>
      <ul className="resume-preview__languages-list list-disc list-inside">
        {languages.map(({ laId, name, proficiency }) => (
          <li key={laId} className="resume-preview__language text-gray-700">
            <span className="resume-preview__language-name">{name}</span>
            <span className="resume-preview__language-proficiency">
              {` - (${proficiency})`}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Languages;

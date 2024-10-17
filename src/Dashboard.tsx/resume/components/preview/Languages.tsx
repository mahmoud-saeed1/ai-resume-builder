// preview/Languages.tsx
import { ILanguage } from "@/interfaces";

const Languages = ({ languages }: { languages: ILanguage[] }) => {
  return (
    <div className="resumePreview__languages">
      <h2 className="resumePreview__languages--heading">Languages</h2>
      <ul>
        {languages.map((language) => (
          <li key={language.id} className="resumePreview__languages--item">
            {language.name} - {language.proficiency}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Languages;

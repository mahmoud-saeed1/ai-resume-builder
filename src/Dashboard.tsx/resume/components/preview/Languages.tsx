// preview/Languages.tsx
import { ILanguages } from "@/interfaces";

const Languages = ({ languages }: { languages: ILanguages[] }) => {
  return (
    <div className="resumePreview__languages">
      <h2 className="resumePreview__languages--heading">Languages</h2>
      <ul>
        {languages.map((language) => (
          <li key={language.laId} className="resumePreview__languages--item">
            {language.name} - {language.proficiency}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Languages;

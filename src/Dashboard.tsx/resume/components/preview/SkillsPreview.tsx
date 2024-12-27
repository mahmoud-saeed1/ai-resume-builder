import { ISkills } from "@/interfaces";

const SkillsPreview = ({ skills }: { skills: ISkills[] }) => {
  return (
    <section className="resume-preview__section mb-6">
      <h3 className="resume-preview__section-title text-2xl font-semibold text-gray-800 border-b-2 border-gray-300 pb-2">
        Skills
      </h3>
      <ul className="preview__list-container">
        {skills.map(({ name, rating }, index) => {
          const validRating = rating ?? 0; // Fallback to 0 if rating is null
          return (
            <li key={index} className="mb-2">
              <h4 className="inline-block">{name}</h4>
              {validRating > 0 && (
                <div className="w-1/3 bg-gray-300 rounded-full mt-1 overflow-hidden">
                  <div
                    className="bg-blue-500 text-xs leading-none py-1 text-center text-white rounded-full"
                    style={{ width: `${validRating * 100}%` }}
                  >
                    {(Math.round(validRating)/5)*100}%
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default SkillsPreview;
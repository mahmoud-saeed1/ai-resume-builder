import { ISkills } from "@/interfaces";

const SkillsPreview = ({ skills }: { skills: ISkills[] }) => {
  return (
    <section className="resume-preview__section mb-6">
      <h3 className="resume-preview__section-title text-2xl font-semibold text-gray-800 border-b-2 border-gray-300 pb-2">
        Skills
      </h3>
      <ul className="resume-preview__skills-list list-disc list-inside">
        {skills.map(({ name, rating, skId }) => (
          <li key={skId} className="resume-preview__skill text-gray-700">
            <h4>{name}</h4>
            {/* rating bar */}
            <div className="w-full bg-gray-300 rounded-full mt-1">
              <div
                className="bg-blue-500 text-xs leading-none py-1 text-center text-white rounded-full"
                style={{ width: `${rating}%` }}
              >
                {rating}%
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default SkillsPreview;

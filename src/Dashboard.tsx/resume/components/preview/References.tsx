// preview/References.tsx
import { IReference } from "@/interfaces";

const References = ({ references }: { references: IReference[] }) => {
  return (
    <div className="resumePreview__references">
      <h2 className="resumePreview__references--heading">References</h2>
      {references.map((ref) => (
        <div key={ref.id} className="resumePreview__references--item">
          <p className="font-semibold">{ref.name}</p>
          <p className="text-gray-500">{ref.position} - {ref.company}</p>
          <p className="text-gray-500">{ref.contact}</p>
        </div>
      ))}
    </div>
  );
};

export default References;

// preview/Certifications.tsx

import { ICertification } from "@/interfaces";

const Certifications = ({
  certifications,
}: {
  certifications: ICertification[];
}) => {
  return (
    <div className="resumePreview__certifications">
      <h2 className="resumePreview__certifications--heading">Certifications</h2>
      {certifications.map((cert) => (
        <div key={cert.id} className="resumePreview__certifications--item">
          <p className="font-semibold">{cert.title}</p>
          <p className="text-gray-500">
            {cert.issuer} - {cert.date}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Certifications;

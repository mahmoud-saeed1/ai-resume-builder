import { ICertification } from "@/interfaces";

const CertificationsPreview = ({
  certifications,
}: {
  certifications: ICertification[];
}) => {
  return (
    <section className="resume-preview__section mb-6">
      <h3 className="resume-preview__section-title text-2xl font-semibold text-gray-800 border-b-2 border-gray-300 pb-2">
        Certifications
      </h3>
      <ul className="resume-preview__certifications-list list-disc list-inside">
        {certifications.map(({ ceId, date, issuer, title }) => (
          <li
            key={ceId}
            className="resume-preview__certification text-gray-700"
          >
            {title} - {issuer} ({date})
          </li>
        ))}
      </ul>
    </section>
  );
};

export default CertificationsPreview;

import { IPersonalData } from "@/interfaces";

const PersonalDataPreview = ({
  personalData,
}: {
  personalData: IPersonalData[];
}) => {
  return (
    <>
      {personalData.map(
        ({ firstName, lastName, address, email, jobTitle, phone }) => (
          <section
            key={firstName + lastName + address + email}
            className="resume-preview__section resume-preview__personal-details"
          >
            <h3 className="resume-preview__section-title">Personal Details</h3>
            <div className="resume-preview__personal-details-item">
              <h4 className="resume-preview__name">
                {firstName} {lastName}
              </h4>
              <p className="resume-preview__job-title">{jobTitle}</p>
              <p className="resume-preview__address">{address}</p>
              <p className="resume-preview__email">{email}</p>
              <p className="resume-preview__phone">{phone}</p>
            </div>
          </section>
        )
      )}
    </>
  );
};

export default PersonalDataPreview;

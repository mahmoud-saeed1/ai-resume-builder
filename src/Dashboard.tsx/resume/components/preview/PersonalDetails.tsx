import { IPersonalData } from "@/interfaces";

const PersonalDetails = ({
  firstName,
  lastName,
  address,
  email,
  jobTitle,
  phone,
}: IPersonalData) => {
  return (
    <div className="resumePreview__personalDetails">
      <h1 className="resumePreview__personalDetails--name">
        {firstName} {lastName}
      </h1>
      <p className="resumePreview__personalDetails--jobTitle">{jobTitle}</p>
      <p className="resumePreview__personalDetails--contact">
        <span>{phone}</span> | <span>{email}</span> | <span>{address}</span>
      </p>
    </div>
  );
};

export default PersonalDetails;

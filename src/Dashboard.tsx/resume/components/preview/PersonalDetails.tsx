import { IPersonalData } from "@/interfaces";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const PersonalDetails = (personalData: IPersonalData) => {
  const { address, email, firstName, jobTitle, lastName, phone } = personalData;

  const params = useParams<{ id: string }>();

  useEffect(() => {
    console.log(params)
  }, [])
  

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

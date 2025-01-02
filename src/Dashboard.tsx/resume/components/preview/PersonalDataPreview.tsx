import { IPersonalData } from "@/interfaces";

const PersonalDataPreview = ({ personalData }: { personalData: IPersonalData[] }) => {
  return (
    <section className="">
      {personalData.map(({ firstName, lastName, address, email, jobTitle, phone }) => (
        <div key={`${firstName}-${lastName}`} className="resume-preview__personal-details">
          <h1 className="resume-preview__name">
            {firstName} {lastName}
          </h1>
          <h2 className="resume-preview__job-title">{jobTitle}</h2>
          <article className="resume-preview__section -translate-x-2">
            <h3 className="resume-preview__section-title ">contact info</h3>
            <div>
              <span >
                Adress:{` `}
              </span>
              <span className="resume-preview__details">
                {address}
              </span>
            </div>
            <div>
              <span>
                Phone:{` `}
              </span>
              <span className="resume-preview__details">
                {phone}
              </span>
            </div>
            <div>
              <span>
                Email:{` `}
              </span>
              <span className="resume-preview__details">{email}</span>
            </div>
          </article>
        </div>
      ))}
    </section>
  );
};

export default PersonalDataPreview;
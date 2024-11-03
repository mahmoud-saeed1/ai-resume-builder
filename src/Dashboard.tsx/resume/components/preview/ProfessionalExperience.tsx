import { IEducation } from "@/interfaces";

const EducationPreview = ({ education = [] }: { education: IEducation[] }) => {
  return (
    <section className="resumePreview__education">
      <h2 className="resumePreview__education--heading">Education</h2>
      <div className="resumePreview__education--grid">
        {education.map(
          ({
            degree,
            description,
            edId,
            major,
            startDate,
            universityName,
            currentlyStudy,
            endDate,
            minor,
          }) => (
            <div key={edId} className="resumePreview__education--card">
              <div className="resumePreview__education--header">
                <h3>{universityName}</h3>
                <span>{degree}</span>
              </div>
              <div className="resumePreview__education--details">
                <p>
                  {major}
                  {minor && `, ${minor}`}
                </p>
                <p>
                  {startDate} - {currentlyStudy ? "Present" : endDate}
                </p>
              </div>
              <p className="resumePreview__education--description">
                {description}
              </p>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default EducationPreview;

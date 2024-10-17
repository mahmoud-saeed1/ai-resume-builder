import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FormSection from "../components/FormSection";
import ResumePreview from "../components/ResumePreview";
import dummy from "@/data/dummy";
import { IResumeInfo } from "@/interfaces";

const EditResume = () => {
  /*~~~~~~~~$ States $~~~~~~~~*/
  const params = useParams();
  const [resumeInfo, setResumeInfo] = useState<IResumeInfo>(dummy);

  
  /*~~~~~~~~$ Effects $~~~~~~~~*/
  useEffect(() => {
    setResumeInfo(dummy); // Simulate fetching data by using dummy
  }, [params]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 place-items-center gap-10 p-10">
      <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
        <FormSection />
        <ResumePreview {...resumeInfo} />
      </ResumeInfoContext.Provider>
    </div>
  );
};

export default EditResume;

import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FormSection from "../components/FormSection";
import ResumePreview from "../components/ResumePreview";
import { IResumeInfo } from "@/interfaces";
import GlobalApi from "@/service/GlobalApi";

const EditResume = () => {
  /*~~~~~~~~$ States $~~~~~~~~*/
  const { resumeId } = useParams<{ resumeId: string }>();
  const [resumeInfo, setResumeInfo] = useState<IResumeInfo>();

  /*~~~~~~~~$ Effects $~~~~~~~~*/
  useEffect(() => {
    getResumeData();
  }, []);

  /*~~~~~~~~$ Handlers $~~~~~~~~*/
  const getResumeData = () => {
    GlobalApi.GetResumeById(resumeId!).then((resp) => {

      setResumeInfo(resp.data.data);
    });
  };

  useEffect(() => {
    console.log("here is resumeId", resumeId);
  }
    , [resumeId]);

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo: resumeInfo || {} as IResumeInfo, setResumeInfo }}>
      <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-10">
        <FormSection />
        <ResumePreview />
      </div>
    </ResumeInfoContext.Provider>
  );
};

export default EditResume;

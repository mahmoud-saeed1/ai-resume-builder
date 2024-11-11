import { useUser } from "@clerk/clerk-react";
import AddResume from "./components/AddResume";
import GlobalApi from "@/service/GlobalApi";
import { useEffect, useState } from "react";
import { IReusme } from "@/interfaces";
import ResumeItem from "./components/ResumeItem";

const Dashboard = () => {
  const { user } = useUser();
  const [resumeList, setResumeList] = useState<IReusme[]>([]);

  // get user resumes list using useEffect dependency on user email
  useEffect(() => {
    getResumesList();
  }, [user?.primaryEmailAddress?.emailAddress ?? ""]);

  const getResumesList = () => {
    GlobalApi.GetUserResumes(user?.primaryEmailAddress?.emailAddress).then(
      (res) => {
        setResumeList(res.data.data);
      }
    );
  };


  return (
    <section>
      <div className="container">
        <h1 className="title-primary">my resume</h1>

        <h2 className="title-secondary">
          start creating ai resume to your next job role
        </h2>
        <div className="resume-container">
          <AddResume />

          {resumeList.map((resume) => (
            <ResumeItem key={resume.id} {...resume} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;

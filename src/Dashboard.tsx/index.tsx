import { useUser } from "@clerk/clerk-react";
import AddResume from "./components/AddResume";
import GlobalApi from "@/service/GlobalApi";
import { useEffect, useState } from "react";
import { IReusme } from "@/interfaces";
import ResumeItem from "./components/ResumeItem";

const Dashboard = () => {
  const { user } = useUser();
  const [resumeList, setResumeList] = useState<IReusme[]>([]);

  // Get user resumes list using useEffect with dependency on user email
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
    <section className="dashboard">
      <div className="dashboard__container">
        <h1 className="dashboard__title">My Resumes</h1>
        <h2 className="dashboard__subtitle">
          Start creating your AI-generated resume for your next job role
        </h2>


        <div className="dashboard__resume-list">
          <div className="dashboard__resume-actions">
            <AddResume />
          </div>
          {resumeList.map(({ resumeId, createdAt, updatedAt, title }) => (
            <ResumeItem
              key={resumeId}
              createdAt={createdAt}
              updatedAt={updatedAt}
              resumeId={resumeId ?? ""}
              resumeSummary={""}
              resumeTitle={title ?? "Untitled"}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;

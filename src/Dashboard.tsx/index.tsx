import AddResume from "./components/AddResume";

const Dashboard = () => {
  return (
    <section>
      <div className="container">
        <h1 className="title-primary">my resume</h1>

        <h2 className="title-secondary">
          start creating ai resume to your next job role
        </h2>
        <div className="resume-container">
          <AddResume />
        </div>
      </div>
    </section>
  );
};

export default Dashboard;

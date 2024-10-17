const Summary = ({ summery }: { summery: string }) => {
    return (
      <div className="resumePreview__summary">
        <h2 className="resumePreview__summary--heading">Summary</h2>
        <p className="resumePreview__summary--text">{summery}</p>
      </div>
    );
  };
  
  export default Summary;
  
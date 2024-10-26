const Summary = ({ summary }: { summary: string }) => {
    return (
      <div className="resumePreview__summary">
        <h2 className="resumePreview__summary--heading">Summary</h2>
        <p className="resumePreview__summary--text">{summary}</p>
      </div>
    );
  };
  
  export default Summary;
  
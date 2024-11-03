const SummaryPreview = ({ summary }: { summary: string }) => {
  return (
    <section className="resume-preview__section resume-preview__summary">
      <h3 className="resume-preview__section-title">Summary</h3>
      <p className="resume-preview__section-content">{summary}</p>
    </section>
  );
};

export default SummaryPreview;

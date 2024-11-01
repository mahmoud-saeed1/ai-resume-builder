
const Summary = ({ summary }: { summary: string }) => {
  return (
    <div className="summary bg-white shadow-md rounded-md p-6 mb-4">
      <h2 className="summary__heading text-xl font-semibold text-primary mb-3">
        Summary
      </h2>
      <p className="summary__text text-sm text-gray-600">{summary}</p>
    </div>
  );
};

export default Summary;

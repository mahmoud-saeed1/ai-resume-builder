import "../../index.css";

interface ErrorFallbackProps {
  message: string;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ message }) => {
  return (
    <h1 className="error-fallback__message">
      An error has occurred: {message}
    </h1>
  );
};

export default ErrorFallback;

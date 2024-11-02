import { TextareaHTMLAttributes, forwardRef } from "react";

interface IProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, IProps>(
  ({ className, ...rest }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`${className} border-[1px] border-gray-300 rounded-xl shadow-lg focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 px-3 py-3 text-md w-full bg-transparent resize-none`}
        {...rest}
      />
    );
  }
);

export default Textarea;

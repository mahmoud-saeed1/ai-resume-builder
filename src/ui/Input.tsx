import { InputHTMLAttributes, forwardRef } from "react";

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input = forwardRef<HTMLInputElement, IProps>(
  ({ className = "", ...rest }, ref) => {
    return (
      <input
        ref={ref}
        className={`${className} border-[1px] border-gray-300 shadow-lg rounded-xl focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 px-3 py-3 text-md bg-transparent`}
        {...rest}
      />
    );
  }
);

export default Input;

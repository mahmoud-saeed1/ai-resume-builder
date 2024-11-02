import { SelectHTMLAttributes, forwardRef } from "react";

interface IProps extends SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
}

const Select = forwardRef<HTMLSelectElement, IProps>(
  ({ className, children, ...rest }, ref) => {
    return (
      <select
        ref={ref}
        className={`${className} border-[1px] rounded-xl border-gray-300 shadow-lg focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 px-3 py-3 text-md w-full bg-transparent`}
        {...rest}
      >
        {children}
      </select>
    );
  }
);

export default Select;

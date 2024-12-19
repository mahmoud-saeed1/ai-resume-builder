import { LabelHTMLAttributes } from "react";

interface IProps extends LabelHTMLAttributes<HTMLLabelElement> {
  className?: string;
}

const Label = ({ className, ...rest }: IProps) => {
  return (
    <label
      className={`text-gray-700 font-medium capitalize whitespace-nowrap ${className}`}
      {...rest}
    />
  );
};

export default Label;
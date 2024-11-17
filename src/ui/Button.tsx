import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import { ButtonHTMLAttributes, ReactNode } from "react";

const buttonVariants = cva(
  "flex items-center justify-center rounded-xl font-medium text-white duration-300 hover:text-white dark:text-black disabled:text-gray-600 disabled:bg-gray-300 disabled:hover:bg-gray-500 disabled:border-gray-400 disabled:cursor-not-allowed fo btn",
  {
    variants: {
      variant: {
        // ** SUCCESS
        success:
          "bg-green-500 dark:bg-green-600 dark:text-white hover:bg-green-700 dark:hover:text-white",

        // ** FILLED
        default:
          "text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 dark:text-white dark:bg-blue-600 dark:hover:bg-blue-700",
        danger:
          "bg-red-900 dark:bg-[#c2344d] dark:text-white dark:hover:bg-red-700",
        cancel:
          "bg-transparent border border-gray-400 text-gray-500 dark:bg-gray-500 dark:text-dark hover:text-white hover:bg-gray-600 dark:hover:bg-gray-600",

        // ** OUTLINE
        outline:
          "border border-blue-600 hover:text-white bg-transparent text-black hover:border-transparent hover:bg-blue-600 dark:text-gray-700 dark:hover:text-white",
      },
      size: {
        default: "px-4 py-2",
        sm: "text-sm px-4 py-2",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
  isLoading?: boolean;
  type?: "submit" | "button" | "reset";
}

const Button = ({
  variant,
  size,
  fullWidth,
  isLoading,
  className,
  children,
  type,
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size, fullWidth, className }))}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
};

export default Button;

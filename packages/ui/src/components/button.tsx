import * as React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
};

const base = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-600",
  secondary: "bg-gray-800 hover:bg-gray-700 text-white focus:ring-gray-700",
  outline: "border border-gray-300 text-gray-800 hover:bg-gray-50 focus:ring-gray-300",
  ghost: "text-gray-800 hover:bg-gray-100 focus:ring-gray-300",
};
const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export function Button({ variant = "default", size = "md", className = "", ...props }: ButtonProps) {
  return <button className={[base, variants[variant], sizes[size], className].join(" ")} {...props} />;
}



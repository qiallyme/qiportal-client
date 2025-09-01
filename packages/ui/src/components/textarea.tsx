import * as React from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", ...props }, ref) => (
    <textarea
      ref={ref}
      className={[
        "w-full rounded-md border border-gray-300 bg-white text-gray-900",
        "px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
        className,
      ].join(" ")}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";



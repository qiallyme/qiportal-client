import * as React from "react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", children, ...props }, ref) => (
    <select
      ref={ref}
      className={[
        "w-full rounded-md border border-gray-300 bg-white text-gray-900",
        "px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = "Select";

export const SelectTrigger = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", children, ...props }, ref) => (
    <select
      ref={ref}
      className={[
        "w-full rounded-md border border-gray-300 bg-white text-gray-900",
        "px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </select>
  )
);
SelectTrigger.displayName = "SelectTrigger";

export const SelectContent = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1" {...props}>
    {children}
  </div>
);

export const SelectItem = React.forwardRef<HTMLOptionElement, React.OptionHTMLAttributes<HTMLOptionElement>>(
  ({ className = "", ...props }, ref) => (
    <option
      ref={ref}
      className={[
        "px-3 py-2 text-sm text-gray-900 hover:bg-gray-100 cursor-pointer",
        className,
      ].join(" ")}
      {...props}
    />
  )
);
SelectItem.displayName = "SelectItem";

export const SelectValue = ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span className="text-gray-900" {...props}>
    {children}
  </span>
);

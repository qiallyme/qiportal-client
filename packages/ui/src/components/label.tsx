import * as React from "react";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export function Label({ className = "", ...props }: LabelProps) {
  return <label className={["text-sm font-medium text-gray-700", className].join(" ")} {...props} />;
}



import * as React from "react";

export function Dialog({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={["fixed inset-0 z-50 flex items-center justify-center bg-black/40", className].join(" ")} {...props} />;
}

export function DialogContent({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={["bg-white rounded-xl shadow-xl border border-gray-200 p-6 w-full max-w-lg", className].join(" ")} {...props} />;
}

export function DialogHeader({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={["mb-4", className].join(" ")} {...props} />;
}

export function DialogTitle({ className = "", ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={["text-xl font-semibold text-gray-900", className].join(" ")} {...props} />;
}



import { useEffect } from "react";

export default function Login() {
  useEffect(() => {
    const portal = "https://portal.qially.com/client";
    const isPortal = location.hostname === "portal.qially.com";
    window.location.href = isPortal ? "/client" : portal;
  }, []);

  return (
    <div className="min-h-screen grid place-items-center p-8">
      <div className="max-w-sm w-full text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-xl grid place-items-center bg-gradient-to-br from-blue-500 to-purple-500">
          <img src="/logo.svg" alt="QiAlly" className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-semibold">Redirecting to login…</h1>
        <p className="text-gray-500 text-sm">If nothing happens, click below.</p>
        <a
          href="https://portal.qially.com/client"
          className="w-full inline-flex justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          Go to Portal
        </a>
      </div>
    </div>
  );
}

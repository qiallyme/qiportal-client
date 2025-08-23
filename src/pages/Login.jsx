import { useEffect } from "react";

/**
 * Host-aware login: always send users to the protected hostname.
 */
export default function Login() {
  const goLogin = () => {
    if (location.hostname === "portal.qially.com") {
      // Already on the protected host; Access will intercept /client if needed
      location.href = "/client";
    } else {
      // Force the protected hostname so Access can do its job
      location.href = "https://portal.qially.com/client";
    }
  };

  useEffect(() => { goLogin(); }, []);

  return (
    <div className="min-h-screen grid place-items-center p-8">
      <div className="max-w-sm w-full text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-xl grid place-items-center bg-gradient-to-br from-blue-500 to-purple-500">
          <img src="/logo.svg" alt="QiAlly" className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-semibold">Redirecting to login…</h1>
        <p className="text-gray-500 text-sm">If nothing happens, click the button below.</p>
        <button
          onClick={goLogin}
          className="inline-flex items-center justify-center rounded-lg px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

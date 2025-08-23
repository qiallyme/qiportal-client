import { useEffect } from "react";

/**
 * Hands login off to Cloudflare Access.
 * Uses returnTo so users land on /client after auth.
 */
export default function Login() {
  const TEAM = import.meta.env.VITE_CF_TEAM || "qially";
  const returnTo = encodeURIComponent(`${window.location.origin}/client`);
  const ACCESS_LOGIN = `https://${TEAM}.cloudflareaccess.com/cdn-cgi/access/login?returnTo=${returnTo}`;

  useEffect(() => {
    window.location.href = ACCESS_LOGIN;
  }, []);

  return (
    <div className="min-h-screen grid place-items-center p-8">
      <div className="max-w-sm w-full text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-xl grid place-items-center bg-gradient-to-br from-blue-500 to-purple-500">
          <img src="/logo.svg" alt="QiAlly" className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-semibold">Redirecting to login…</h1>
        <p className="text-gray-500 text-sm">
          If nothing happens, click the button below.
        </p>
        <button
          onClick={() => {
            window.location.href = ACCESS_LOGIN;
          }}
          className="inline-flex items-center justify-center rounded-lg px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
        >
          Continue to Cloudflare Access
        </button>
      </div>
    </div>
  );
}

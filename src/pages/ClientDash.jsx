import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function ClientDash() {
  const [me, setMe] = useState(null);
  useEffect(() => { api("/api/me").then(setMe); }, []);
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Client Dashboard</h1>
      <p className="mt-2 opacity-80">Signed in as: {me?.email ?? "…"}</p>
      <button className="mt-4 underline" onClick={() => (window.location.href = "/logout")}>
        Logout
      </button>
    </div>
  );
}

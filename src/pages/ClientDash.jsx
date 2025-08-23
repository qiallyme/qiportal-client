// src/pages/ClientDash.jsx
import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function ClientDash() {
  const [me, setMe] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await api("/api/me");
        if (alive) setMe(data);
      } catch (e) {
        if (alive) setErr("Could not load profile.");
      }
    })();
    return () => { alive = false; };
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Client Dashboard</h1>
      {err && <p className="mt-2 text-red-600">{err}</p>}
      <p className="mt-2 opacity-80">Signed in as: {me?.email ?? "…"}</p>
      <button className="mt-4 underline" onClick={() => (window.location.href = "/logout")}>
        Logout
      </button>
    </div>
  );
}

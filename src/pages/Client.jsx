import { useEffect, useState } from 'react';

export default function Client() {
  const [identity, setIdentity] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadIdentity() {
      try {
        // Cloudflare Access exposes identity on this path for the *current* host.
        const res = await fetch('/cdn-cgi/access/get-identity', {
          credentials: 'include',
          headers: { 'Accept': 'application/json' },
        });

        if (!res.ok) {
          // 400 usually means “not logged in” on this endpoint
          const text = await res.text();
          if (!cancelled) setErr(`Identity fetch failed (${res.status}): ${text || 'unauthorized'}`);
          return;
        }

        const json = await res.json();
        if (!cancelled) setIdentity(json);
      } catch (e) {
        if (!cancelled) setErr(String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadIdentity();
    return () => { cancelled = true; };
  }, []);

  const email = identity?.email || identity?.userEmail;

  return (
    <div className="container mx-auto max-w-3xl py-10 px-4">
      <h1 className="text-2xl font-semibold mb-2">Client Portal</h1>
      <p className="text-subtext mb-6">This is a placeholder screen until the real dashboard is ready.</p>

      {loading && (
        <div className="rounded-xl border p-4 mb-6">Checking your session…</div>
      )}

      {!loading && err && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-4 mb-6">
          <div className="font-medium mb-1">Not signed in (or identity not available)</div>
          <div className="text-sm break-all">{err}</div>
          <a
            className="inline-block mt-4 px-4 py-2 rounded-lg border"
            href="/cdn-cgi/access/login/portal.qially.com?redirect_url=%2Fclient"
          >
            Sign in
          </a>
        </div>
      )}

      {!loading && !err && (
        <div className="rounded-xl border p-4 mb-6">
          <div className="text-sm text-subtext mb-1">Signed in as</div>
          <div className="text-lg font-medium">{email || 'Unknown user'}</div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a className="btn" href="/cdn-cgi/access/logout?return_to=https%3A%2F%2Fqially.com">
              Log out
            </a>
            <a className="btn btn-ghost" href="https://qially.com">Go to public site</a>
          </div>

          <details className="mt-6">
            <summary className="cursor-pointer">Debug details</summary>
            <pre className="mt-3 text-xs overflow-auto p-3 bg-gray-50 rounded-lg">
{JSON.stringify(identity, null, 2)}
            </pre>
          </details>
        </div>
      )}

      <div className="text-sm text-subtext">
        Host: <code>{typeof window !== 'undefined' ? window.location.hostname : ''}</code>
      </div>
    </div>
  );
}

// src/components/ProtectedRoute.jsx
import { useEffect, useState } from 'react';

export default function ProtectedRoute({ children }) {
  const [ok, setOk] = useState(null);

  useEffect(() => {
    fetch('/api/me', { credentials: 'include' })
      .then(r => (r.ok ? r.json() : null))
      .then(d => setOk(!!d))
      .catch(() => setOk(false));
  }, []);

  if (ok === null) return null; // loading

  if (!ok) {
    window.location.href =
      'https://qially.cloudflareaccess.com/cdn-cgi/access/login/portal.qially.com?redirect_url=%2Fclient';
    return null;
  }

  return children;
}

// src/pages/Logout.jsx
export default function Logout() {
  const team = "qially";
  const ret = encodeURIComponent("https://portal.qially.com");
  window.location.href = `https://${team}.cloudflareaccess.com/cdn-cgi/access/logout?returnTo=${ret}`;
  return null;
}

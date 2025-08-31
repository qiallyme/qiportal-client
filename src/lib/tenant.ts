// src/lib/tenant.ts
export function getClientSlugFromHost(hostname = window.location.hostname) {
  // builtbyrays.qially.com → "builtbyrays"
  // portal root (qially.com / portal.qially.com) → "qially" fallback
  const parts = hostname.split(".").filter(Boolean);
  if (parts.length < 3) return "qially"; // fallback default org slug
  return parts[0].toLowerCase();
}

// Optional alias map (so zjk → zaitullahk; innovahire → innovahire)
const ALIASES: Record<string, string> = {
  zjk: "zaitullahk",
  // add others if needed
};

export function normalizeSlug(slug: string) {
  return ALIASES[slug] ?? slug;
}

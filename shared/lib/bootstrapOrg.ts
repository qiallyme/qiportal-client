// src/lib/bootstrapOrg.ts
import { supabase } from "../../../../../src/lib/supabase";
import { getClientSlugFromHost, normalizeSlug } from "../../../../../src/lib/tenant";

export type Org = { id: string; name: string; slug?: string };
export type Space = { id: string; org_id: string; name: string; slug: string };

export async function bootstrapOrg() {
  const raw = getClientSlugFromHost();
  const slug = normalizeSlug(raw);

  // Use exact slug matching if slug column exists, otherwise fallback to name matching
  const { data: orgs, error: orgErr } = await supabase
    .from("orgs")
    .select("id,name,slug")
    .eq("slug", slug); // exact slug match
  
  if (orgErr || !orgs?.[0]) throw new Error("Org not found for slug: " + slug);
  const org: Org = orgs[0];

  // Load spaces the current user can see (RLS will filter)
  const { data: spaces, error: spErr } = await supabase
    .from("kb_spaces")
    .select("id,org_id,name,slug")
    .eq("org_id", org.id)
    .order("created_at", { ascending: true });
  
  if (spErr) throw spErr;

  return { slug, org, spaces: (spaces ?? []) as Space[] };
}

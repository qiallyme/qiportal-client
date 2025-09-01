// src/pages/KbHome.tsx
import { useTenant } from "../../contexts/TenantProvider";
import { supabase } from "../../lib/supabase";

export default function KbHome() {
  const { org, spaces } = useTenant();
  
  // render spaces; clicking one loads articles for that space
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">{org?.name} — Knowledge Base</h1>
      <ul className="mt-4 space-y-2">
        {spaces.map((s) => (
          <li key={s.id} className="underline">{s.name}</li>
        ))}
      </ul>
    </div>
  );
}

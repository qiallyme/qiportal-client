import { createClient } from '@supabase/supabase-js'

// Frontend client - uses only anon key
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!,
  { auth: { persistSession: true } }
)

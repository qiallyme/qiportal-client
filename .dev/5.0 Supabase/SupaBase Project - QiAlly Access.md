database auth: P6jRrXYTx8RkQknK
##### Project API
Javascript
Dart
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://vwqkhjnkummwtvfxgqml.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)
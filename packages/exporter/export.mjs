// packages/exporter/export.mjs
import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Load environment variables from .env file
try {
  const dotenv = await import('dotenv');
  dotenv.config();
} catch (error) {
  console.log('dotenv not available, using system environment variables');
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CLIENT_SLUG = process.env.CLIENT_SLUG;
// Use the correct environment variable names from your .env file
const URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SECRETE_KEY || process.env.SUPABASE_SERVICE_KEY;
const OUT = process.env.OUT || `apps/kb-${CLIENT_SLUG}/content`;

// Debug logging
console.log('Environment check:', {
  CLIENT_SLUG,
  URL: URL ? '✓ Set' : '✗ Missing',
  KEY: KEY ? '✓ Set' : '✗ Missing',
  OUT
});

if (!CLIENT_SLUG) {
  console.error('CLIENT_SLUG environment variable is required');
  console.error('Set it with: $env:CLIENT_SLUG="builtbyrays" (PowerShell) or export CLIENT_SLUG="builtbyrays" (bash)');
  process.exit(1);
}

if (!URL) {
  console.error('VITE_SUPABASE_URL or SUPABASE_URL environment variable is required');
  console.error('Make sure your .env file contains: VITE_SUPABASE_URL=https://vwqkhjnkummwtvfxgqml.supabase.co');
  process.exit(1);
}

if (!KEY) {
  console.error('SUPABASE_SECRETE_KEY or SUPABASE_SERVICE_KEY environment variable is required');
  console.error('Make sure your .env file contains the service role key (starts with eyJ...)');
  process.exit(1);
}

// Load clients configuration
const clientsPath = path.join(__dirname, '../quartz-config/clients/clients.json');
const clients = JSON.parse(await fs.readFile(clientsPath, 'utf8'));

if (!clients[CLIENT_SLUG]) {
  console.error(`Client "${CLIENT_SLUG}" not found in clients.json`);
  console.error('Available clients:', Object.keys(clients));
  process.exit(1);
}

const ORG_ID = clients[CLIENT_SLUG].orgId;
console.log('Configuration:', { CLIENT_SLUG, ORG_ID, title: clients[CLIENT_SLUG].title });

const db = createClient(URL, KEY, { 
  auth: { persistSession: false } 
});

console.log('Fetching spaces for org:', ORG_ID);
const { data: spaces, error: spacesError } = await db
  .from('kb_spaces')
  .select('id,slug,name')
  .eq('org_id', ORG_ID);

if (spacesError) {
  console.error('Error fetching spaces:', spacesError);
  process.exit(1);
}

console.log('Found spaces:', spaces?.length || 0);
if (spaces?.length === 0) {
  console.log('No spaces found. You may need to create a kb_space in the database for this org.');
}

await fs.mkdir(OUT, { recursive: true });

for (const s of spaces ?? []) {
  console.log(`Processing space: ${s.name} (${s.slug})`);
  const dir = path.join(OUT, s.slug);
  await fs.mkdir(dir, { recursive: true });

  const { data: arts, error: artsError } = await db
    .from('kb_articles')
    .select('id,title,body_markdown,tags,updated_at,status')
    .eq('space_id', s.id)
    .neq('status','archived');

  if (artsError) {
    console.error(`Error fetching articles for space ${s.name}:`, artsError);
    continue;
  }

  console.log(`Found ${arts?.length || 0} articles in space ${s.name}`);

  for (const a of arts ?? []) {
    const front = [
      '---',
      `title: ${a.title.replace(/:/g,' -')}`,
      `tags: ${JSON.stringify(a.tags || [])}`,
      `updated: ${a.updated_at}`,
      '---',
      ''
    ].join('\n');
    await fs.writeFile(path.join(dir, `${a.id}.md`), front + (a.body_markdown || ''));
  }
}
console.log('Export complete →', OUT);

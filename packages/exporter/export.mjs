// packages/exporter/export.mjs
import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CLIENT_SLUG = process.env.CLIENT_SLUG;
const URL = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_KEY;
const OUT = process.env.OUT || `apps/kb-${CLIENT_SLUG}/content`;

if (!CLIENT_SLUG) {
  console.error('CLIENT_SLUG environment variable is required');
  process.exit(1);
}

// Load clients configuration
const clientsPath = path.join(__dirname, '../quartz-config/clients/clients.json');
const clients = JSON.parse(await fs.readFile(clientsPath, 'utf8'));

if (!clients[CLIENT_SLUG]) {
  console.error(`Client "${CLIENT_SLUG}" not found in clients.json`);
  process.exit(1);
}

const ORG_ID = clients[CLIENT_SLUG].orgId;
const db = createClient(URL, KEY);

const { data: spaces } = await db
  .from('kb_spaces')
  .select('id,slug,name')
  .eq('org_id', ORG_ID);

await fs.mkdir(OUT, { recursive: true });

for (const s of spaces ?? []) {
  const dir = path.join(OUT, s.slug);
  await fs.mkdir(dir, { recursive: true });

  const { data: arts } = await db
    .from('kb_articles')
    .select('id,title,body_markdown,tags,updated_at,status')
    .eq('space_id', s.id)
    .neq('status','archived');

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

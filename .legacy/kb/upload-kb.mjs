import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs/promises';
import path from 'node:path';
import fg from 'fast-glob';
import matter from 'gray-matter';
import mime from 'mime';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE; // service key for upload
const LOCAL_ROOT = 'K:/Key-KB/Clients-KBs/Zy-KB'; // <-- adjust per client
const CLIENT = 'zy';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

const bucket = 'kb';
const docsRoot = `clients/${CLIENT}/docs`;
const assetsRoot = `clients/${CLIENT}/assets`;

function toKey(abs) {
  const rel = abs.replace(LOCAL_ROOT + path.sep, '').replace(/\\/g, '/');
  return rel;
}

function isAsset(p) {
  return !p.toLowerCase().endsWith('.md');
}

async function upsertIndexRow({ pathKey, title, tags, visibility }) {
  const { data, error } = await supabase
    .from('kb_files')
    .upsert({
      client_slug: CLIENT,
      path: `clients/${CLIENT}/docs/${pathKey}`,
      title,
      tags,
      visibility
    }, { onConflict: 'client_slug,path' })
    .select().single();
  if (error) throw error;
  return data;
}

async function uploadFile(storagePath, bytes) {
  const { error } = await supabase.storage.from(bucket).upload(storagePath, bytes, {
    upsert: true,
    contentType: mime.getType(storagePath) || 'application/octet-stream'
  });
  if (error) throw error;
}

function frontmatterDefaults(fm, filename) {
  const title = fm.title || filename.replace(/\.md$/i, '');
  const tags = Array.isArray(fm.tags) ? fm.tags : (fm.tags ? [fm.tags] : []);
  const visibility = fm.visibility || 'client';
  return { title, tags, visibility };
}

async function run() {
  const files = await fg('**/*', { cwd: LOCAL_ROOT, absolute: true });
  for (const abs of files) {
    const rel = toKey(abs);
    const bytes = await fs.readFile(abs);

    if (isAsset(rel)) {
      const dest = `${assetsRoot}/${rel}`;
      await uploadFile(dest, bytes);
      console.log('asset →', dest);
      continue;
    }

    // Markdown
    const raw = bytes.toString('utf8');
    const { data: fm /*, content*/ } = matter(raw);
    const { title, tags, visibility } = frontmatterDefaults(fm, path.basename(rel));

    const docKey = rel.replace(/\.md$/i, '');
    const storagePath = `${docsRoot}/${docKey}.md`;
    await uploadFile(storagePath, Buffer.from(raw, 'utf8'));
    await upsertIndexRow({ pathKey: `${docKey}.md`, title, tags, visibility });
    console.log('doc →', storagePath, 'title:', title);
  }
  console.log('✓ Zy-KB upload complete');
}

run().catch(err => { console.error(err); process.exit(1); });

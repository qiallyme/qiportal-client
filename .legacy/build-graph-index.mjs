import fs from 'node:fs/promises';
await fs.mkdir(OUT, { recursive: true });
const clients = await fs.readdir(ROOT, { withFileTypes: true });


for (const d of clients) {
if (!d.isDirectory()) continue;
const client = d.name; // e.g., builtbyrays
const files = await fg(['**/*.md'], { cwd: path.join(ROOT, client), absolute: true });


const nodes = []; // { id, title, tags, path, visibility }
const edges = []; // { source, target, weight }
const byId = new Map(); // id -> node


// First pass: collect nodes
for (const abs of files) {
const raw = await fs.readFile(abs, 'utf8');
const { data, content } = matter(raw);
const id = path.posix.join(client, toId(abs));
const title = data.title || path.basename(abs).replace(/\.md$/i, '');
const tags = Array.isArray(data.tags) ? data.tags : (data.tags ? [data.tags] : []);
const visibility = data.visibility || 'client';
byId.set(id, { id, title, tags, path: id, visibility, _content: content });
}


// Second pass: extract edges
for (const node of byId.values()) {
const refs = extractLinks(node._content);
for (const ref of refs) {
const targetId = normalizeRef(node.id, path.posix.join(client, ref));
if (byId.has(targetId)) {
edges.push({ source: node.id, target: targetId, weight: 1 });
}
}
delete node._content; // drop raw content from graph index
}


// Optional: undirected merge (add reverse edges if missing)
const key = (a, b) => `${a}→${b}`;
const seen = new Set(edges.map(e => key(e.source, e.target)));
for (const e of [...edges]) {
const rev = key(e.target, e.source);
if (!seen.has(rev)) {
edges.push({ source: e.target, target: e.source, weight: e.weight });
seen.add(rev);
}
}


const graph = {
client,
generatedAt: new Date().toISOString(),
nodes: [...byId.values()],
edges,
// lightweight search index seed
search: [...byId.values()].map(n => ({ id: n.id, title: n.title, tags: n.tags }))
};


const outPath = path.join(OUT, `${client}.json`);
await fs.writeFile(outPath, JSON.stringify(graph, null, 2), 'utf8');
console.log(`✓ Graph for ${client} → ${path.relative(process.cwd(), outPath)}`);
}
}


build().catch(err => { console.error(err); process.exit(1); });
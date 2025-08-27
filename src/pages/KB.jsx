import React, { useEffect, useMemo, useState } from 'react';
import Fuse from 'fuse.js';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { listDocs, getSignedUrl } from '@/lib/kbApi';

function Sidebar({ items, onSelect, query, setQuery }) {
  return (
    <div className="w-72 shrink-0 border-r border-white/10 p-3">
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search titles or #tags"
        className="w-full mb-3 px-3 py-2 rounded-xl bg-white/5 outline-none"
      />
      <ul className="space-y-1">
        {items.map(it => (
          <li key={it.path}>
            <button
              onClick={() => onSelect(it)}
              className="w-full text-left px-2 py-1 rounded hover:bg-white/5"
            >
              <div className="text-sm">{it.title}</div>
              <div className="text-xs opacity-60">{(it.tags||[]).map(t => `#${t}`).join(' ')}</div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function KB() {
  // TODO: derive from logged-in user; hardcode for Zy while testing
  const clientSlug = 'zy';

  const [docs, setDocs] = useState([]);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(null);
  const [content, setContent] = useState('Select a doc');

  useEffect(() => {
    listDocs(clientSlug).then(setDocs).catch(console.error);
  }, [clientSlug]);

  const fuse = useMemo(() => new Fuse(docs, { keys: ['title','tags'], threshold: 0.3 }), [docs]);
  const filtered = query ? fuse.search(query).map(r => r.item) : docs;

  useEffect(() => {
    if (!active) return;
    const storagePath = `kb/${active.path}`.replace(/^kb\//, ''); // just sanity
    getSignedUrl(active.path).then(async (url) => {
      const res = await fetch(url);
      const md = await res.text();
      setContent(md);
    });
  }, [active]);

  return (
    <div className="flex min-h-[calc(100vh-80px)]">
      <Sidebar items={filtered} onSelect={setActive} query={query} setQuery={setQuery} />
      <main className="flex-1 p-6 prose prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </main>
    </div>
  );
}

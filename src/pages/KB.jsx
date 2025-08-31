import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, BookOpen, Home, ChevronRight, Lock } from "lucide-react";
import { useUser } from "../context/UserContext";

/**
 * QiPortals – Client Knowledge Base (Top‑Down MVP)
 * -------------------------------------------------
 * Drop this component into your React + Vite app (e.g., at /kb route).
 * It ships with:
 *  - Static content registry (in‑memory) you can later swap for API/Cloudflare KV/R2.
 *  - Category view, article view, and fuzzy search (client‑side).
 *  - Access gate stub (expects a user object, or falls back to Dummy Login button).
 *  - Clean glass UI using Tailwind.
 *
 * How to use now (static):
 *  <KnowledgeBaseShell user={currentUser}/>
 *
 * Later, replace CONTENT_REGISTRY + INDEX with fetchers wired to your storage.
 * The rest of the UI remains unchanged.
 */

/** ----------------------------------------
 * 1) STATIC KB CONTENT (MVP)
 *    You can move this to /public/kb/*.json|md and fetch instead of bundling.
 * -----------------------------------------*/
const INDEX = [
  {
    id: "getting-started",
    title: "Getting Started",
    blurb: "Quick tour, logins, and how support works.",
    articles: [
      { slug: "welcome", title: "Welcome to QiSuite™ Client Portal" },
      { slug: "using-the-kb", title: "How the Knowledge Base Works" },
    ],
  },
  {
    id: "account",
    title: "Your Account",
    blurb: "Passwords, access, and notifications.",
    articles: [
      { slug: "login-access", title: "Logging In & Access Levels" },
      { slug: "notifications", title: "Email, SMS & Portal Notifications" },
    ],
  },
  {
    id: "projects",
    title: "Projects & Tickets",
    blurb: "Requests, sprints, and deliverables.",
    articles: [
      { slug: "submit-a-request", title: "Submitting a Request / Ticket" },
      { slug: "sprints", title: "Sprints, Status, and ETAs" },
    ],
  },
];

const CONTENT_REGISTRY = {
  "welcome": `---\ntitle: Welcome to QiSuite™ Client Portal\ntags: [intro, portal]\nrole: client\n---\n\n# Welcome\n\nYou made it. This is your **QiSuite™ Client Portal**. From here you can:\n\n- Open chat, view tickets, and track progress.\n- Browse this Knowledge Base for quick answers.\n- Upload docs and review deliverables.\n\n> MVP note: This page is served statically so we can ship **now**. We'll swap storage later without changing the UI.\n\n---\n\n## Where things live\n\n- **Dashboard:** quick links and status.\n- **Tickets:** submit requests and see updates.\n- **Knowledge Base:** you are here.\n\nIf you're stuck, open a ticket titled \"Help\"—we'll triage it.`,

  "using-the-kb": `---\ntitle: How the Knowledge Base Works\ntags: [kb, docs]\n---\n\n# Using the KB\n\nThis KB is built **site‑down**: the front end ships first, the data source can evolve.\n\n### Today\n- Articles are bundled with the app to keep things simple.\n- Search is client‑side and instant.\n\n### Tomorrow\nSwap the loader to use **Cloudflare KV, R2, D1, or a Git-backed store**. Same UI, richer data.`,

  "login-access": `---\ntitle: Logging In & Access Levels\ntags: [auth, access]\n---\n\n# Login & Access\n\n- **Clients** see their workspaces, tickets, and docs.\n- **Admins** see everything for their org.\n\n> Locked out? Use \"Forgot Password\" or contact support.\n\n### Security\nWe use role-based access. Keep your login private.`,

  "notifications": `---\ntitle: Email, SMS & Portal Notifications\ntags: [notifications]\n---\n\n# Notifications\n\nYou can opt in to **email** or **SMS** updates for ticket activity.\nManage your preferences in *Account → Notifications*.`,

  "submit-a-request": `---\ntitle: Submitting a Request / Ticket\ntags: [tickets, requests]\n---\n\n# Submit a Request\n\n1. Go to **Tickets → New**.\n2. Pick a category.\n3. Attach files.\n4. Hit **Create**.\n\nWe'll reply inside the portal (and via your notification prefs).`,

  "sprints": `---\ntitle: Sprints, Status, and ETAs\ntags: [sprints, status]\n---\n\n# Sprints & Status\n\nWork is batched into 1–2 week sprints. Each ticket shows:\n\n- **Status:** queued → in progress → review → done\n- **ETA:** target delivery window\n- **Owner:** who's on it\n\nNeed it sooner? Mark as **Priority** and add context.`,
};

/** ----------------------------------------
 * 2) MINIMAL MD → HTML (client-side)
 *    For MVP, a tiny converter. Replace with remark/rehype later if needed.
 * -----------------------------------------*/
function mdToHtml(md) {
  // strip YAML frontmatter
  const body = md.replace(/^---[\s\S]*?---\n?/, "");
  // headings
  let html = body
    .replace(/^###### (.*$)/gim, "<h6>$1</h6>")
    .replace(/^##### (.*$)/gim, "<h5>$1</h5>")
    .replace(/^#### (.*$)/gim, "<h4>$1</h4>")
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    // bold & italic
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    // blockquote
    .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-600">$1</blockquote>')
    // lists
    .replace(/^\s*[-*] (.*)$/gim, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)(?!\n<li>)/gims, '<ul class="list-disc pl-5 my-2">$1</ul>')
    // code fence (very simple)
    .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 rounded-xl p-4 overflow-auto border">$1</pre>')
    // paragraphs
    .replace(/^(?!<h\d|<ul|<li|<pre|<blockquote)(.+)$/gim, '<p class="my-2 leading-relaxed">$1</p>');
  return html;
}

/** ----------------------------------------
 * 3) FUZZY SEARCH (simple contains across titles + content)
 * -----------------------------------------*/
function useSearch(query) {
  const normalized = query.trim().toLowerCase();
  return useMemo(() => {
    if (!normalized) return [];
    const results = [];
    for (const category of INDEX) {
      for (const a of category.articles) {
        const content = CONTENT_REGISTRY[a.slug] || "";
        const haystack = (a.title + "\n" + content).toLowerCase();
        const i = haystack.indexOf(normalized);
        if (i !== -1) {
          const start = Math.max(0, i - 40);
          const end = Math.min(haystack.length, i + 80);
          results.push({ slug: a.slug, title: a.title, snippet: haystack.slice(start, end) + "…" });
        }
      }
    }
    return results;
  }, [normalized]);
}

/** ----------------------------------------
 * 4) ACCESS GATE (stub)
 *    Replace with your real auth; here we simulate a minimal gate.
 * -----------------------------------------*/
function AccessGate({ user, onDummyLogin }) {
  if (user) return null;
  return (
    <div className="fixed inset-0 backdrop-blur-xl bg-white/95 grid place-items-center p-6 z-50">
      <div className="max-w-md w-full rounded-2xl shadow-2xl bg-white border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-2">
          <Lock className="w-5 h-5 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900">Client Access Required</h2>
        </div>
        <p className="text-gray-600 mb-4">This Knowledge Base is available to signed‑in clients. For the MVP, use the Dummy Login to preview.</p>
        <button onClick={onDummyLogin} className="w-full rounded-xl px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white transition border border-gray-700">Dummy Login</button>
      </div>
    </div>
  );
}

/** ----------------------------------------
 * 5) UI PIECES
 * -----------------------------------------*/
function CategoryCard({ cat, onOpen }) {
  return (
    <motion.button
      onClick={onOpen}
      whileHover={{ y: -2 }}
      className="text-left rounded-2xl p-5 bg-white border border-gray-200 shadow-sm hover:shadow-lg transition w-full hover:border-gray-300">
      <div className="flex items-center gap-3 mb-2">
        <BookOpen className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">{cat.title}</h3>
      </div>
      <p className="text-gray-600">{cat.blurb}</p>
      <div className="text-sm text-gray-500 mt-3">{cat.articles.length} article{cat.articles.length>1?"s":""}</div>
    </motion.button>
  );
}

function ArticleList({ catId, onOpenSlug, onLoadMd }) {
  const cat = INDEX.find(c => c.id === catId);
  if (!cat) return null;
  return (
    <div className="space-y-2">
      {cat.articles.map(a => (
        <button key={a.slug} onClick={() => { onOpenSlug(a.slug); onLoadMd(a.slug); }} className="w-full flex items-center justify-between rounded-xl p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 transition">
          <span className="text-gray-900">{a.title}</span>
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </button>
      ))}
    </div>
  );
}

function ArticleView({ slug, onBack, articleMd }) {
  const html = useMemo(() => mdToHtml(articleMd), [articleMd]);
  return (
    <div className="rounded-2xl p-6 bg-white border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-sm rounded-xl px-3 py-1 bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 transition">
          <Home className="w-4 h-4" /> Back to KB
        </button>
      </div>
      <div className="prose prose-gray max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

/** ----------------------------------------
 * 6) SHELL
 * -----------------------------------------*/
export default function KnowledgeBaseShell() {
  const { email, role } = useUser();
  const [query, setQuery] = useState("");
  const [openCategory, setOpenCategory] = useState(null);
  const [openSlug, setOpenSlug] = useState(null);
  const [articleMd, setArticleMd] = useState("\n# Select an article\n\nYour content will appear here.");
  const results = useSearch(query);

  // Use actual user from context instead of dummy user
  const user = email ? { id: email, role } : null;

  // Add kb-page class to body when component mounts
  useEffect(() => {
    document.body.classList.add('kb-page');
    return () => {
      document.body.classList.remove('kb-page');
    };
  }, []);

  async function loadMd(slug){
    try{
      const res = await fetch(`/kb/articles/${slug}.md`);
      if(!res.ok) throw new Error("not found");
      const text = await res.text();
      setArticleMd(text);
    } catch(e){
      // Fallback to static content
      const staticContent = CONTENT_REGISTRY[slug];
      if (staticContent) {
        setArticleMd(staticContent);
      } else {
        setArticleMd(`# Not found

Could not load **${slug}.md** from /kb/articles/.`);
      }
    }
  }

  return (
    <div className="min-h-[100dvh] bg-white text-gray-900">
      <AccessGate user={user} onDummyLogin={() => {}} />

      <header className="px-6 pt-8 pb-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">QiSuite™ Knowledge Base</h1>
            <p className="text-gray-600">Ship the portal first. Swap storage later. Site‑down, not up‑to‑site.</p>
          </div>
          <div className="relative w-full md:w-96">
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search articles…"
              className="w-full rounded-2xl pl-10 pr-4 py-2 bg-white border border-gray-300 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
            />
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>
      </header>

      <main className="px-6 pb-12 bg-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {/* Left: Categories */}
          <div className="md:col-span-1 space-y-3">
            {INDEX.map(cat => (
              <CategoryCard key={cat.id} cat={cat} onOpen={() => { setOpenCategory(cat.id); setOpenSlug(null); }} />
            ))}
          </div>

          {/* Right: Content/Search */}
          <div className="md:col-span-2 space-y-4">
            {query && results.length > 0 && (
              <div className="rounded-2xl p-4 bg-white border border-gray-200 shadow-sm">
                <div className="text-sm text-gray-600 mb-2">Search results</div>
                <div className="space-y-2">
                  {results.map(r => (
                    <button key={r.slug} onClick={() => { setOpenSlug(r.slug); loadMd(r.slug); }} className="block w-full text-left rounded-xl p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 transition">
                      <div className="font-medium text-gray-900">{r.title}</div>
                      <div className="text-sm text-gray-600 line-clamp-2">{r.snippet}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!query && !openSlug && openCategory && (
              <div className="rounded-2xl p-4 bg-white border border-gray-200 shadow-sm">
                <div className="text-sm text-gray-600 mb-2">Articles in category</div>
                <ArticleList catId={openCategory} onOpenSlug={setOpenSlug} onLoadMd={loadMd} />
              </div>
            )}

            {!query && openSlug && (
              <ArticleView slug={openSlug} onBack={() => { setOpenSlug(null); }} articleMd={articleMd} />
            )}

            {!query && !openSlug && !openCategory && (
              <div className="rounded-2xl p-6 bg-white border border-gray-200 shadow-sm">
                <div className="text-lg font-semibold mb-2 text-gray-900">Start here</div>
                <p className="text-gray-600">Pick a category on the left, or open an article below.</p>
                <div className="grid sm:grid-cols-2 gap-3 mt-4">
                  {INDEX[0].articles.map(a => (
                    <button key={a.slug} onClick={() => { setOpenSlug(a.slug); loadMd(a.slug); }} className="text-left rounded-xl p-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 transition">
                      <span className="text-gray-900">{a.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="px-6 pb-8 bg-gray-50 border-t border-gray-200">
        <div className="max-w-5xl mx-auto text-xs text-gray-500">© {new Date().getFullYear()} QiAlly™ / QiSuite™</div>
      </footer>
    </div>
  );
}

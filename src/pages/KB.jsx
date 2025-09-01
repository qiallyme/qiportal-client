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

      <header className="px-6 pt-8 pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
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
              className="w-full rounded-2xl pl-10 pr-4 py-2 bg-white border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
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

export default function DocLayout({ sidebar, children }) {
  return (
    <div className="container py-16">
      <div className="grid lg:grid-cols-[300px_1fr] gap-8">
        <aside className="lg:sticky lg:top-8 lg:h-fit">
          <nav className="glass p-4 rounded-xl2">
            {sidebar}
          </nav>
        </aside>
        <main className="prose prose-slate max-w-none">
          <div className="space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
  
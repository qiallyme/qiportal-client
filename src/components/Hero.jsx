export default function Hero() {
  return (
    <section className="relative overflow-hidden isolate min-h-[70vh] flex items-center" data-theme="dark">
      <div className="absolute inset-0 bg-hero-gradient bg-stars" />
      <div className="absolute inset-x-0 top-0 h-1/2 bg-glow-radial pointer-events-none" />
      <div className="container relative z-10 grid md:grid-cols-2 gap-10 py-16">
        <div className="text-left max-w-xl">
          <p className="text-subtext mb-4">QiAlly • Consulting + Client Portal</p>
          <h1 className="font-display text-4xl md:text-6xl leading-tight">
            Practical growth systems <span className="gradient-text">for small teams</span>
          </h1>
          <p className="mt-5 text-lg text-subtext">
            Strategy, ops, and clean execution. We set up tools, workflows, and dashboards so your
            business actually runs.
          </p>
          <ul className="mt-6 grid gap-2 text-sm text-subtext">
            <li>• Fractional ops & systems setup</li>
            <li>• Client portals, tickets, and automations</li>
            <li>• Analytics, receipts, and finance hygiene</li>
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a className="btn btn-primary" href="#contact">Work with us</a>
            <a className="btn btn-ghost" href="https://portal.qially.com/client">Client login</a>
          </div>
        </div>
        <div className="glass p-4 md:p-6 rounded-xl2">
          <div className="aspect-[16/10] rounded-xl2 bg-black/40 grid place-items-center text-white/60">
            <span>Portal dashboard preview</span>
          </div>
        </div>
      </div>
    </section>
  );
}

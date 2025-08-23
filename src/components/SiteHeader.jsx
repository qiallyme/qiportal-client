export default function SiteHeader() {
    return (
      <header className="container py-4 flex items-center justify-between">
        <a href="/" className="font-semibold">QiAlly</a>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a href="#what-we-do">Services</a>
          <a href="#outcomes">Outcomes</a>
          <a href="#contact">Contact</a>
          <a className="btn btn-ghost" href="https://portal.qially.com/client">Login</a>
        </nav>
      </header>
    );
  }
  
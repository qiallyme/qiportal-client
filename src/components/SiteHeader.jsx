import { Link } from 'react-router-dom';

export default function SiteHeader() {
    return (
      <header className="container py-4 flex items-center justify-between">
        <Link to="/" className="font-semibold">QiAlly</Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a href="#what-we-do">Services</a>
          <a href="#outcomes">Outcomes</a>
          <a href="#contact">Contact</a>
          <Link className="btn btn-ghost" to="/login">Login</Link>
        </nav>
      </header>
    );
  }
  
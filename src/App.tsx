import { Suspense, lazy, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Logo } from './components/Logo';
import { scrollToHash } from './lib/utils';
import ErrorBoundary from './components/ErrorBoundary';

const HomePage = lazy(() => import('./pages/HomePage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));

const navItems = [
  { label: 'Advisory', href: '#advisory' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'Technology Areas', href: '#tech-areas' },
  { label: 'AI Tools', href: '#ai-tools' },
  { label: 'About', href: '#about' }
];

function App() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (location.pathname !== '/') {
      window.location.href = `/${href}`;
    } else {
      scrollToHash(href);
    }
  };

  return (
    <div className="min-h-screen bg-background text-white selection:bg-accent selection:text-background">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-2xl shadow-soft">
        <div className="mx-auto flex max-w-[1220px] items-center justify-between px-6 py-4 lg:px-10">
          <Link to="/" className="flex items-center" aria-label="Techsonic home">
            <Logo variant="dark" size="lg" className="h-12 w-auto" />
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavLinkClick(e, item.href)}
                className="text-sm font-medium text-slate-300 transition hover:text-white"
              >
                {item.label}
              </a>
            ))}
            <NavLink
              to="/contact"
              className="rounded-full border border-white/10 bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              Schedule Advisory Consultation
            </NavLink>
          </nav>

          <div className="flex items-center gap-4 md:hidden">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-background transition hover:brightness-110"
            >
              Consult
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-full border border-white/10 bg-white/5 p-2 text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        {isMobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-white/10 bg-background/90 py-4 px-6"
          >
            <div className="mx-auto flex flex-col items-stretch gap-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavLinkClick(e, item.href)}
                  className="block px-4 py-2 text-base font-medium text-slate-300 transition hover:text-white hover:bg-white/5 rounded-md"
                >
                  {item.label}
                </a>
              ))}
              <NavLink
                to="/contact"
                className="mt-2 block rounded-full border border-white/10 bg-white/10 px-5 py-2 text-center text-base font-semibold text-white transition hover:bg-white/15"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Schedule Advisory Consultation
              </NavLink>
            </div>
          </motion.nav>
        )}
      </header>

      <main className="scroll-mt-offset-nav">
        <ErrorBoundary>
          <Suspense fallback={<div className="grid min-h-screen place-items-center px-6 text-slate-300">Loading…</div>}>
            {location.pathname === '/contact' ? <ContactPage /> : <HomePage />}
          </Suspense>
        </ErrorBoundary>
      </main>

      <footer className="border-t border-white/10 bg-background/70 px-6 py-10 text-slate-400 backdrop-blur-xl sm:px-10">
        <div className="mx-auto flex max-w-[1220px] flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <Logo variant="dark" size="xl" className="h-16 shrink-0" />
            <div>
              <p className="max-w-xl text-sm leading-6 text-slate-400">
                Techsonic helps organizations evaluate, source, and optimize technology solutions. We combine independent advisory with supplier intelligence and purpose-built automation.
              </p>
            </div>
          </div>
          <div className="grid gap-3 text-sm sm:text-right">
            <a
              href="/#advisory"
              onClick={(e) => {
                e.preventDefault();
                if (location.pathname !== '/') {
                  window.location.href = '/#advisory';
                } else {
                  scrollToHash('#advisory');
                }
              }}
              className="transition hover:text-white"
            >
              Advisory
            </a>
            <a href="/contact" className="transition hover:text-white">
              Contact
            </a>
            <a href="https://www.linkedin.com/company/gotechsonic" className="transition hover:text-white">
              LinkedIn
            </a>
            <span className="text-slate-500">© 2026 Techsonic LLC</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;


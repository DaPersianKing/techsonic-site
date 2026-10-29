import { Suspense, lazy, useEffect, useState } from 'react';
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight, MessageCircle } from 'lucide-react';
import { Logo } from './components/Logo';
import ErrorBoundary from './components/ErrorBoundary';
import { routeMetadata } from './lib/metadata';
import { NavigationGroup, navigationGroups } from './components/Navigation';
const SuccessProfilesPage = lazy(() => import('./pages/SuccessProfilesPage'));
const ApplicationsPage = lazy(() => import('./pages/ApplicationsPage'));
const WorkflowAutomationPage = lazy(() => import('./pages/WorkflowAutomationPage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AdvisoryPage = lazy(() => import('./pages/AdvisoryPage'));
const DevelopmentPage = lazy(() => import('./pages/DevelopmentPage'));
const WebsitePage = lazy(() => import('./pages/WebsitePage'));
const ToolsPage = lazy(() => import('./pages/ToolsPage'));
const IntelligencePage = lazy(() => import('./pages/IntelligencePage'));
const AiAdvisor = lazy(() => import('./components/AiAdvisor'));
const links = [['Intelligence', '/intelligence']];
export default function App() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [advisorLoaded, setAdvisorLoaded] = useState(false);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        setOpen(false);
        document.querySelector<HTMLButtonElement>('.menu-toggle')?.focus();
      }
    };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [open]);
  useEffect(() => {
    setOpen(false);
    const pathname = location.pathname.replace(/\/+$/, '') || '/';
    const meta = routeMetadata[pathname] ?? {
      title: 'Page not found',
      description: 'Find your way back to Techsonic.',
    };
    document.title = `${meta.title} | Techsonic`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
    document
      .querySelector('link[rel="canonical"]')
      ?.setAttribute('href', `https://www.gotechsonic.com${pathname}`);
    for (const key of ['og:title', 'twitter:title'])
      document
        .querySelector(`meta[property="${key}"],meta[name="${key}"]`)
        ?.setAttribute('content', document.title);
    for (const key of ['og:description', 'twitter:description'])
      document
        .querySelector(`meta[property="${key}"],meta[name="${key}"]`)
        ?.setAttribute('content', meta.description);
    document
      .querySelector('meta[property="og:url"]')
      ?.setAttribute('content', `https://www.gotechsonic.com${pathname}`);
    if (location.hash)
      requestAnimationFrame(() =>
        document.getElementById(location.hash.slice(1))?.scrollIntoView()
      );
    else window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" aria-label="Techsonic home">
            <Logo variant="primary" size="xl" />
          </Link>
          <button
            className="menu-toggle"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            aria-expanded={open}
            aria-controls="main-nav"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
          <nav
            id="main-nav"
            aria-label="Main navigation"
            className={open ? 'main-nav open' : 'main-nav'}
          >
            {navigationGroups.map((group) => (
              <NavigationGroup key={group.label} {...group} />
            ))}
            {links.map(([label, path]) => (
              <NavLink key={path} to={path}>
                {label}
              </NavLink>
            ))}
            <Link className="button compact" to="/contact">
              Let’s talk <ArrowUpRight size={15} aria-hidden />
            </Link>
          </nav>
        </div>
      </header>
      <main id="main" tabIndex={-1}>
        <ErrorBoundary key={location.pathname}>
          <Suspense
            fallback={
              <div className="container section" role="status">
                Loading page…
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/advisory" element={<AdvisoryPage />} />
              <Route path="/development" element={<DevelopmentPage />} />
              <Route path="/website-development" element={<WebsitePage />} />
              <Route path="/tools" element={<ToolsPage />} />
              <Route path="/intelligence" element={<IntelligencePage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/success-profiles" element={<SuccessProfilesPage />} />
              <Route path="/applications" element={<ApplicationsPage />} />
              <Route path="/workflow-automation" element={<WorkflowAutomationPage />} />
              <Route
                path="*"
                element={
                  <div className="container section">
                    <p className="eyebrow">404</p>
                    <h1>Let’s find the right path.</h1>
                    <Link className="button" to="/">
                      Back to Techsonic
                    </Link>
                  </div>
                }
              />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <Logo variant="dark" size="xl" />
            <p>
              Clearer decisions. Better technology.
              <br />
              Measurable value.
            </p>
          </div>
          <div>
            <p className="eyebrow">Explore</p>
            {navigationGroups.map((group) => (
              <div className="footer-nav-group" key={group.label}>
                <h3>{group.label}</h3>
                {group.items.map(([name, path]) => (
                  <Link key={path} to={path}>
                    {name}
                  </Link>
                ))}
              </div>
            ))}
            {links.map(([label, path]) => (
              <Link key={path} to={path}>
                {label}
              </Link>
            ))}
          </div>
          <div>
            <p className="eyebrow">Start a conversation</p>
            <a href="mailto:hello@gotechsonic.com">hello@gotechsonic.com</a>
            <a href="tel:+14242793586">+1 424 279 3586</a>
            <a href="https://www.linkedin.com/company/gotechsonic" target="_blank" rel="noreferrer">
              LinkedIn ↗
            </a>
            <Link to="/contact">Contact Techsonic</Link>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} Techsonic LLC</span>
          <span>Advisory · Solutions · Engineering</span>
        </div>
      </footer>
      <div
        className={
          location.pathname === '/contact' || open ? 'advisor-shell suppressed' : 'advisor-shell'
        }
      >
        {advisorLoaded ? (
          <Suspense fallback={null}>
            <AiAdvisor />
          </Suspense>
        ) : (
          <button
            className="advisor-launcher"
            type="button"
            onClick={() => setAdvisorLoaded(true)}
            aria-label="Open Techsonic AI Advisor"
            aria-controls="advisor-panel"
            aria-expanded="false"
          >
            <MessageCircle size={21} aria-hidden />
            <span>AI Advisor</span>
          </button>
        )}
      </div>
    </>
  );
}

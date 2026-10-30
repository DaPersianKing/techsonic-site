import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Link, useLocation } from 'react-router-dom';
import { AnalyticsClient, type AnalyticsEvent } from '../../src/lib/analytics';
import { AnalyticsConsent } from '../../src/components/AnalyticsConsent';
import '../../src/index.css';

// This fixture is served only by Vite dev, never included in the production build.
// The real client's tag loader is replaced before any element enters the DOM.
const client = new AnalyticsClient(
  { enabled: true, allowNonProduction: true, debug: true },
  window,
  () => window.location.assign('/tests/browser/analytics.html'),
  (script) => {
    script.src = '/tests/browser/ga4-stub.js';
    document.head.appendChild(script);
  }
);
const examples: AnalyticsEvent[] = [
  { name: 'contact_form_start' },
  { name: 'generate_lead' },
  { name: 'ai_advisor_open' },
  { name: 'tool_use', tool: 'sla-credit' },
  { name: 'service_cta_click', service: 'advisory' },
];
function Harness() {
  const location = useLocation();
  const [audit, setAudit] = useState('');
  useEffect(() => {
    const timer = window.setInterval(() => {
      const queue = (window as unknown as { dataLayer?: ArrayLike<unknown>[] }).dataLayer ?? [];
      setAudit(
        JSON.stringify(
          {
            path: location.pathname,
            choice: client.snapshot().choice,
            commands: queue.map((record) => Array.from(record)),
            resourceOrigins: [
              ...new Set(
                performance.getEntriesByType('resource').map((entry) => new URL(entry.name).origin)
              ),
            ],
          },
          null,
          2
        )
      );
    }, 100);
    return () => clearInterval(timer);
  }, [location.pathname]);
  return (
    <>
      <main className="container section">
        <h1>Analytics browser tests — Google transport mocked</h1>
        <p>
          No requests are sent to Google. Use a clean local browser profile or Reject to reset this
          fixture’s consent.
        </p>
        <div className="actions">
          <Link to="/advisory?email=private-test#private">Advisory test route</Link>
          <Link to="/contact?category=Custom%20Engineering&email=private-test">
            Contact test route
          </Link>
          <Link to="/contact?email=other-private#main">Contact query change</Link>
          <Link to="/tools#sla">Tools test route</Link>
        </div>
        <div className="actions">
          {examples.map((event) => (
            <button
              key={event.name}
              className="button secondary"
              onClick={() => client.track(event)}
            >
              Emit {event.name}
            </button>
          ))}
        </div>
        <pre
          aria-label="Analytics audit"
          style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}
        >
          {audit}
        </pre>
      </main>
      <AnalyticsConsent client={client} />
    </>
  );
}
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Harness />
    </BrowserRouter>
  </StrictMode>
);

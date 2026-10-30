import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getAnalytics, type AnalyticsClient, type AnalyticsSnapshot } from '../lib/analytics';

const initialSnapshot: AnalyticsSnapshot = {
  choice: 'unknown',
  available: false,
  storageAvailable: true,
  failed: false,
};

export function AnalyticsConsent({ client: suppliedClient }: { client?: AnalyticsClient }) {
  const location = useLocation();
  const initialPath = useRef(location.pathname);
  const client = useRef<AnalyticsClient | undefined>(undefined);
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(false);
  const [message, setMessage] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const analytics = suppliedClient ?? getAnalytics();
    client.current = analytics;
    if (!analytics) return;
    const refresh = () => setSnapshot(analytics.snapshot());
    const unsubscribe = analytics.subscribe(refresh);
    const inquiryClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const anchor = event.target.closest('a[href]');
      if (!anchor) return;
      const url = new URL(anchor.getAttribute('href')!, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== '/contact') return;
      const categories = {
        'Technology Advisory': 'advisory',
        'Website Development': 'websites',
        'Custom Engineering': 'engineering',
      } as const;
      const category = url.searchParams.get('category') ?? '';
      const service = categories[category as keyof typeof categories] ?? 'general';
      analytics.track({ name: 'service_cta_click', service });
    };
    document.addEventListener('click', inquiryClick, true);
    analytics.initialize(initialPath.current);
    refresh();
    setReady(true);
    return () => {
      unsubscribe();
      document.removeEventListener('click', inquiryClick, true);
    };
  }, [suppliedClient]);

  useEffect(() => {
    client.current?.viewPage(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) element.showModal();
    else if (!open && element.open) element.close();
  }, [open]);

  function manage(button: HTMLButtonElement) {
    trigger.current = button;
    setDraft(snapshot.choice === 'granted');
    setOpen(true);
  }

  function choose(allow: boolean) {
    client.current?.choose(allow ? 'granted' : 'rejected');
    setMessage(allow ? 'Analytics preference saved.' : 'Optional analytics rejected.');
    setOpen(false);
  }

  return (
    <>
      <div className="container privacy-disclosure">
        <details id="privacy">
          <summary>Privacy &amp; analytics</summary>
          <p>
            Optional Google Analytics 4 helps Techsonic understand page visits and use of service
            links, planning tools, the AI Advisor launcher, and the inquiry form. It loads only when
            analytics is enabled for this site and you accept. Rejecting does not limit site
            features. When accepted, Google may use analytics cookies and process technical
            connection, browser, device and usage data. Advertising signals remain disabled.
          </p>
          <p>
            We send canonical page addresses and fixed event categories, without URL queries, form
            entries, calculator inputs/results, or AI conversation text. Contact inquiries still use
            Cloudflare, Turnstile and Brevo for their stated purposes; analytics consent is separate
            from inquiry consent. Your analytics choice is stored in this browser for up to 180
            days. You can withdraw it below; this removes this integration’s analytics cookies and
            reloads the page. Previously sent data cannot be recalled by changing this preference.
          </p>
          <p>
            Google processes analytics data under its{' '}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">
              privacy policy
            </a>
            . Contact <a href="mailto:hello@gotechsonic.com">hello@gotechsonic.com</a> with privacy
            questions.
          </p>
        </details>
        <button
          className="text-link"
          type="button"
          onClick={(event) => manage(event.currentTarget)}
        >
          Manage preferences
        </button>
        <p role="status" className="fine-print">
          {message}
        </p>
        {!snapshot.storageAvailable && (
          <p role="status" className="fine-print">
            Your browser could not save preferences. Your choice applies to this visit only.
          </p>
        )}
        {snapshot.failed && (
          <p role="status" className="fine-print">
            Optional analytics could not load. Site features remain available.
          </p>
        )}
      </div>
      {ready && snapshot.available && snapshot.choice === 'unknown' && (
        <section className="consent-banner" aria-label="Analytics choices">
          <div>
            <h2>Your analytics choice</h2>
            <p>
              May we use optional Google Analytics to understand site usage? No analytics loads
              until you accept. Rejecting keeps all features available.
            </p>
            <a href="#privacy">Privacy &amp; analytics details</a>
          </div>
          <div className="consent-actions">
            <button className="button secondary" type="button" onClick={() => choose(true)}>
              Accept
            </button>
            <button className="button secondary" type="button" onClick={() => choose(false)}>
              Reject
            </button>
            <button
              className="text-link"
              type="button"
              onClick={(event) => manage(event.currentTarget)}
            >
              Manage preferences
            </button>
          </div>
        </section>
      )}
      <dialog
        ref={dialog}
        className="consent-dialog"
        aria-labelledby="consent-title"
        aria-describedby="consent-description"
        onCancel={() => setOpen(false)}
        onClose={() => {
          setOpen(false);
          trigger.current?.focus();
        }}
      >
        <h2 id="consent-title">Analytics preferences</h2>
        <p id="consent-description">
          Analytics is optional. Accept or reject it below; the site works either way. Closing this
          window does not grant consent.
        </p>
        {ready && !snapshot.available && (
          <p className="status-message">
            Analytics is currently disabled for this site. Your preference does not activate
            tracking.
          </p>
        )}
        <label className="analytics-toggle">
          <input
            type="checkbox"
            checked={draft}
            onChange={(event) => setDraft(event.target.checked)}
          />
          Allow optional Google Analytics when enabled
        </label>
        <p>
          We measure page visits and fixed activity categories. We do not send your form entries,
          calculator values, or AI conversations.
        </p>
        {!snapshot.storageAvailable && (
          <p role="status">
            Your browser could not save preferences. Your choice applies to this visit only.
          </p>
        )}
        {snapshot.failed && (
          <p role="status">
            Analytics could not load. Your choice is saved; site features remain available. Reload
            to try again if you wish.
          </p>
        )}
        <div className="consent-actions">
          <button className="button secondary" type="button" onClick={() => choose(true)}>
            Accept
          </button>
          <button className="button secondary" type="button" onClick={() => choose(false)}>
            Reject
          </button>
          <button className="button" type="button" onClick={() => choose(draft)}>
            Save preferences
          </button>
          <button className="text-link" type="button" onClick={() => setOpen(false)}>
            Close
          </button>
        </div>
      </dialog>
    </>
  );
}

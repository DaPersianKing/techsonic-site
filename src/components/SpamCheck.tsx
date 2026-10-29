import { useEffect, useRef, useState } from 'react';
type Turnstile = {
  render: (
    element: HTMLElement,
    options: {
      sitekey: string;
      action: string;
      callback: (token: string) => void;
      'expired-callback': () => void;
      'error-callback': () => void;
    }
  ) => string;
  remove: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}
let scriptReady: Promise<void> | undefined;
function loadScript() {
  if (window.turnstile) return Promise.resolve();
  if (!scriptReady)
    scriptReady = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      const timeout = window.setTimeout(() => {
        script.remove();
        scriptReady = undefined;
        reject(new Error('Spam check timed out. Reload the page or email us.'));
      }, 12000);
      script.onload = () => {
        clearTimeout(timeout);
        resolve();
      };
      script.onerror = () => {
        clearTimeout(timeout);
        script.remove();
        scriptReady = undefined;
        reject(new Error('Spam check could not load. Reload the page or email us.'));
      };
      document.head.appendChild(script);
    });
  return scriptReady;
}
export function SpamCheck({
  onToken,
  resetKey,
}: {
  onToken: (token: string) => void;
  resetKey: number;
}) {
  const element = useRef<HTMLDivElement>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    let widget: string | undefined;
    const abort = new AbortController();
    const timeout = setTimeout(() => abort.abort(), 12000);
    setError('');
    void (async () => {
      try {
        const response = await fetch('/api/config', { signal: abort.signal });
        if (!response.ok)
          throw new Error(
            'Online inquiries are temporarily unavailable. Email hello@gotechsonic.com.'
          );
        const data = (await response.json()) as { turnstileSiteKey?: string };
        if (!data.turnstileSiteKey)
          throw new Error('Online inquiries are not configured yet. Email hello@gotechsonic.com.');
        await loadScript();
        if (!cancelled && element.current && window.turnstile)
          widget = window.turnstile.render(element.current, {
            sitekey: data.turnstileSiteKey,
            action: 'contact',
            callback: onToken,
            'expired-callback': () => onToken(''),
            'error-callback': () => {
              onToken('');
              setError('Spam verification failed. Reload the page to retry.');
            },
          });
      } catch (e) {
        if (!cancelled)
          setError(
            (e as Error).name === 'AbortError'
              ? 'Spam check timed out. Reload to retry or email us.'
              : (e as Error).message
          );
      } finally {
        clearTimeout(timeout);
      }
    })();
    return () => {
      cancelled = true;
      clearTimeout(timeout);
      abort.abort();
      if (widget && window.turnstile) window.turnstile.remove(widget);
    };
  }, [onToken, resetKey]);
  return (
    <div>
      <div ref={element} />
      {error && (
        <p role="alert" className="error-message">
          {error}
        </p>
      )}
    </div>
  );
}

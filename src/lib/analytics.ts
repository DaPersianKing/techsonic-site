import { canonicalUrl, productionOrigin } from './seo';
import { routeMetadata } from './metadata';
import {
  ga4MeasurementId,
  consentStorageKey,
  consentLifetimeMs,
  toolIds,
  serviceCategories,
  type ToolId,
  type ServiceCategory,
} from './analytics-policy';

export type ConsentChoice = 'unknown' | 'granted' | 'rejected';
export type AnalyticsEvent =
  | { name: 'contact_form_start' | 'generate_lead' | 'ai_advisor_open' }
  | { name: 'tool_use'; tool: ToolId }
  | { name: 'service_cta_click'; service: ServiceCategory };
export interface AnalyticsConfig {
  enabled: boolean;
  allowNonProduction: boolean;
  debug: boolean;
}
type Gtag = (...args: unknown[]) => void;
type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: Gtag;
  'ga-disable-G-3SSEPPT5TK'?: boolean;
};
export interface AnalyticsSnapshot {
  choice: ConsentChoice;
  available: boolean;
  storageAvailable: boolean;
  failed: boolean;
}

/** Browser-only basic consent mode. No browser storage or external scripts run at module load. */
export class AnalyticsClient {
  private choice: ConsentChoice = 'unknown';
  private expires = 0;
  private initialized = false;
  private storageAvailable = true;
  private failed = false;
  private script?: HTMLScriptElement;
  private timer?: number;
  private currentPath = '/';
  private lastPage?: string;
  private previousPage = '';
  private currentReferrer = '';
  private engagement = new Set<string>();
  private listeners = new Set<() => void>();
  private browser: AnalyticsWindow;
  private onStorage?: (event: StorageEvent) => void;

  constructor(
    private config: AnalyticsConfig,
    browser: Window,
    private reload = () => browser.location.reload(),
    private appendTag = (script: HTMLScriptElement) => {
      browser.document.head.appendChild(script);
    }
  ) {
    this.browser = browser as AnalyticsWindow;
  }

  canRun(): boolean {
    return (
      this.config.enabled &&
      (this.browser.location.origin === productionOrigin || this.config.allowNonProduction)
    );
  }

  snapshot(): AnalyticsSnapshot {
    return {
      choice: this.choice,
      available: this.canRun(),
      storageAvailable: this.storageAvailable,
      failed: this.failed,
    };
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    for (const listener of this.listeners) listener();
  }

  private readChoice(): ConsentChoice {
    let raw: string | null;
    try {
      raw = this.browser.localStorage.getItem(consentStorageKey);
    } catch {
      this.storageAvailable = false;
      return 'unknown';
    }
    if (!raw) return 'unknown';
    try {
      const saved: unknown = JSON.parse(raw);
      if (!saved || typeof saved !== 'object') return 'unknown';
      const record = saved as Record<string, unknown>;
      if (
        record.version !== 1 ||
        typeof record.expires !== 'number' ||
        record.expires <= Date.now() ||
        record.expires > Date.now() + consentLifetimeMs ||
        !['granted', 'rejected'].includes(String(record.choice))
      )
        return 'unknown';
      this.expires = record.expires;
      return record.choice as ConsentChoice;
    } catch {
      return 'unknown';
    }
  }

  initialize(path = this.browser.location.pathname) {
    if (this.initialized) return;
    this.initialized = true;
    this.currentPath = path;
    this.choice = this.readChoice();
    this.onStorage = (event) => {
      if (event.key !== consentStorageKey && event.key !== null) return;
      const wasActive = Boolean(this.script);
      this.choice = this.readChoice();
      if (this.choice !== 'granted') {
        this.stop();
        if (wasActive) this.reload();
      } else this.viewPage(this.currentPath);
      this.notify();
    };
    this.browser.addEventListener('storage', this.onStorage);
    this.viewPage(this.currentPath);
    this.notify();
  }

  dispose() {
    if (this.onStorage) this.browser.removeEventListener('storage', this.onStorage);
    this.stop();
    this.listeners.clear();
  }

  choose(choice: Exclude<ConsentChoice, 'unknown'>) {
    const wasActive = Boolean(this.script);
    this.choice = choice;
    this.expires = Date.now() + consentLifetimeMs;
    try {
      this.browser.localStorage.setItem(
        consentStorageKey,
        JSON.stringify({ version: 1, choice, expires: this.expires })
      );
      this.storageAvailable = true;
    } catch {
      this.storageAvailable = false;
    }
    if (choice === 'granted') this.viewPage(this.currentPath);
    else this.stop();
    this.notify();
    // Removing a script does not unload its listeners. Reload into an untracked document.
    if (choice === 'rejected' && wasActive) this.reload();
  }

  private permitted(): boolean {
    return (
      this.initialized && this.canRun() && this.choice === 'granted' && this.expires > Date.now()
    );
  }

  private stop() {
    this.browser['ga-disable-G-3SSEPPT5TK'] = true;
    if (this.timer) this.browser.clearTimeout(this.timer);
    this.script?.remove();
    this.script = undefined;
    if (this.browser.dataLayer) this.browser.dataLayer.length = 0;
    this.lastPage = undefined;
    this.previousPage = '';
    this.currentReferrer = '';
    this.engagement.clear();
    // Expire only GA4 cookies owned by this integration, including historical parent-domain copies.
    const domains = ['', this.browser.location.hostname, 'gotechsonic.com'];
    try {
      for (const cookie of this.browser.document.cookie.split(';')) {
        const name = cookie.split('=')[0].trim();
        if (name !== '_ga' && name !== `_ga_${ga4MeasurementId.slice(2)}`) continue;
        for (const domain of domains)
          this.browser.document.cookie = `${name}=; Max-Age=0; Path=/;${domain ? ` Domain=${domain};` : ''} SameSite=Lax`;
      }
    } catch {
      /* Cookie access may be blocked; the disable flag and reload still apply. */
    }
  }

  private pageFields(path: string) {
    return {
      page_location: canonicalUrl(path),
      page_title: `${routeMetadata[path].title} | Techsonic`,
      page_referrer: this.currentReferrer,
      ...(this.config.debug ? { debug_mode: true } : {}),
    };
  }

  private start(path: string) {
    if (this.script || this.failed || !this.permitted()) return;
    this.browser['ga-disable-G-3SSEPPT5TK'] = false;
    const dataLayer: unknown[] = [];
    this.browser.dataLayer = dataLayer;
    // Preserve the vendor's documented Arguments queue format.
    this.browser.gtag = function () {
      // eslint-disable-next-line prefer-rest-params
      dataLayer.push(arguments);
    };
    const gtag = this.browser.gtag;
    const denied = {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    };
    gtag('consent', 'default', denied);
    gtag('consent', 'update', { ...denied, analytics_storage: 'granted' });
    gtag('js', new Date());
    gtag('config', ga4MeasurementId, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_domain: this.browser.location.hostname,
      cookie_expires: consentLifetimeMs / 1000,
      cookie_update: false,
      cookie_flags: 'SameSite=Lax;Secure',
      ...this.pageFields(path),
    });
    const script = this.browser.document.createElement('script');
    script.id = 'techsonic-ga4';
    script.async = true;
    script.referrerPolicy = 'no-referrer';
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ga4MeasurementId}`;
    const fail = () => {
      this.failed = true;
      this.stop();
      this.notify();
    };
    script.onerror = fail;
    script.onload = () => {
      if (this.timer) this.browser.clearTimeout(this.timer);
    };
    this.timer = this.browser.setTimeout(fail, 12_000);
    this.script = script;
    try {
      this.appendTag(script);
    } catch {
      fail();
    }
  }

  private command(...args: unknown[]): boolean {
    try {
      this.browser.gtag?.(...args);
      return true;
    } catch {
      this.failed = true;
      this.stop();
      this.notify();
      return false;
    }
  }

  viewPage(input: string) {
    const path = new URL(canonicalUrl(input)).pathname;
    this.currentPath = path;
    if (!routeMetadata[path] || !this.permitted()) return;
    this.start(path);
    if (!this.script || this.lastPage === path) return;
    this.currentReferrer = this.previousPage;
    this.engagement.clear();
    if (!this.command('set', this.pageFields(path))) return;
    if (!this.command('event', 'page_view', this.pageFields(path))) return;
    this.previousPage = canonicalUrl(path);
    this.lastPage = path;
  }

  track(event: AnalyticsEvent): boolean {
    if (!this.permitted() || !this.script || !routeMetadata[this.currentPath]) return false;
    const fields: Record<string, string> = {};
    switch (event.name) {
      case 'tool_use':
        if (!toolIds.includes(event.tool)) return false;
        fields.tool_id = event.tool;
        break;
      case 'service_cta_click':
        if (!serviceCategories.includes(event.service)) return false;
        fields.service_category = event.service;
        break;
      case 'contact_form_start':
      case 'generate_lead':
      case 'ai_advisor_open':
        break;
      default:
        return false;
    }
    const onceKey = event.name === 'tool_use' ? `tool:${fields.tool_id}` : event.name;
    if (
      (event.name === 'tool_use' || event.name === 'contact_form_start') &&
      this.engagement.has(onceKey)
    )
      return false;
    this.engagement.add(onceKey);
    return this.command('event', event.name, { ...this.pageFields(this.currentPath), ...fields });
  }
}

let client: AnalyticsClient | undefined;
export function getAnalytics(): AnalyticsClient | undefined {
  if (typeof window === 'undefined') return undefined;
  return (client ??= new AnalyticsClient(
    {
      enabled: import.meta.env.VITE_GA4_ENABLED === 'true',
      allowNonProduction: import.meta.env.VITE_GA4_ALLOW_NON_PRODUCTION === 'true',
      debug: import.meta.env.VITE_GA4_DEBUG === 'true',
    },
    window
  ));
}
export function trackAnalytics(event: AnalyticsEvent): boolean {
  try {
    return getAnalytics()?.track(event) ?? false;
  } catch {
    return false;
  }
}

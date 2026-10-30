import { afterEach, describe, expect, it, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import { readFileSync } from 'node:fs';
import { AnalyticsClient, type AnalyticsConfig, type AnalyticsEvent } from '../src/lib/analytics';
import { analyticsCsp, consentStorageKey, ga4MeasurementId } from '../src/lib/analytics-policy';

let dom: JSDOM;
let client: AnalyticsClient;
const reload = vi.fn();
function setup(
  url = 'https://www.gotechsonic.com/contact?email=private@example.com',
  config: Partial<AnalyticsConfig> = {}
) {
  dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', { url });
  client = new AnalyticsClient(
    { enabled: true, allowNonProduction: false, debug: false, ...config },
    dom.window as unknown as Window,
    reload
  );
  return dom.window;
}
function commands(): unknown[][] {
  const records = (dom.window as unknown as { dataLayer?: ArrayLike<unknown>[] }).dataLayer ?? [];
  return records.map((record) => Array.from(record));
}
function events(name?: string) {
  return commands().filter((command) => command[0] === 'event' && (!name || command[1] === name));
}
afterEach(() => {
  client?.dispose();
  dom?.window.close();
  client = undefined!;
  dom = undefined!;
  vi.restoreAllMocks();
  vi.useRealTimers();
  reload.mockClear();
});

describe('consent-gated Google Analytics', () => {
  it('creates no tag, queue, events or cookies before consent or after initial rejection', () => {
    const browser = setup();
    client.initialize();
    client.track({ name: 'generate_lead' });
    expect(browser.document.querySelector('script')).toBeNull();
    expect('dataLayer' in browser).toBe(false);
    expect(browser.document.cookie).toBe('');
    client.choose('rejected');
    expect(browser.document.querySelector('script')).toBeNull();
    expect(commands()).toEqual([]);
    expect(JSON.parse(browser.localStorage.getItem(consentStorageKey)!).choice).toBe('rejected');
    expect(reload).not.toHaveBeenCalled();
  });

  it.each([
    ['https://www.gotechsonic.com/', false, false],
    ['https://gotechsonic.com/', true, false],
    ['http://www.gotechsonic.com/', true, false],
    ['https://preview.workers.dev/', true, false],
    ['http://localhost:4173/', true, false],
    ['http://localhost:4173/', true, true],
  ])(
    'requires the release flag and exact production origin unless explicitly overridden: %s %s %s',
    (url, enabled, allowNonProduction) => {
      const browser = setup(url, { enabled, allowNonProduction });
      client.initialize();
      client.choose('granted');
      expect(Boolean(browser.document.querySelector('script'))).toBe(
        enabled && (url === 'https://www.gotechsonic.com/' || allowNonProduction)
      );
    }
  );

  it('uses Consent Mode v2 defaults, disables auto page views and sends only safe SPA locations', () => {
    const browser = setup();
    client.initialize();
    client.choose('granted');
    const script = browser.document.querySelector('script')!;
    expect(script.src).toBe(`https://www.googletagmanager.com/gtag/js?id=${ga4MeasurementId}`);
    expect(script.referrerPolicy).toBe('no-referrer');
    expect(commands()[0]).toEqual([
      'consent',
      'default',
      {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      },
    ]);
    expect(commands()[1]).toEqual([
      'consent',
      'update',
      {
        analytics_storage: 'granted',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      },
    ]);
    expect(commands().find((command) => command[0] === 'config')?.[2]).toMatchObject({
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
    client.initialize();
    client.viewPage('/contact?name=private#secret');
    client.viewPage('/contact/');
    client.viewPage('/tools#sla');
    client.viewPage('/tools?private=secret');
    client.viewPage('/contact');
    client.viewPage('/missing-private-route');
    expect(
      events('page_view').map((event) => (event[2] as { page_location: string }).page_location)
    ).toEqual([
      'https://www.gotechsonic.com/contact',
      'https://www.gotechsonic.com/tools',
      'https://www.gotechsonic.com/contact',
    ]);
    expect((events('page_view')[1][2] as { page_referrer: string }).page_referrer).toBe(
      'https://www.gotechsonic.com/contact'
    );
    expect(browser.document.querySelectorAll('script')).toHaveLength(1);
    expect(JSON.stringify(commands())).not.toMatch(/private|secret|example\.com/);
  });

  it('allowlists payloads and deduplicates tool/form starts per page visit without replaying pre-consent events', () => {
    setup();
    client.initialize();
    client.track({ name: 'ai_advisor_open' });
    client.choose('granted');
    expect(events('ai_advisor_open')).toEqual([]);
    client.track({ name: 'contact_form_start' });
    client.track({ name: 'contact_form_start' });
    client.track({ name: 'generate_lead' });
    client.track({ name: 'ai_advisor_open' });
    client.track({ name: 'tool_use', tool: 'sla-credit' });
    client.track({ name: 'tool_use', tool: 'sla-credit' });
    client.track({ name: 'service_cta_click', service: 'advisory' });
    client.track({ name: 'tool_use', tool: 'private-input' } as unknown as AnalyticsEvent);
    client.track({
      name: 'service_cta_click',
      service: 'private-input',
    } as unknown as AnalyticsEvent);
    client.track({
      name: 'generate_lead',
      email: 'private@example.com',
      message: 'secret',
    } as AnalyticsEvent);
    expect(events('contact_form_start')).toHaveLength(1);
    expect(events('tool_use')).toHaveLength(1);
    expect(events('service_cta_click')[0][2]).toMatchObject({ service_category: 'advisory' });
    expect(events('generate_lead')).toHaveLength(2);
    expect(JSON.stringify(commands())).not.toMatch(/private|secret|example\.com/);
    client.viewPage('/tools');
    client.track({ name: 'tool_use', tool: 'sla-credit' });
    expect(events('tool_use')).toHaveLength(2);
  });

  it('withdraws immediately, removes only its GA cookies, persists refusal and reloads', () => {
    const browser = setup();
    client.initialize();
    client.choose('granted');
    browser.document.cookie = '_ga=test; Path=/';
    browser.document.cookie = '_ga_3SSEPPT5TK=test; Path=/';
    browser.document.cookie = 'unrelated=keep; Path=/';
    client.choose('rejected');
    expect(browser.document.querySelector('script')).toBeNull();
    expect((browser as unknown as Record<string, unknown>)[`ga-disable-${ga4MeasurementId}`]).toBe(
      true
    );
    expect(browser.document.cookie).toBe('unrelated=keep');
    expect(commands()).toEqual([]);
    expect(client.track({ name: 'generate_lead' })).toBe(false);
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('honors persisted rejection, expired/malformed records and unavailable storage safely', () => {
    const browser = setup();
    browser.localStorage.setItem(
      consentStorageKey,
      JSON.stringify({ version: 1, choice: 'granted', expires: Date.now() - 1 })
    );
    client.initialize();
    expect(client.snapshot().choice).toBe('unknown');
    expect(browser.document.querySelector('script')).toBeNull();
    vi.spyOn(browser, 'localStorage', 'get').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(() => client.choose('rejected')).not.toThrow();
    expect(client.snapshot().storageAvailable).toBe(false);
  });

  it('restores a valid grant without duplicate initialization and stops when another tab rejects', () => {
    const browser = setup();
    browser.localStorage.setItem(
      consentStorageKey,
      JSON.stringify({ version: 1, choice: 'granted', expires: Date.now() + 100_000 })
    );
    client.initialize();
    client.initialize();
    expect(events('page_view')).toHaveLength(1);
    browser.localStorage.setItem(
      consentStorageKey,
      JSON.stringify({ version: 1, choice: 'rejected', expires: Date.now() + 100_000 })
    );
    browser.dispatchEvent(new browser.StorageEvent('storage', { key: consentStorageKey }));
    expect(browser.document.querySelector('script')).toBeNull();
    expect(client.snapshot().choice).toBe('rejected');
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('fails closed on a blocked tag and never throws from event transport', () => {
    const browser = setup();
    client.initialize();
    client.choose('granted');
    browser.document.querySelector('script')!.dispatchEvent(new browser.Event('error'));
    expect(client.snapshot().failed).toBe(true);
    expect(client.track({ name: 'generate_lead' })).toBe(false);
    expect(browser.document.querySelector('script')).toBeNull();
  });

  it.each(['{broken', 'null', '{"version":2,"choice":"granted","expires":9999999999999}'])(
    'treats malformed or unsupported consent as unknown: %s',
    (record) => {
      const browser = setup();
      browser.localStorage.setItem(consentStorageKey, record);
      client.initialize();
      expect(client.snapshot().choice).toBe('unknown');
      expect(browser.document.querySelector('script')).toBeNull();
    }
  );

  it('handles a tag timeout without impacting application actions', () => {
    vi.useFakeTimers();
    setup();
    client.initialize();
    client.choose('granted');
    vi.advanceTimersByTime(12_001);
    expect(client.snapshot().failed).toBe(true);
    expect(client.track({ name: 'generate_lead' })).toBe(false);
  });

  it('contains an unexpected Google command failure', () => {
    const browser = setup();
    client.initialize();
    client.choose('granted');
    (browser as unknown as { gtag: () => void }).gtag = () => {
      throw new Error('transport failed');
    };
    expect(() => client.track({ name: 'generate_lead' })).not.toThrow();
    expect(client.snapshot().failed).toBe(true);
    expect(browser.document.querySelector('script')).toBeNull();
  });

  it('adds only opt-in GA4 hosts to CSP and preserves existing script restrictions', () => {
    const original = readFileSync('public/_headers', 'utf8');
    expect(analyticsCsp(original, false)).toBe(original);
    const policy = analyticsCsp(original, true);
    expect(policy).toContain(
      "script-src 'self' https://www.googletagmanager.com https://challenges.cloudflare.com 'sha256-WILL_BE_SET_AT_BUILD'"
    );
    expect(policy).toContain(
      "connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://region1.google-analytics.com https://challenges.cloudflare.com"
    );
    expect(policy).not.toMatch(
      /unsafe-eval|script-src[^;]*unsafe-inline|\*\.google|doubleclick|googleadservices/
    );
    expect(policy).toContain(
      "frame-src https://challenges.cloudflare.com; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'"
    );
  });
});

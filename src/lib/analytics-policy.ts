export const ga4MeasurementId = 'G-3SSEPPT5TK';
export const consentStorageKey = 'techsonic.analytics-consent.v1';
export const consentLifetimeMs = 180 * 24 * 60 * 60 * 1000;

export const toolIds = ['contract-controls', 'sla-credit', 'bandwidth', 'cost-comparison'] as const;
export type ToolId = (typeof toolIds)[number];
export const serviceCategories = ['advisory', 'websites', 'engineering', 'general'] as const;
export type ServiceCategory = (typeof serviceCategories)[number];

/** Keep Turnstile and JSON-LD protections; permit only the three GA4 transport hosts. */
export function analyticsCsp(headers: string, enabled: boolean): string {
  if (!enabled) return headers;
  return headers
    .replace("script-src 'self'", "script-src 'self' https://www.googletagmanager.com")
    .replace(
      "connect-src 'self'",
      "connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://region1.google-analytics.com"
    )
    .replace(
      "img-src 'self' data:",
      "img-src 'self' data: https://www.googletagmanager.com https://www.google-analytics.com https://region1.google-analytics.com"
    );
}

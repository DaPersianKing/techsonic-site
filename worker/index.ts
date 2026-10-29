import { contactSchema } from '../src/lib/contact';
import { refreshNews, type BriefStore } from './news';
import type { NewsBrief } from '../src/lib/news';
import { handleAdvisor } from './advisor';
export interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  INTELLIGENCE?: BriefStore;
  CONTACT_LIMITER?: { limit(options: { key: string }): Promise<{ success: boolean }> };
  BREVO_API_KEY?: string;
  BREVO_SENDER?: string;
  CONTACT_TO?: string;
  TURNSTILE_SECRET?: string;
  TURNSTILE_SITE_KEY?: string;
  SITE_ORIGIN?: string;
  AI_PROVIDER_KEY?: string;
  AI_MODEL?: string;
  AI_PROVIDER?: string;
  AI_MAX_OUTPUT_TOKENS?: string;
  CHAT_LIMITER?: { limit(options: { key: string }): Promise<{ success: boolean }> };
}
const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...headers },
  });
async function contact(request: Request, env: Env, fetcher: typeof fetch) {
  if (request.method !== 'POST')
    return json({ error: 'Method not allowed.' }, 405, { Allow: 'POST' });
  const origin = env.SITE_ORIGIN;
  if (!origin || request.headers.get('Origin') !== origin)
    return json({ error: 'This request origin is not permitted.' }, 403);
  if (!request.headers.get('Content-Type')?.startsWith('application/json'))
    return json({ error: 'Expected JSON.' }, 415);
  if (
    !env.BREVO_API_KEY ||
    !env.BREVO_SENDER ||
    !env.CONTACT_TO ||
    !env.TURNSTILE_SECRET ||
    !env.CONTACT_LIMITER
  )
    return json(
      { error: 'Online inquiries are temporarily unavailable. Email hello@gotechsonic.com.' },
      503
    );
  if (
    !/^[^\s@]+@gotechsonic\.com$/i.test(env.BREVO_SENDER) ||
    !/^[^\s@]+@gotechsonic\.com$/i.test(env.CONTACT_TO)
  )
    return json({ error: 'Online inquiries are temporarily unavailable. Please email us.' }, 503);
  const ip = request.headers.get('CF-Connecting-IP');
  if (!ip) return json({ error: 'Request verification unavailable.' }, 503);
  const rate = await env.CONTACT_LIMITER.limit({ key: ip });
  if (!rate.success)
    return json({ error: 'Too many requests. Please wait a minute before trying again.' }, 429, {
      'Retry-After': '60',
    });
  const length = Number(request.headers.get('Content-Length') ?? 0);
  if (length > 24000) return json({ error: 'Request is too large.' }, 413);
  const reader = request.body?.getReader();
  if (!reader) return json({ error: 'Request body is required.' }, 400);
  const chunks: Uint8Array[] = [];
  let size = 0;
  let reading = true;
  while (reading) {
    const { value, done } = await reader.read();
    if (done) {
      reading = false;
      continue;
    }
    size += value.byteLength;
    if (size > 24000) {
      await reader.cancel();
      return json({ error: 'Request is too large.' }, 413);
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  let body: unknown;
  try {
    body = JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return json({ error: 'Invalid request body.' }, 400);
  }
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return json({ error: parsed.error.issues[0].message }, 400);
  if (parsed.data.website) return json({ error: 'Request could not be verified.' }, 400);
  const data = parsed.data;
  const verification = await fetcher('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: data.token, remoteip: ip }),
    signal: AbortSignal.timeout(8000),
  });
  if (!verification.ok) return json({ error: 'Spam verification unavailable. Please retry.' }, 503);
  const check = (await verification.json()) as {
    success?: boolean;
    hostname?: string;
    action?: string;
  };
  if (!check.success || check.hostname !== new URL(origin).hostname || check.action !== 'contact')
    return json({ error: 'Spam verification failed or expired. Please retry.' }, 400);
  // Plain text and a fixed subject prevent user HTML or header injection.
  const delivery = await fetcher('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': env.BREVO_API_KEY,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'Techsonic Website', email: env.BREVO_SENDER },
      to: [{ email: env.CONTACT_TO }],
      replyTo: { email: data.email, name: data.name },
      subject: `Website inquiry: ${data.category}`,
      textContent: `Category: ${data.category}\nName: ${data.name}\nEmail: ${data.email}\nCompany: ${data.company}\nConsent: contact about this inquiry\n\n${data.message}`,
    }),
    signal: AbortSignal.timeout(10000),
  });
  const receipt = (await delivery.json().catch(() => null)) as { messageId?: string } | null;
  if (!delivery.ok || !receipt?.messageId)
    return json(
      {
        error: 'The email service did not accept the request. Please email hello@gotechsonic.com.',
      },
      502
    );
  return json({ accepted: true }, 202);
}
export async function handleRequest(
  request: Request,
  env: Env,
  fetcher: typeof fetch = fetch
): Promise<Response> {
  const url = new URL(request.url);
  try {
    if (url.pathname === '/api/chat') return await handleAdvisor(request, env, fetcher);
    if (url.pathname === '/api/contact') return await contact(request, env, fetcher);
    if (url.pathname.startsWith('/api/')) {
      if (request.method !== 'GET')
        return json({ error: 'Method not allowed.' }, 405, { Allow: 'GET' });
      if (url.pathname === '/api/config')
        return json({ turnstileSiteKey: env.TURNSTILE_SITE_KEY ?? null });
      if (url.pathname === '/api/news') {
        if (!env.INTELLIGENCE) return json({ error: 'News storage is not configured.' }, 503);
        const raw = await env.INTELLIGENCE.get('brief');
        if (!raw) return json({ updated: null, articles: [], stale: false });
        const brief = JSON.parse(raw) as NewsBrief;
        return json(
          {
            ...brief,
            stale: !brief.updated || Date.now() - Date.parse(brief.updated) > 8 * 86400000,
          },
          200,
          { 'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600' }
        );
      }
      return json({ error: 'Endpoint not found.' }, 404);
    }
    return env.ASSETS.fetch(request);
  } catch (e) {
    if (e instanceof Error && (e.name === 'TimeoutError' || e.name === 'AbortError'))
      return json(
        {
          error:
            'The request timed out. Delivery may be uncertain; please contact Techsonic directly before retrying.',
        },
        504
      );
    return json(
      {
        error:
          'Service temporarily unavailable. Please try again later or contact Techsonic directly.',
      },
      503
    );
  }
}
export default {
  fetch(request: Request, env: Env) {
    return handleRequest(request, env);
  },
  async scheduled(_controller: unknown, env: Env) {
    if (!env.INTELLIGENCE) throw new Error('INTELLIGENCE storage binding is required.');
    await refreshNews(env.INTELLIGENCE);
  },
};

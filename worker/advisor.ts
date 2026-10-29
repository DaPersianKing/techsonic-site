import { advisorRequestSchema, validateConversation } from '../src/lib/advisor';
import { readLimitedBody, BodyLimitError } from './body';
import { advisorInstructions } from './advisor-knowledge';

export interface AdvisorEnv {
  SITE_ORIGIN?: string;
  AI_PROVIDER_KEY?: string;
  AI_MODEL?: string;
  AI_PROVIDER?: string;
  AI_MAX_OUTPUT_TOKENS?: string;
  CHAT_LIMITER?: { limit(options: { key: string }): Promise<{ success: boolean }> };
}

const reply = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...headers },
  });

export function advisorAvailable(env: AdvisorEnv): boolean {
  return Boolean(
    env.AI_PROVIDER === 'openai' && env.AI_PROVIDER_KEY && env.AI_MODEL && env.CHAT_LIMITER
  );
}

function maxOutputTokens(value: string | undefined): number {
  const configured = Number(value);
  return Number.isInteger(configured) && configured >= 100 ? Math.min(configured, 400) : 400;
}

type ProviderResponse = {
  status?: string;
  output?: { type?: string; role?: string; content?: { type?: string; text?: string }[] }[];
  usage?: { input_tokens?: number; output_tokens?: number };
};

export async function handleAdvisor(
  request: Request,
  env: AdvisorEnv,
  fetcher: typeof fetch = fetch
): Promise<Response> {
  if (request.method === 'GET') return reply({ available: advisorAvailable(env) });
  if (request.method !== 'POST')
    return reply({ error: 'Method not allowed.' }, 405, { Allow: 'GET, POST' });
  if (!env.SITE_ORIGIN || request.headers.get('Origin') !== env.SITE_ORIGIN)
    return reply({ error: 'This request origin is not permitted.' }, 403);
  if (!request.headers.get('Content-Type')?.startsWith('application/json'))
    return reply({ error: 'Expected JSON.' }, 415);
  if (!advisorAvailable(env))
    return reply({ error: 'AI Advisor is not configured yet. Please use the contact form.' }, 503);
  const ip = request.headers.get('CF-Connecting-IP');
  if (!ip) return reply({ error: 'Request verification unavailable.' }, 503);
  const limit = await env.CHAT_LIMITER!.limit({ key: `chat:${ip}` });
  if (!limit.success)
    return reply({ error: 'Too many requests. Please wait a minute and retry.' }, 429, {
      'Retry-After': '60',
    });
  const length = Number(request.headers.get('Content-Length') ?? 0);
  if (!Number.isFinite(length) || length > 12000)
    return reply({ error: 'Request is too large.' }, 413);
  let raw: string;
  try {
    raw = await readLimitedBody(request.body, 12000);
  } catch (error) {
    if (error instanceof BodyLimitError) return reply({ error: 'Request is too large.' }, 413);
    throw error;
  }
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return reply({ error: 'Invalid request body.' }, 400);
  }
  const parsed = advisorRequestSchema.safeParse(body);
  if (!parsed.success || !validateConversation(parsed.data.messages))
    return reply(
      { error: 'Conversation is invalid or exceeds its limit. Start a new conversation.' },
      400
    );
  let upstream: Response;
  try {
    upstream = await fetcher('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.AI_PROVIDER_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: env.AI_MODEL,
        instructions: advisorInstructions,
        input: parsed.data.messages,
        max_output_tokens: maxOutputTokens(env.AI_MAX_OUTPUT_TOKENS),
        store: false,
        tools: [],
        truncation: 'disabled',
      }),
      signal: AbortSignal.timeout(14000),
    });
  } catch {
    return reply(
      { error: 'AI Advisor could not reach the model provider. Please retry later.' },
      504
    );
  }
  if (!upstream.ok) {
    console.error('Advisor provider request failed', upstream.status);
    return reply({ error: 'AI Advisor is temporarily unavailable. Please retry later.' }, 502);
  }
  let result: ProviderResponse;
  try {
    result = JSON.parse(await readLimitedBody(upstream.body, 32000)) as ProviderResponse;
  } catch {
    return reply({ error: 'AI Advisor received an invalid response. Please retry later.' }, 502);
  }
  const answer = result.output
    ?.filter((item) => item.type === 'message' && item.role === 'assistant')
    .flatMap((item) => item.content ?? [])
    .filter((part) => part.type === 'output_text')
    .map((part) => part.text ?? '')
    .join('\n')
    .trim();
  if (result.status !== 'completed' || !answer || answer.length > 4000)
    return reply({ error: 'The advisor did not return a complete answer. Please retry.' }, 502);
  // Aggregate token counts only; never log prompts, replies, IPs, or credentials.
  // eslint-disable-next-line no-console
  console.info('Advisor usage', {
    inputTokens: result.usage?.input_tokens ?? 0,
    outputTokens: result.usage?.output_tokens ?? 0,
  });
  return reply({ reply: answer });
}

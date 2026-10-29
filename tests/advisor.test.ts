import { describe, expect, it, vi } from 'vitest';
import { handleRequest, type Env } from '../worker/index';
import { advisorInstructions } from '../worker/advisor-knowledge';

const env = (): Env => ({
  ASSETS: { fetch: vi.fn() },
  SITE_ORIGIN: 'https://www.gotechsonic.com',
  AI_PROVIDER: 'openai',
  AI_MODEL: 'configured-test-model',
  AI_PROVIDER_KEY: 'test-only-key',
  CHAT_LIMITER: { limit: vi.fn().mockResolvedValue({ success: true }) },
});
const request = (messages: unknown, origin = 'https://www.gotechsonic.com') =>
  new Request('https://www.gotechsonic.com/api/chat', {
    method: 'POST',
    headers: {
      Origin: origin,
      'Content-Type': 'application/json',
      'CF-Connecting-IP': '192.0.2.1',
    },
    body: JSON.stringify({ messages }),
  });
const valid = [
  { role: 'user', content: 'We have 45 locations. What should we consider for SD-WAN?' },
];
const provider = () =>
  Response.json({
    status: 'completed',
    output: [
      {
        type: 'message',
        role: 'assistant',
        content: [
          {
            type: 'output_text',
            text: 'Start with circuit inventory and resilience goals. Are sites on MPLS, DIA, or broadband?',
          },
        ],
      },
    ],
    usage: { input_tokens: 320, output_tokens: 30 },
  });

describe('AI Advisor endpoint', () => {
  it('fails closed when the model or limiter is unavailable', async () => {
    const e = env();
    delete e.AI_PROVIDER_KEY;
    expect(
      await (await handleRequest(new Request('https://www.gotechsonic.com/api/chat'), e)).json()
    ).toEqual({ available: false });
    expect((await handleRequest(request(valid), e)).status).toBe(503);
    const noModel = env();
    delete noModel.AI_MODEL;
    expect(
      await (
        await handleRequest(new Request('https://www.gotechsonic.com/api/chat'), noModel)
      ).json()
    ).toEqual({ available: false });
    const noLimiter = env();
    delete noLimiter.CHAT_LIMITER;
    expect((await handleRequest(request(valid), noLimiter)).status).toBe(503);
  });
  it('passes bounded approved context to a server-side provider and returns text only', async () => {
    const fetcher = vi.fn().mockResolvedValue(provider());
    const configured = env();
    configured.AI_MAX_OUTPUT_TOKENS = '200';
    const response = await handleRequest(request(valid), configured, fetcher);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.reply).toContain('circuit inventory');
    const [url, options] = fetcher.mock.calls[0];
    expect(url).toBe('https://api.openai.com/v1/responses');
    const body = JSON.parse(options.body);
    expect(body.store).toBe(false);
    expect(body.max_output_tokens).toBe(200);
    expect(body.tools).toEqual([]);
    expect(body.input).toEqual(valid);
    expect(body.instructions).toBe(advisorInstructions);
    expect(body.instructions).toContain('Supplier Intel Engine is under development');
    expect(JSON.stringify(data)).not.toContain('test-only-key');
  });
  it('validates origin, method, content and conversation before provider access', async () => {
    const fetcher = vi.fn();
    expect((await handleRequest(request(valid, 'https://evil.test'), env(), fetcher)).status).toBe(
      403
    );
    expect(
      (await handleRequest(request([{ role: 'assistant', content: 'hello' }]), env(), fetcher))
        .status
    ).toBe(400);
    expect(
      (await handleRequest(request([{ role: 'user', content: 'x'.repeat(1201) }]), env(), fetcher))
        .status
    ).toBe(400);
    expect(
      (await handleRequest(request(Array(13).fill({ role: 'user', content: 'x' })), env(), fetcher))
        .status
    ).toBe(400);
    expect(fetcher).not.toHaveBeenCalled();
  });
  it('accepts a longer model answer as conversation context on the next turn', async () => {
    const messages = [
      { role: 'user', content: 'I need a website.' },
      { role: 'assistant', content: 'A'.repeat(1500) },
      { role: 'user', content: 'What integration information do you need?' },
    ];
    expect(
      (await handleRequest(request(messages), env(), vi.fn().mockResolvedValue(provider()))).status
    ).toBe(200);
  });
  it('enforces the rate limit and handles provider errors', async () => {
    const limited = env();
    limited.CHAT_LIMITER!.limit = vi.fn().mockResolvedValue({ success: false });
    expect((await handleRequest(request(valid), limited)).status).toBe(429);
    expect(
      (
        await handleRequest(
          request(valid),
          env(),
          vi.fn().mockResolvedValue(new Response('', { status: 503 }))
        )
      ).status
    ).toBe(502);
    expect(
      (await handleRequest(request(valid), env(), vi.fn().mockRejectedValue(new Error('network'))))
        .status
    ).toBe(504);
    expect(
      (
        await handleRequest(
          request(valid),
          env(),
          vi.fn().mockRejectedValue(new DOMException('Timeout', 'TimeoutError'))
        )
      ).status
    ).toBe(504);
    expect(
      (
        await handleRequest(
          request(valid),
          env(),
          vi.fn().mockResolvedValue(Response.json({ status: 'incomplete', output: [] }))
        )
      ).status
    ).toBe(502);
    expect(
      (
        await handleRequest(
          request(valid),
          env(),
          vi.fn().mockResolvedValue(new Response('invalid json'))
        )
      ).status
    ).toBe(502);
    expect(
      (
        await handleRequest(
          request(valid),
          env(),
          vi
            .fn()
            .mockResolvedValue(
              new Response(JSON.stringify({ status: 'completed', output: [null] }))
            )
        )
      ).status
    ).toBe(502);
  });
  it('caps body size before parsing and never calls the provider', async () => {
    const fetcher = vi.fn();
    const big = request([{ role: 'user', content: 'x'.repeat(13000) }]);
    expect((await handleRequest(big, env(), fetcher)).status).toBe(413);
    expect(fetcher).not.toHaveBeenCalled();
  });
});

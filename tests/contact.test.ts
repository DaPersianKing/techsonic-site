import { describe, expect, it, vi } from 'vitest';
import worker, { handleRequest, type Env } from '../worker/index';
const payload = {
  name: 'Test User',
  email: 'test@example.com',
  company: '',
  category: 'Website Development',
  message: 'I would like a new business website.',
  consent: true,
  website: '',
  token: 'test-token',
};
const env = (): Env => ({
  ASSETS: { fetch: vi.fn().mockResolvedValue(new Response('asset')) },
  SITE_ORIGIN: 'https://www.gotechsonic.com',
  BREVO_API_KEY: 'test-only',
  BREVO_SENDER: 'web@gotechsonic.com',
  CONTACT_TO: 'hello@gotechsonic.com',
  TURNSTILE_SECRET: 'test-only',
  CONTACT_LIMITER: { limit: vi.fn().mockResolvedValue({ success: true }) },
});
function request(body: unknown = payload, origin = 'https://www.gotechsonic.com') {
  return new Request('https://www.gotechsonic.com/api/contact', {
    method: 'POST',
    headers: {
      Origin: origin,
      'Content-Type': 'application/json',
      'CF-Connecting-IP': '192.0.2.1',
    },
    body: JSON.stringify(body),
  });
}
const validCheck = { success: true, hostname: 'www.gotechsonic.com', action: 'contact' };
describe('contact endpoint', () => {
  it('sends distinct categories through Brevo only after spam verification', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(Response.json(validCheck))
      .mockResolvedValueOnce(Response.json({ messageId: 'receipt' }, { status: 201 }));
    const r = await handleRequest(request(), env(), fetcher);
    expect(r.status).toBe(202);
    expect(await r.json()).toEqual({ accepted: true });
    const email = JSON.parse(fetcher.mock.calls[1][1].body);
    expect(email.subject).toBe('Website inquiry: Website Development');
    expect(email.replyTo.email).toBe('test@example.com');
    expect(email.htmlContent).toBeUndefined();
  });
  it('fails closed without secrets', async () => {
    const e = env();
    delete e.BREVO_API_KEY;
    expect((await handleRequest(request(), e)).status).toBe(503);
  });
  it('rejects an untrusted origin before external calls', async () => {
    const fetcher = vi.fn();
    expect(
      (await handleRequest(request(payload, 'https://example.com'), env(), fetcher)).status
    ).toBe(403);
    expect(fetcher).not.toHaveBeenCalled();
  });
  it.each([
    { email: 'bad' },
    { consent: false },
    { category: 'Unknown' },
    { message: 'short' },
    { website: 'bot.example' },
  ])('rejects invalid and spam data %j', async (change) => {
    const fetcher = vi.fn();
    expect((await handleRequest(request({ ...payload, ...change }), env(), fetcher)).status).toBe(
      400
    );
    expect(fetcher).not.toHaveBeenCalled();
  });
  it('rate limits before email dispatch', async () => {
    const e = env();
    e.CONTACT_LIMITER!.limit = vi.fn().mockResolvedValue({ success: false });
    expect((await handleRequest(request(), e)).status).toBe(429);
  });
  it('rejects replayed, expired, wrong-host or wrong-action spam tokens', async () => {
    for (const data of [
      { success: false },
      { ...validCheck, hostname: 'attacker.example' },
      { ...validCheck, action: 'login' },
    ]) {
      const fetcher = vi.fn().mockResolvedValue(Response.json(data));
      expect((await handleRequest(request(), env(), fetcher)).status).toBe(400);
      expect(fetcher).toHaveBeenCalledTimes(1);
    }
  });
  it('never reports success when Brevo fails or lacks a receipt', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(Response.json(validCheck))
      .mockResolvedValueOnce(Response.json({ message: 'failure' }, { status: 500 }));
    expect((await handleRequest(request(), env(), fetcher)).status).toBe(502);
  });
  it('handles timeout without exposing secrets', async () => {
    const fetcher = vi.fn().mockRejectedValue(new DOMException('secret detail', 'TimeoutError'));
    const r = await handleRequest(request(), env(), fetcher);
    expect(r.status).toBe(504);
    expect(await r.text()).not.toContain('secret detail');
  });
  it('enforces body size and JSON content type', async () => {
    expect(
      (await handleRequest(request({ ...payload, message: 'x'.repeat(25000) }), env())).status
    ).toBe(413);
    const req = request();
    req.headers.set('Content-Type', 'text/plain');
    expect((await handleRequest(req, env())).status).toBe(415);
  });
  it('does not accept a GET submission', async () =>
    expect(
      (await handleRequest(new Request('https://www.gotechsonic.com/api/contact'), env())).status
    ).toBe(405));
  it('does not route API typos to SPA HTML', async () =>
    expect(
      (await handleRequest(new Request('https://www.gotechsonic.com/api/unknown'), env())).status
    ).toBe(404));
  it('serves static assets through the actual Worker entrypoint', async () => {
    const e = env();
    expect(await (await worker.fetch(new Request('https://www.gotechsonic.com/'), e)).text()).toBe(
      'asset'
    );
  });
});

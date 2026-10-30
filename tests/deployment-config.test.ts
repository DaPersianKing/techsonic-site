import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';

type Binding = { binding: string };
type Limiter = { name: string };

const config = JSON.parse(readFileSync('wrangler.jsonc', 'utf8')) as {
  main: string;
  vars: Record<string, string>;
  secrets: { required: string[] };
  assets: { binding: string; run_worker_first: string[] };
  kv_namespaces: Binding[];
  ratelimits: Limiter[];
  triggers: { crons: string[] };
};

it('keeps required public Worker variables and infrastructure bindings in release config', () => {
  expect(config.main).toBe('worker/index.ts');
  expect(config.vars).toMatchObject({
    SITE_ORIGIN: 'https://www.gotechsonic.com',
    AI_PROVIDER: 'openai',
    AI_MODEL: 'gpt-6-luna',
  });
  expect(config.vars).toHaveProperty('TURNSTILE_SITE_KEY');
  expect(Object.keys(config.vars).some((name) => name.startsWith('VITE_'))).toBe(false);
  expect(config.assets).toMatchObject({
    binding: 'ASSETS',
    run_worker_first: ['/api/*', '/.well-known/ard.json'],
  });
  expect(config.kv_namespaces.map(({ binding }) => binding)).toContain('INTELLIGENCE');
  expect(config.ratelimits.map(({ name }) => name)).toEqual(
    expect.arrayContaining(['CONTACT_LIMITER', 'CHAT_LIMITER'])
  );
  expect(config.triggers.crons).toContain('0 14 * * MON');
});

it('declares secret names only, without secret values in source config', () => {
  expect([...config.secrets.required].sort()).toEqual(
    ['AI_PROVIDER_KEY', 'TURNSTILE_SECRET', 'BREVO_API_KEY', 'BREVO_SENDER', 'CONTACT_TO'].sort()
  );
  for (const name of config.secrets.required) expect(config.vars).not.toHaveProperty(name);
});

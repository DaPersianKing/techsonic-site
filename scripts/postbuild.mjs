import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { routeMetadata } from '../src/lib/metadata.ts';
import { canonicalUrl, serializedStructuredData } from '../src/lib/seo.ts';
import { createServer, loadEnv } from 'vite';
import { fileURLToPath } from 'node:url';
import { analyticsCsp } from '../src/lib/analytics-policy.ts';

const html = await readFile('dist/index.html', 'utf8');
const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const server = await createServer({
  root: projectRoot,
  mode: 'production',
  server: { middlewareMode: true, hmr: false, watch: null },
  appType: 'custom',
  optimizeDeps: { noDiscovery: true },
});
const hashes = new Set();
const ga4Enabled =
  (process.env.VITE_GA4_ENABLED ??
    loadEnv('production', projectRoot, 'VITE_GA4_ENABLED').VITE_GA4_ENABLED) === 'true';
const verification =
  process.env.VITE_GOOGLE_SITE_VERIFICATION ??
  loadEnv('production', projectRoot, 'VITE_GOOGLE_SITE_VERIFICATION').VITE_GOOGLE_SITE_VERIFICATION;
if (verification && !/^[A-Za-z0-9_-]{20,200}$/.test(verification)) {
  await server.close();
  throw new Error('Invalid Google site verification token. Use the supplied token value only.');
}

const escape = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
function setMeta(document, key, value) {
  const pattern = new RegExp(`(<meta\\b[^>]*(?:name|property)="${key}"[^>]*content=")[^"]*`, 'g');
  if (!pattern.test(document)) throw new Error(`Missing metadata: ${key}`);
  return document.replace(pattern, (_, prefix) => prefix + escape(value));
}
// Render the actual app once per public route. No browser effects or API calls run here.
try {
  const { render } = await server.ssrLoadModule('/src/entry-server.tsx');
  for (const [path, meta] of Object.entries(routeMetadata)) {
    let document = html.replace(
      /<title>.*?<\/title>/,
      `<title>${escape(meta.title)} | Techsonic</title>`
    );
    for (const key of ['description', 'og:description', 'twitter:description'])
      document = setMeta(document, key, meta.description);
    for (const key of ['og:title', 'twitter:title'])
      document = setMeta(document, key, `${meta.title} | Techsonic`);
    document = setMeta(document, 'og:url', canonicalUrl(path));
    document = document.replace(
      /(<link\b[^>]*rel="canonical"[^>]*href=")[^"]*/,
      (_, prefix) => `${prefix}${canonicalUrl(path)}`
    );
    const jsonld = serializedStructuredData(path);
    if (!document.includes('<script type="application/ld+json">'))
      throw new Error('Structured metadata template is missing.');
    document = document.replace(
      /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
      () => `<script type="application/ld+json">${jsonld}</script>`
    );
    hashes.add(createHash('sha256').update(jsonld).digest('base64'));
    if (verification)
      document = document.replace(
        '</head>',
        `<meta name="google-site-verification" content="${verification}" /></head>`
      );
    if (!document.includes('<div id="root"></div>')) throw new Error('Empty app root is missing.');
    const content = await render(path);
    document = document.replace(
      '<div id="root"></div>',
      () => `<div id="root" data-prerendered="${path === '/' ? '' : path}">${content}</div>`
    );
    await mkdir(`dist${path}`, { recursive: true });
    await writeFile(`dist${path}/index.html`, document);
  }
  await writeFile(
    'dist/_headers',
    analyticsCsp(
      (await readFile('public/_headers', 'utf8')).replace(
        "'sha256-WILL_BE_SET_AT_BUILD'",
        [...hashes].map((hash) => `'sha256-${hash}'`).join(' ')
      ),
      ga4Enabled
    )
  );
} finally {
  await server.close();
}

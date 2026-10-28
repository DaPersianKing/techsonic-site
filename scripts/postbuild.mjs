import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { routeMetadata } from '../src/lib/metadata.ts';

const html = await readFile('dist/index.html', 'utf8');
const jsonld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
if (!jsonld) throw new Error('Structured metadata is missing.');
const hash = createHash('sha256').update(jsonld).digest('base64');
await writeFile(
  'dist/_headers',
  (await readFile('public/_headers', 'utf8')).replace('WILL_BE_SET_AT_BUILD', hash)
);

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
// Reuse the same metadata as the router, including formatted/multiline HTML tags.
for (const [path, meta] of Object.entries(routeMetadata)) {
  if (path === '/') continue;
  let document = html.replace(
    /<title>.*?<\/title>/,
    `<title>${escape(meta.title)} | Techsonic</title>`
  );
  for (const key of ['description', 'og:description', 'twitter:description'])
    document = setMeta(document, key, meta.description);
  for (const key of ['og:title', 'twitter:title'])
    document = setMeta(document, key, `${meta.title} | Techsonic`);
  document = setMeta(document, 'og:url', `https://www.gotechsonic.com${path}`);
  document = document.replace(
    /(<link\b[^>]*rel="canonical"[^>]*href=")[^"]*/,
    (_, prefix) => `${prefix}https://www.gotechsonic.com${path}`
  );
  await mkdir(`dist${path}`, { recursive: true });
  await writeFile(`dist${path}/index.html`, document);
}

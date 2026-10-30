import { describe, expect, it } from 'vitest';
import { mkdtemp, mkdir, readFile, writeFile, rm, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { routeMetadata } from '../src/lib/metadata';
import { JSDOM } from 'jsdom';

const productionOrigin = 'https://www.gotechsonic.com';

function expectCanonicalMetadata(html: string, path: string) {
  const dom = new JSDOM(html);
  try {
    const document = dom.window.document;
    const canonicals = document.querySelectorAll('link[rel="canonical"]');
    expect(canonicals).toHaveLength(1);
    expect(canonicals[0].getAttribute('href')).toBe(`${productionOrigin}${path}`);
    expect(document.querySelector('meta[property="og:url"]')?.getAttribute('content')).toBe(
      `${productionOrigin}${path}`
    );
    const graph = JSON.parse(
      document.querySelector('script[type="application/ld+json"]')?.textContent ?? '{}'
    )['@graph'];
    const organization = graph.find((node: { '@id': string }) =>
      node['@id'].endsWith('#organization')
    );
    expect(organization['@type']).toEqual(['Organization', 'ProfessionalService']);
    expect(organization.url).toBe(`${productionOrigin}/`);
    expect(new URL(organization.logo).origin).toBe(productionOrigin);
    const website = graph.find((node: { '@type': string }) => node['@type'] === 'WebSite');
    expect(website.url).toBe(`${productionOrigin}/`);
    expect(website.publisher['@id']).toBe(organization['@id']);
    const trail = graph.find((node: { '@type': string }) => node['@type'] === 'BreadcrumbList');
    if (path === '/') expect(trail).toBeUndefined();
    else {
      expect(trail.itemListElement.map((item: { item: string }) => item.item)).toEqual([
        `${productionOrigin}/`,
        `${productionOrigin}${path}`,
      ]);
      expect(document.querySelector('nav[aria-label="Breadcrumb"]')).toBeTruthy();
    }
    for (const key of ['og:image', 'twitter:image']) {
      const content = document
        .querySelector(`meta[property="${key}"],meta[name="${key}"]`)
        ?.getAttribute('content');
      expect(new URL(content ?? '').origin).toBe(productionOrigin);
    }
  } finally {
    dom.window.close();
  }
}
describe('static route metadata', () => {
  it('handles formatted HTML and shares route metadata with the client', async () => {
    await mkdir('tmp', { recursive: true });
    const directory = await mkdtemp(resolve('tmp/metadata-'));
    try {
      await mkdir(resolve(directory, 'dist'));
      await mkdir(resolve(directory, 'public'));
      await writeFile(resolve(directory, 'dist/index.html'), await readFile('index.html', 'utf8'));
      await writeFile(
        resolve(directory, 'public/_headers'),
        await readFile('public/_headers', 'utf8')
      );
      execFileSync(process.execPath, [resolve('scripts/postbuild.mjs')], {
        cwd: directory,
        env: { ...process.env, VITE_GOOGLE_SITE_VERIFICATION: '', VITE_GA4_ENABLED: 'false' },
        timeout: 60_000,
      });
      const documents = new Map<string, Document>();
      const doms: JSDOM[] = [];
      const titles = new Set<string>();
      const descriptions = new Set<string>();
      const headings = new Set<string>();
      const headers = await readFile(resolve(directory, 'dist/_headers'), 'utf8');
      for (const [path, meta] of Object.entries(routeMetadata)) {
        const html = await readFile(resolve(directory, `dist${path}/index.html`), 'utf8');
        expectCanonicalMetadata(html, path);
        const dom = new JSDOM(html);
        doms.push(dom);
        const document = dom.window.document;
        documents.set(path, document);
        expect(document.title).toBe(`${meta.title} | Techsonic`);
        expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(
          meta.description
        );
        titles.add(document.title);
        descriptions.add(meta.description);
        expect(document.querySelectorAll('main h1')).toHaveLength(1);
        headings.add(document.querySelector('main h1')!.textContent!.replace(/\s+/g, ' ').trim());
        expect(document.querySelector('main')!.textContent!.length).toBeGreaterThan(300);
        expect(document.querySelector('#root')?.hasChildNodes()).toBe(true);
        expect(document.querySelector('#root script')).toBeNull();
        expect(
          document.querySelector('meta[name="robots"]')?.getAttribute('content') ?? ''
        ).not.toMatch(/noindex|nofollow/);
        expect(document.querySelector('meta[name="google-site-verification"]')).toBeNull();
        expect(html).not.toMatch(/googletagmanager\.com|google-analytics\.com/);
        const jsonld = document.querySelector('script[type="application/ld+json"]')!.textContent!;
        expect(headers).toContain(
          `'sha256-${createHash('sha256').update(jsonld).digest('base64')}'`
        );
        for (const image of document.querySelectorAll('img')) {
          expect(image.hasAttribute('alt')).toBe(true);
          expect(Number(image.getAttribute('width'))).toBeGreaterThan(0);
          expect(Number(image.getAttribute('height'))).toBeGreaterThan(0);
          if (!image.getAttribute('src')?.includes('/logos/'))
            expect(image.getAttribute('loading')).toBe('lazy');
        }
        expect(html).toContain(meta.description);
        expect(html).toContain(`https://www.gotechsonic.com${path}`);
        expect(html).toContain(meta.title.replaceAll('&', '&amp;'));
      }
      expect(titles.size).toBe(10);
      expect(descriptions.size).toBe(10);
      expect(headings.size).toBe(10);
      for (const [path, document] of documents) {
        for (const anchor of document.querySelectorAll('a[href]')) {
          const url = new URL(anchor.getAttribute('href')!, `${productionOrigin}${path}`);
          if (!['gotechsonic.com', 'www.gotechsonic.com'].includes(url.hostname)) continue;
          expect(url.origin).toBe(productionOrigin);
          if (url.pathname.startsWith('/assets/')) await access(resolve(`public${url.pathname}`));
          else {
            expect(documents.has(url.pathname), `Broken internal route: ${url.href}`).toBe(true);
            if (url.hash)
              expect(
                documents.get(url.pathname)!.getElementById(url.hash.slice(1)),
                `Broken anchor: ${url.href}`
              ).toBeTruthy();
          }
        }
      }
      for (const dom of doms) dom.window.close();
      expect(headers).not.toContain('WILL_BE_SET_AT_BUILD');
      expect(headers).toMatch(/sha256-[A-Za-z0-9+/]+=*/);
      // Verification is opt-in and does not load a tracker. This is test-only data.
      await writeFile(resolve(directory, 'dist/index.html'), await readFile('index.html', 'utf8'));
      execFileSync(process.execPath, [resolve('scripts/postbuild.mjs')], {
        cwd: directory,
        env: {
          ...process.env,
          VITE_GOOGLE_SITE_VERIFICATION: 'test-only-search-console-verification',
          VITE_GA4_ENABLED: 'true',
        },
        timeout: 60_000,
      });
      for (const path of Object.keys(routeMetadata)) {
        const html = await readFile(resolve(directory, `dist${path}/index.html`), 'utf8');
        expect(html).toContain(
          'name="google-site-verification" content="test-only-search-console-verification"'
        );
        expect(html).not.toMatch(/googletagmanager\.com|google-analytics\.com/);
      }
      const enabledHeaders = await readFile(resolve(directory, 'dist/_headers'), 'utf8');
      expect(headers).not.toContain('googletagmanager.com');
      expect(enabledHeaders).toContain('https://www.googletagmanager.com');
      expect(enabledHeaders).toContain('https://region1.google-analytics.com');
      expect(enabledHeaders).not.toContain('unsafe-eval');
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  }, 60_000);

  it('lists every public route once on the preferred origin in the sitemap and robots file', async () => {
    const xml = await readFile('public/sitemap.xml', 'utf8');
    const dom = new JSDOM(xml, { contentType: 'application/xml' });
    try {
      const urls = [...dom.window.document.querySelectorAll('loc')].map((node) => node.textContent);
      expect(urls.sort()).toEqual(
        Object.keys(routeMetadata)
          .map((path) => `${productionOrigin}${path}`)
          .sort()
      );
    } finally {
      dom.window.close();
    }
    const robots = await readFile('public/robots.txt', 'utf8');
    expect(robots.match(/^Sitemap: .*$/gm)).toEqual([`Sitemap: ${productionOrigin}/sitemap.xml`]);
  });
});

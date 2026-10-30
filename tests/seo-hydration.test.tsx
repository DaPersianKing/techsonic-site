// @vitest-environment jsdom
import { act, type ComponentType } from 'react';
import { hydrateRoot, type Root } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeAll, beforeEach, expect, it, vi } from 'vitest';
import { waitFor, fireEvent } from '@testing-library/react';
import App from '../src/App';
import { routeLoaders } from '../src/lib/routeLoaders';
import { routeMetadata } from '../src/lib/metadata';
import { canonicalUrl, serializedStructuredData } from '../src/lib/seo';

vi.mock('../src/components/SpamCheck', () => ({ SpamCheck: () => null }));

let pages: Record<string, ComponentType>;
let root: Root | undefined;
beforeAll(async () => {
  pages = Object.fromEntries(
    await Promise.all(
      Object.entries(routeLoaders).map(async ([path, load]) => [path, (await load()).default])
    )
  );
});
beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  vi.stubGlobal('scrollTo', vi.fn());
  Object.defineProperty(Element.prototype, 'scrollIntoView', {
    configurable: true,
    value: vi.fn(),
  });
  vi.stubGlobal('matchMedia', () => ({ matches: false }));
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(Response.json({ updated: null, articles: [], stale: false }))
  );
  document.head.innerHTML =
    '<link rel="canonical"><meta property="og:url"><script type="application/ld+json"></script>';
});
afterEach(async () => {
  if (root) await act(async () => root!.unmount());
  root = undefined;
  document.body.innerHTML = '';
  vi.unstubAllGlobals();
});

it.each(Object.keys(routeLoaders))(
  'hydrates %s without replacing its static content',
  async (path) => {
    const html = renderToString(
      <MemoryRouter initialEntries={[path]}>
        <App pages={pages} />
      </MemoryRouter>
    );
    document.body.innerHTML = `<div id="root">${html}</div>`;
    const heading = document.querySelector('main h1');
    const errors: unknown[] = [];
    await act(async () => {
      root = hydrateRoot(
        document.getElementById('root')!,
        <MemoryRouter initialEntries={[path]}>
          <App />
        </MemoryRouter>,
        { onRecoverableError: (error) => errors.push(error) }
      );
    });
    await waitFor(() => expect(document.title).toBe(`${routeMetadata[path].title} | Techsonic`));
    expect(document.querySelector('main h1')).toBe(heading);
    expect(errors).toEqual([]);
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      canonicalUrl(path)
    );
    expect(document.querySelector('script[type="application/ld+json"]')?.textContent).toBe(
      serializedStructuredData(path)
    );
    if (path === '/tools') {
      fireEvent.change(document.querySelector('input[type="number"]')!, {
        target: { value: '2000' },
      });
      expect(document.querySelector('main h1')).toBe(heading);
    }
  },
  15_000
);

it('hydrates contact query prefills and keeps query/fragment data out of canonical metadata', async () => {
  const path = '/contact?category=Custom%20Engineering&application=Telco%20SME#main';
  const html = renderToString(
    <MemoryRouter initialEntries={['/contact']}>
      <App pages={pages} />
    </MemoryRouter>
  );
  document.body.innerHTML = `<div id="root">${html}</div>`;
  const errors: unknown[] = [];
  await act(async () => {
    root = hydrateRoot(
      document.getElementById('root')!,
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>,
      { onRecoverableError: (error) => errors.push(error) }
    );
  });
  await waitFor(() =>
    expect((document.querySelector('select[name="category"]') as HTMLSelectElement).value).toBe(
      'Custom Engineering'
    )
  );
  expect((document.querySelector('textarea') as HTMLTextAreaElement).value).toContain('Telco SME');
  expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
    canonicalUrl('/contact')
  );
  expect(errors).toEqual([]);
});

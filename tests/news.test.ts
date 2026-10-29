import { describe, expect, it, vi } from 'vitest';
import { deduplicate, feeds, parseFeed, refreshNews } from '../worker/news';
import { handleRequest } from '../worker/index';
const now = Date.UTC(2026, 9, 28);
const xml = (
  title = 'Cloud networking update',
  url = 'https://aws.amazon.com/news/update?utm_source=test'
) =>
  `<rss><channel><item><title>${title}</title><link>${url}</link><pubDate>Tue, 27 Oct 2026 10:00:00 GMT</pubDate><description>Full text is not republished</description></item></channel></rss>`;
describe('cached intelligence', () => {
  it('extracts headlines and dates, normalizes URLs, and uses editorial notes', () => {
    const [article] = parseFeed(xml(), feeds[2], now);
    expect(article.url).toBe('https://aws.amazon.com/news/update');
    expect(article.topic).toBe('Networking');
    expect(article.summary).not.toContain('Full text');
  });
  it('rejects external links, unsafe URLs, stale dates and irrelevant news', () => {
    expect(parseFeed(xml('Cloud update', 'javascript:alert(1)'), feeds[2], now)).toEqual([]);
    expect(parseFeed(xml('Cloud update', 'https://attacker.example/a'), feeds[2], now)).toEqual([]);
    expect(parseFeed(xml('A cooking recipe'), feeds[2], now)).toEqual([]);
    expect(parseFeed(xml(), feeds[2], now + 100 * 86400000)).toEqual([]);
  });
  it('rejects XML entities and deduplicates headlines and URLs', () => {
    expect(() => parseFeed('<!DOCTYPE rss>bad', feeds[2], now)).toThrow();
    const articles = parseFeed(xml(), feeds[2], now);
    expect(deduplicate([...articles, ...articles])).toHaveLength(1);
  });
  it('keeps the previous successful brief on total failure', async () => {
    const store = {
      get: vi.fn().mockResolvedValue(JSON.stringify({ updated: 'old', articles: [] })),
      put: vi.fn(),
    };
    await expect(
      refreshNews(store, vi.fn().mockRejectedValue(new Error('offline')), now)
    ).rejects.toThrow(/retained/);
    expect(store.put).not.toHaveBeenCalled();
  });
  it('retains previous articles from failed sources on partial refresh', async () => {
    const previous = {
      title: 'Telecom network change',
      url: 'https://www.fcc.gov/a',
      source: 'FCC',
      published: new Date(now - 86400000).toISOString(),
      topic: 'Telecom',
      summary: 'Context',
    };
    const store = {
      get: vi.fn().mockResolvedValue(JSON.stringify({ updated: 'old', articles: [previous] })),
      put: vi.fn(),
    };
    const fetcher = vi.fn().mockImplementation(async (url: string) => {
      if (url === feeds[0].url) throw new Error('offline');
      return new Response(xml());
    });
    const brief = await refreshNews(store, fetcher, now);
    expect(brief.partial).toBe(true);
    expect(brief.articles.some((a) => a.source === 'FCC')).toBe(true);
    expect(store.put).toHaveBeenCalledOnce();
  });
  it('marks stale data on read and returns honest empty state before first refresh', async () => {
    const base = { ASSETS: { fetch: vi.fn() } };
    const response = await handleRequest(new Request('https://example.com/api/news'), {
      ...base,
      INTELLIGENCE: { get: vi.fn().mockResolvedValue(null), put: vi.fn() },
    });
    expect(await response.json()).toEqual({ updated: null, articles: [], stale: false });
    const old = await handleRequest(new Request('https://example.com/api/news'), {
      ...base,
      INTELLIGENCE: {
        get: vi.fn().mockResolvedValue(JSON.stringify({ updated: '2020-01-01', articles: [] })),
        put: vi.fn(),
      },
    });
    expect(((await old.json()) as { stale: boolean }).stale).toBe(true);
  });
});

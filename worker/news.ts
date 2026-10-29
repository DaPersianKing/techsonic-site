import { XMLParser } from 'fast-xml-parser';
import { readLimitedBody } from './body.ts';
import type { NewsArticle, NewsBrief, Topic } from '../src/lib/news';
export interface BriefStore {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
}
export const feeds = [
  {
    source: 'FCC',
    url: 'https://www.fcc.gov/news-events/rss',
    hosts: ['fcc.gov', 'www.fcc.gov'],
    topic: 'Telecom' as Topic,
  },
  {
    source: 'CISA',
    url: 'https://www.cisa.gov/cybersecurity-advisories/all.xml',
    hosts: ['cisa.gov', 'www.cisa.gov'],
    topic: 'Cybersecurity' as Topic,
  },
  {
    source: 'AWS',
    url: 'https://aws.amazon.com/about-aws/whats-new/recent/feed/',
    hosts: ['aws.amazon.com'],
    topic: 'Cloud' as Topic,
  },
  {
    source: 'Google Cloud',
    url: 'https://cloudblog.withgoogle.com/rss/',
    hosts: ['cloud.google.com', 'cloudblog.withgoogle.com'],
    topic: 'Cloud' as Topic,
  },
];
const notes: Record<Topic, string> = {
  Telecom:
    'Review this update for potential effects on connectivity planning, service requirements, or supplier discussions.',
  Networking:
    'Consider whether this change affects network architecture, operating dependencies, or procurement requirements.',
  Cloud:
    'Assess workload fit, service availability, integration dependencies, and cost implications before adoption.',
  Cybersecurity:
    'Review affected products and versions in the original advisory, then route relevant actions through your security process.',
  'Enterprise IT':
    'Consider the operational, governance, and lifecycle implications for your technology environment.',
  'AI and Automation':
    'Evaluate integration scope, data handling, human review, and operating cost before adding this capability.',
};
function clean(value: unknown): string {
  if (typeof value === 'object' && value !== null && '#text' in value)
    return clean((value as Record<string, unknown>)['#text']);
  return typeof value === 'string' || typeof value === 'number'
    ? String(value)
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim()
    : '';
}
export function parseFeed(
  xml: string,
  feed: (typeof feeds)[number],
  now = Date.now()
): NewsArticle[] {
  if (/<!DOCTYPE|<!ENTITY/i.test(xml)) throw new Error('Feed declarations are not supported.');
  const parser = new XMLParser({
    ignoreAttributes: false,
    processEntities: false,
    maxNestedTags: 30,
  });
  const doc = parser.parse(xml);
  const entries = doc?.rss?.channel?.item ?? doc?.feed?.entry ?? [];
  return (Array.isArray(entries) ? entries : [entries])
    .slice(0, 100)
    .flatMap((entry: Record<string, unknown>) => {
      const title = clean(entry.title).slice(0, 220);
      const links = Array.isArray(entry.link) ? entry.link : [entry.link];
      const link = links.find(
        (l: unknown) =>
          typeof l === 'string' ||
          (typeof l === 'object' &&
            l !== null &&
            (!('@_rel' in l) || (l as Record<string, unknown>)['@_rel'] === 'alternate'))
      );
      const rawLink = typeof link === 'string' ? link : (link?.['@_href'] ?? clean(link));
      const date = new Date(clean(entry.pubDate ?? entry.published ?? entry.updated));
      if (
        !title ||
        !Number.isFinite(date.getTime()) ||
        date.getTime() > now + 86400000 ||
        date.getTime() < now - 90 * 86400000
      )
        return [];
      let url: URL;
      try {
        url = new URL(rawLink);
      } catch {
        return [];
      }
      if (
        url.protocol !== 'https:' ||
        !feed.hosts.includes(url.hostname) ||
        url.username ||
        url.password
      )
        return [];
      url.hash = '';
      for (const key of [...url.searchParams.keys()])
        if (/^utm_|^ref$|^source$/i.test(key)) url.searchParams.delete(key);
      const relevant =
        /network|telecom|broadband|internet|cloud|secur|cyber|identity|vulnerab|enterprise|infrastructure|automation|\bAI\b|artificial intelligence|compute|data|software|wireless|spectrum/i;
      if (!relevant.test(title)) return [];
      const topic: Topic = /secur|cyber|vulnerab|identity|\bIAM\b|OAuth|zero trust/i.test(title)
        ? 'Cybersecurity'
        : /\bAI\b|artificial intelligence|machine learning|automat/i.test(title)
          ? 'AI and Automation'
          : /network|routing|ethernet|connectivity|sd-wan|transit gateway|cloud wan|\bNAT\b/i.test(
                title
              )
            ? 'Networking'
            : /enterprise|governance|licens/i.test(title)
              ? 'Enterprise IT'
              : feed.topic;
      return [
        {
          title,
          url: url.toString(),
          source: feed.source,
          published: date.toISOString(),
          topic,
          summary: notes[topic],
        },
      ];
    });
}
export function deduplicate(articles: NewsArticle[]) {
  const urls = new Set<string>();
  const titles = new Set<string>();
  const counts = new Map<string, number>();
  return [...articles]
    .sort((a, b) => b.published.localeCompare(a.published))
    .filter((article) => {
      const title = article.title.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (urls.has(article.url) || titles.has(title) || (counts.get(article.source) ?? 0) >= 6)
        return false;
      urls.add(article.url);
      titles.add(title);
      counts.set(article.source, (counts.get(article.source) ?? 0) + 1);
      return true;
    })
    .slice(0, 24);
}
export async function refreshNews(
  store: BriefStore,
  fetcher: typeof fetch = fetch,
  now = Date.now()
) {
  const previousRaw = await store.get('brief');
  const previous = previousRaw ? (JSON.parse(previousRaw) as NewsBrief) : null;
  const results = await Promise.allSettled(
    feeds.map(async (feed) => {
      const response = await fetcher(feed.url, {
        headers: { Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml' },
        signal: AbortSignal.timeout(15000),
        redirect: 'manual',
      });
      if (!response.ok) throw new Error('Feed request failed.');
      const xml = await readLimitedBody(response.body, 2_000_000);
      const articles = parseFeed(xml, feed, now);
      if (!articles.length) throw new Error('No valid recent feed entries.');
      return articles;
    })
  );
  const successes = results.filter((r) => r.status === 'fulfilled');
  if (!successes.length) {
    const reasons = results.map(
      (result, i) =>
        `${feeds[i].source}: ${result.status === 'rejected' && result.reason instanceof Error ? result.reason.message : 'unavailable'}`
    );
    throw new Error(
      `All feed refreshes failed; previous successful brief retained. ${reasons.join('; ')}`
    );
  }
  const articles = deduplicate(
    results.flatMap((result, i) =>
      result.status === 'fulfilled'
        ? result.value
        : (previous?.articles.filter((a) => a.source === feeds[i].source) ?? [])
    )
  );
  const brief: NewsBrief = {
    updated: new Date(now).toISOString(),
    articles,
    stale: false,
    partial: successes.length < feeds.length,
  };
  await store.put('brief', JSON.stringify(brief));
  return brief;
}

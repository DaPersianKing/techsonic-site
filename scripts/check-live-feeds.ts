// Read-only network verification. Does not write KV, publish content, or deploy.
import { feeds, parseFeed } from '../worker/news.ts';
import { mkdir, writeFile } from 'node:fs/promises';
const report = await Promise.all(
  feeds.map(async (feed) => {
    try {
      const response = await fetch(feed.url, {
        signal: AbortSignal.timeout(20000),
        redirect: 'manual',
      });
      if (!response.ok) return { source: feed.source, status: response.status, validArticles: 0 };
      const articles = parseFeed(await response.text(), feed);
      return {
        source: feed.source,
        status: response.status,
        validArticles: articles.length,
        firstTitle: articles[0]?.title ?? null,
      };
    } catch (error) {
      return { source: feed.source, status: 'failed', error: (error as Error).message };
    }
  })
);
await mkdir('tmp', { recursive: true });
await writeFile(
  'tmp/live-feed-check.json',
  JSON.stringify({ checked: new Date().toISOString(), report }, null, 2)
);
process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
if (
  !report.some(
    (result) => 'validArticles' in result && result.validArticles && result.validArticles > 0
  )
)
  process.exitCode = 1;

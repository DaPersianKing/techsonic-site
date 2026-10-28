import { useEffect, useState } from 'react';
import { topics, type NewsBrief } from '../lib/news';
export default function IntelligencePage() {
  const [data, setData] = useState<NewsBrief | null>(null);
  const [error, setError] = useState('');
  const [topic, setTopic] = useState('All');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    let mounted = true;
    setError('');
    setData(null);
    void fetch('/api/news', { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok)
          throw new Error(
            'The brief is temporarily unavailable. Explore the original sources below or retry.'
          );
        const body = (await response.json()) as NewsBrief;
        if (!Array.isArray(body.articles))
          throw new Error('The brief could not be loaded. Please retry.');
        if (mounted) setData(body);
      })
      .catch((e) => {
        if (mounted)
          setError(e.name === 'AbortError' ? 'The request timed out. Please retry.' : e.message);
      })
      .finally(() => clearTimeout(timer));
    return () => {
      mounted = false;
      clearTimeout(timer);
      controller.abort();
    };
  }, [attempt]);
  const articles = data?.articles.filter((a) => topic === 'All' || a.topic === topic) ?? [];
  return (
    <>
      <section className="page-hero container">
        <p className="eyebrow">Signal for technology decisions</p>
        <h1>
          Technology
          <br />
          <span>Intelligence Brief</span>
        </h1>
        <p className="lede">
          A weekly selection of updates from primary sources, organized around the technology and
          operating decisions businesses face.
        </p>
      </section>
      <section className="container section">
        <p className="fine-print" style={{ margin: 0 }}>
          Last successful refresh:{' '}
          {data?.updated ? new Date(data.updated).toLocaleString() : 'Not yet available'}. Weekly
          refresh: Mondays, 14:00 UTC. Links open original reporting.
        </p>
        {data?.stale && (
          <p className="status-message" role="status">
            The last successful brief is retained. It is more than eight days old; check publication
            dates.
          </p>
        )}
        {data?.partial && (
          <p className="status-message">
            Some sources could not refresh. Their previous articles are retained where available.
          </p>
        )}
        <div className="news-topics" aria-label="Filter news topic">
          {['All', ...topics].map((t) => (
            <button key={t} aria-pressed={topic === t} onClick={() => setTopic(t)}>
              {t}
            </button>
          ))}
        </div>
        {!data && !error && <p role="status">Loading the latest cached brief…</p>}
        {error && (
          <div role="alert">
            <p className="error-message">{error}</p>
            <button className="button secondary" onClick={() => setAttempt((a) => a + 1)}>
              Retry
            </button>
          </div>
        )}
        {data && !articles.length && (
          <p className="status-message">
            No articles are available for this selection yet. No sample news has been substituted.
          </p>
        )}
        <div className="news-grid">
          {articles.map((article) => (
            <article className="news-card" key={article.url}>
              <p className="eyebrow">
                {article.topic} / {article.source}
              </p>
              <h2>{article.title}</h2>
              <time dateTime={article.published}>
                {new Date(article.published).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </time>
              <p style={{ marginTop: 16 }}>{article.summary}</p>
              <a className="text-link" href={article.url} target="_blank" rel="noreferrer">
                Read original article ↗
              </a>
            </article>
          ))}
        </div>
        <div className="source-list">
          <a href="https://www.fcc.gov/news-events" target="_blank" rel="noreferrer">
            FCC ↗
          </a>
          <a
            href="https://www.cisa.gov/news-events/cybersecurity-advisories"
            target="_blank"
            rel="noreferrer"
          >
            CISA ↗
          </a>
          <a href="https://aws.amazon.com/about-aws/whats-new/" target="_blank" rel="noreferrer">
            AWS What’s New ↗
          </a>
          <a href="https://cloud.google.com/blog/products" target="_blank" rel="noreferrer">
            Google Cloud ↗
          </a>
        </div>
        <p className="fine-print">
          Headlines and dates come from source feeds. Brief notes are Techsonic editorial context,
          not full-text reproductions or endorsements. No article is generated to fill an empty
          category.
        </p>
      </section>
    </>
  );
}

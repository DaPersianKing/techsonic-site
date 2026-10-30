import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App';
import { routeLoaders } from './lib/routeLoaders';

/** Build-time only: await lazy routes; effects never run or contact external services. */
export async function render(path: string): Promise<string> {
  // Resolve route modules before rendering to avoid a streamed Suspense fallback.
  const pages = Object.fromEntries(
    await Promise.all(
      Object.entries(routeLoaders).map(async ([route, load]) => [route, (await load()).default])
    )
  );
  const html = renderToString(
    <StaticRouter location={path}>
      <App pages={pages} />
    </StaticRouter>
  );
  if (!html.includes('<h1>') || html.includes('Loading page…'))
    throw new Error(`Prerender did not finish: ${path}`);
  return html;
}

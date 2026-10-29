import { describe, expect, it } from 'vitest';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { routeMetadata } from '../src/lib/metadata';
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
      execFileSync(process.execPath, [resolve('scripts/postbuild.mjs')], { cwd: directory });
      for (const [path, meta] of Object.entries(routeMetadata)) {
        if (path === '/') continue;
        const html = await readFile(resolve(directory, `dist${path}/index.html`), 'utf8');
        expect(html).toContain(meta.description);
        expect(html).toContain(`https://www.gotechsonic.com${path}`);
        expect(html).toContain(meta.title.replaceAll('&', '&amp;'));
      }
      const headers = await readFile(resolve(directory, 'dist/_headers'), 'utf8');
      expect(headers).not.toContain('WILL_BE_SET_AT_BUILD');
      expect(headers).toMatch(/sha256-[A-Za-z0-9+/]+=*/);
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
});

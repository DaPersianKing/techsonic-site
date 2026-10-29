// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import WebsitePage from '../src/pages/WebsitePage';
import { ShowcaseImage } from '../src/components/ShowcaseImage';
import { CaseStudyDiagram } from '../src/components/CaseStudyDiagram';
import { successProfiles } from '../src/data/successProfiles';

afterEach(cleanup);
describe('portfolio image treatment', () => {
  it('uses shared zoom frames and preserves full-resolution links', () => {
    const view = render(
      <MemoryRouter>
        <WebsitePage />
      </MemoryRouter>
    );
    expect(
      view.container.querySelectorAll('.portfolio-preview.image-zoom-container--portfolio')
    ).toHaveLength(3);
    view.rerender(<ShowcaseImage directory="applications" id="telco-sme" title="Telco SME" />);
    expect(
      view.container.querySelector('.showcase-image-frame.image-zoom-container--brand')
    ).not.toBeNull();
    expect(view.container.querySelector('a')?.getAttribute('href')).toBe(
      '/assets/applications/telco-sme.png'
    );
    view.rerender(
      <ShowcaseImage directory="workflows" id="ai-workflow-automation" title="AI Workflow" />
    );
    expect(
      view.container.querySelector('.showcase-image-frame.image-zoom-container--technical')
    ).not.toBeNull();
    expect(view.container.querySelector('a')?.getAttribute('href')).toBe(
      '/assets/workflows/ai-workflow-automation.png'
    );
    view.rerender(<CaseStudyDiagram profile={successProfiles[0]} />);
    expect(
      view.container.querySelector('.case-diagram-frame.image-zoom-container--technical')
    ).not.toBeNull();
    expect(view.container.querySelector('a')?.getAttribute('href')).toBe(
      '/assets/success-profiles/manufacturing.svg'
    );
  });
  it('guards motion behind fine-pointer hover and reduced-motion media queries', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/index.css'), 'utf8');
    expect(css).toMatch(/\.image-zoom-container\s*\{[^}]*overflow: hidden/);
    expect(css).toMatch(/@media \(hover: hover\) and \(pointer: fine\)/);
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)/);
    expect(css).toMatch(/\.image-zoom-container--portfolio:hover img[^}]*scale\(1\.055\)/);
    expect(css).toMatch(/\.image-zoom-container--brand:hover img[^}]*scale\(1\.018\)/);
    expect(css).toMatch(/\.image-zoom-container--technical:hover img[^}]*scale\(1\.018\)/);
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)[\s\S]*?transform: none/);
  });
});

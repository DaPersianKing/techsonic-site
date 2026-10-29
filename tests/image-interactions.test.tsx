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
  it('marks screenshots for zoom while leaving branded and dense visuals static', () => {
    const view = render(
      <MemoryRouter>
        <WebsitePage />
      </MemoryRouter>
    );
    expect(view.container.querySelectorAll('.portfolio-preview.image-zoom-container')).toHaveLength(
      3
    );
    view.rerender(<ShowcaseImage directory="applications" id="telco-sme" title="Telco SME" />);
    expect(view.container.querySelector('.image-zoom-container')).toBeNull();
    view.rerender(
      <ShowcaseImage directory="workflows" id="ai-workflow-automation" title="AI Workflow" />
    );
    expect(view.container.querySelector('.image-zoom-container')).toBeNull();
    view.rerender(<CaseStudyDiagram profile={successProfiles[0]} />);
    expect(view.container.querySelector('.image-zoom-container')).toBeNull();
  });
  it('guards motion behind fine-pointer hover and reduced-motion media queries', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/index.css'), 'utf8');
    expect(css).toMatch(/@media \(hover: hover\) and \(pointer: fine\)/);
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)/);
    expect(css).toMatch(/\.image-zoom-container:hover img[\s\S]*?scale\(1\.055\)/);
    expect(css).toMatch(/\.image-zoom-container:hover img[\s\S]*?transform: none/);
  });
});

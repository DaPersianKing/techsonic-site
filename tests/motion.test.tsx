// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { useSectionReveal } from '../src/lib/useSectionReveal';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function RevealFixture() {
  useSectionReveal();
  return (
    <main>
      <section>Readable content</section>
    </main>
  );
}

it('leaves content visible without an observer and with reduced motion', () => {
  Reflect.deleteProperty(window, 'IntersectionObserver');
  vi.stubGlobal('matchMedia', () => ({ matches: false }));
  const view = render(<RevealFixture />);
  expect(view.getByText('Readable content').classList.contains('section-revealed')).toBe(false);
  cleanup();
  const observer = vi.fn();
  vi.stubGlobal('IntersectionObserver', observer);
  vi.stubGlobal('matchMedia', () => ({ matches: true }));
  render(<RevealFixture />);
  expect(observer).not.toHaveBeenCalled();
});

it('gates decorative motion behind pointer and motion preferences', () => {
  const css = readFileSync('src/index.css', 'utf8');
  expect(css).toContain(
    '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'
  );
  expect(css).toMatch(
    /@media \(prefers-reduced-motion: reduce\)[\s\S]*?animation: none !important/
  );
});

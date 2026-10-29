// @vitest-environment jsdom
import { afterEach, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { readFileSync } from 'node:fs';
import SuccessProfilesPage from '../src/pages/SuccessProfilesPage';
import { successProfiles } from '../src/data/successProfiles';
afterEach(cleanup);
it('retains six anonymous profiles without production metrics or old financial figures', () => {
  const { container } = render(
    <MemoryRouter>
      <SuccessProfilesPage />
    </MemoryRouter>
  );
  expect(container.querySelectorAll('.case-study')).toHaveLength(6);
  expect(container.textContent).not.toMatch(
    /\b(MRR|ARR|TCV|commissions|bookings)\b|\$|80K|450K|2\.9M/i
  );
  expect(screen.getAllByRole('img')).toHaveLength(6);
  for (const profile of successProfiles)
    expect(screen.getByRole('heading', { name: profile.customer })).toBeTruthy();
});
it('exposes the full structure and distinguishes conceptual design from delivery', async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <SuccessProfilesPage />
    </MemoryRouter>
  );
  await user.click(screen.getAllByText('View Full Case Study')[0]);
  const open = document.querySelector('details[open]');
  for (const heading of [
    'Customer Environment',
    'Business Challenges',
    'Solution & Execution',
    'Results & Business Value',
    'Technical Architecture',
    'Key Takeaways',
  ])
    expect(open?.textContent).toContain(heading);
  expect(open?.textContent).toContain('does not assert completed implementation');
  expect(screen.getByRole('link', { name: 'Let’s Talk ↗' }).getAttribute('href')).toBe(
    '/contact?category=Technology%20Advisory&intent=success-profile'
  );
});
it('provides accessible desktop and mobile visuals and full-size links for every profile', () => {
  render(
    <MemoryRouter>
      <SuccessProfilesPage />
    </MemoryRouter>
  );
  expect(screen.getAllByRole('link', { name: /Enlarge diagram/ })).toHaveLength(6);
  for (const profile of successProfiles)
    for (const suffix of ['', '-mobile']) {
      const svg = readFileSync(`public/assets/success-profiles/${profile.id}${suffix}.svg`, 'utf8');
      expect(svg).toContain('<title');
      expect(svg).toContain('<desc');
      expect(svg).toMatch(/Conceptual|CONCEPTUAL/);
      expect(svg).not.toMatch(/<script|(?:href|src)=["']https?:|\b(?:MRR|ARR|TCV)\b/i);
    }
});

// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { NavigationGroup, navigationGroups } from '../src/components/Navigation';
import ApplicationsPage from '../src/pages/ApplicationsPage';
import ContactPage from '../src/pages/ContactPage';
vi.mock('../src/components/SpamCheck', () => ({ SpamCheck: () => null }));
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
it('supports a mobile accordion, Escape, and closes after navigation', async () => {
  vi.stubGlobal('matchMedia', () => ({ matches: false }));
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <NavigationGroup {...navigationGroups[1]} />
    </MemoryRouter>
  );
  const toggle = screen.getByRole('button', { name: 'Development' });
  await user.click(toggle);
  expect(toggle.getAttribute('aria-expanded')).toBe('true');
  expect(screen.getAllByRole('link')).toHaveLength(4);
  await user.click(toggle);
  expect(toggle.getAttribute('aria-expanded')).toBe('false');
  await user.click(toggle);
  await user.tab();
  await user.keyboard('{Escape}');
  expect(toggle.getAttribute('aria-expanded')).toBe('false');
  await user.click(toggle);
  await user.click(screen.getByRole('link', { name: 'Custom Applications' }));
  expect(toggle.getAttribute('aria-expanded')).toBe('false');
});
it('opens on desktop focus and keeps the submenu available after activation', async () => {
  vi.stubGlobal('matchMedia', () => ({ matches: true }));
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <NavigationGroup {...navigationGroups[0]} />
    </MemoryRouter>
  );
  await user.tab();
  const toggle = screen.getByRole('button');
  expect(toggle.getAttribute('aria-expanded')).toBe('true');
  await user.keyboard('{Enter}');
  expect(toggle.getAttribute('aria-expanded')).toBe('true');
  await user.tab();
  expect(document.activeElement?.textContent).toBe('What We Do');
  await user.keyboard('{Escape}');
  expect(toggle.getAttribute('aria-expanded')).toBe('false');
});
it('does not offer a demo for the application under development', () => {
  render(
    <MemoryRouter>
      <ApplicationsPage />
    </MemoryRouter>
  );
  expect(screen.getByText('Under Development')).toBeTruthy();
  expect(
    screen.getByRole('link', { name: /Discuss development status/ }).getAttribute('href')
  ).toContain('intent=application-status');
});
it('preserves application and workflow context in the inquiry', () => {
  render(
    <MemoryRouter
      initialEntries={[
        '/contact?category=Custom%20Engineering&application=Telco%20SME&workflow=API%20automation',
      ]}
    >
      <ContactPage />
    </MemoryRouter>
  );
  expect(
    (screen.getByLabelText('What would you like to accomplish?') as HTMLTextAreaElement).value
  ).toContain('Application: Telco SME. Workflow: API automation.');
});

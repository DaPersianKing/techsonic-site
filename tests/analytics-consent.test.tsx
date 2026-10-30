// @vitest-environment jsdom
import { StrictMode } from 'react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Link, MemoryRouter } from 'react-router-dom';
import { AnalyticsConsent } from '../src/components/AnalyticsConsent';
import { AnalyticsClient } from '../src/lib/analytics';
import { consentStorageKey } from '../src/lib/analytics-policy';

let client: AnalyticsClient;
const reload = vi.fn();
beforeEach(() => {
  localStorage.clear();
  document.querySelector('#techsonic-ga4')?.remove();
  delete (window as unknown as Record<string, unknown>).dataLayer;
  client = new AnalyticsClient(
    { enabled: true, allowNonProduction: true, debug: false },
    window,
    reload
  );
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  };
});
afterEach(() => {
  cleanup();
  client.dispose();
  reload.mockClear();
});
function mount() {
  return render(
    <StrictMode>
      <MemoryRouter initialEntries={['/advisory?secret=private']}>
        <Link to="/contact?category=Custom%20Engineering&application=private">
          Discuss engineering
        </Link>
        <Link to="/contact?other=private#main">Change query</Link>
        <Link to="/tools">Planning tools</Link>
        <AnalyticsConsent client={client} />
      </MemoryRouter>
    </StrictMode>
  );
}
function events() {
  return ((window as unknown as { dataLayer?: unknown[][] }).dataLayer ?? []).filter(
    (command) => command[0] === 'event'
  );
}

it('rejects without loading a tag and lets visitors revisit preferences; closing grants nothing', async () => {
  const user = userEvent.setup();
  mount();
  const banner = await screen.findByRole('region', { name: 'Analytics choices' });
  expect(document.querySelector('#techsonic-ga4')).toBeNull();
  await user.click(within(banner).getByRole('button', { name: 'Manage preferences' }));
  let dialog = screen.getByRole('dialog', { name: 'Analytics preferences' });
  await user.click(within(dialog).getByRole('button', { name: 'Close', exact: true }));
  expect(client.snapshot().choice).toBe('unknown');
  expect(document.querySelector('#techsonic-ga4')).toBeNull();
  await user.click(within(banner).getByRole('button', { name: 'Reject', exact: true }));
  expect(screen.queryByRole('region', { name: 'Analytics choices' })).toBeNull();
  expect(client.snapshot().choice).toBe('rejected');
  expect(document.querySelector('#techsonic-ga4')).toBeNull();
  await user.click(screen.getByRole('button', { name: 'Manage preferences' }));
  dialog = screen.getByRole('dialog', { name: 'Analytics preferences' });
  expect(within(dialog).getByRole('checkbox').getAttribute('checked')).toBeNull();
  await user.click(within(dialog).getByRole('button', { name: 'Accept', exact: true }));
  expect(document.querySelectorAll('#techsonic-ga4')).toHaveLength(1);
  expect(JSON.parse(localStorage.getItem(consentStorageKey)!).choice).toBe('granted');
});

it('counts a single page view after consent and one per canonical SPA transition, not query/hash changes', async () => {
  const user = userEvent.setup();
  mount();
  await user.click(
    within(await screen.findByRole('region', { name: 'Analytics choices' })).getByRole('button', {
      name: 'Accept',
      exact: true,
    })
  );
  expect(events().filter((command) => command[1] === 'page_view')).toHaveLength(1);
  await user.click(screen.getByRole('link', { name: 'Discuss engineering' }));
  await user.click(screen.getByRole('link', { name: 'Change query' }));
  await user.click(screen.getByRole('link', { name: 'Planning tools' }));
  await waitFor(() =>
    expect(events().filter((command) => command[1] === 'page_view')).toHaveLength(3)
  );
  expect(events().filter((command) => command[1] === 'service_cta_click')[0][2]).toMatchObject({
    service_category: 'engineering',
  });
  expect(JSON.stringify(events())).not.toMatch(/private|secret|\?/);
  await user.click(screen.getByRole('button', { name: 'Manage preferences' }));
  const dialog = screen.getByRole('dialog', { name: 'Analytics preferences' });
  await user.click(within(dialog).getByRole('checkbox'));
  await user.click(within(dialog).getByRole('button', { name: 'Save preferences' }));
  expect(document.querySelector('#techsonic-ga4')).toBeNull();
  expect(reload).toHaveBeenCalledTimes(1);
});

it('retains rejection across remounts and treats Escape as dismissal rather than consent', async () => {
  const user = userEvent.setup();
  const view = mount();
  await user.click(
    within(await screen.findByRole('region', { name: 'Analytics choices' })).getByRole('button', {
      name: 'Manage preferences',
    })
  );
  fireEvent(screen.getByRole('dialog'), new Event('cancel', { cancelable: true }));
  expect(client.snapshot().choice).toBe('unknown');
  await user.click(
    within(screen.getByRole('region', { name: 'Analytics choices' })).getByRole('button', {
      name: 'Reject',
      exact: true,
    })
  );
  view.unmount();
  mount();
  expect(screen.queryByRole('region', { name: 'Analytics choices' })).toBeNull();
  expect(document.querySelector('#techsonic-ga4')).toBeNull();
});

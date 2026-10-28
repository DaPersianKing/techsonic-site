// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ContactPage from '../src/pages/ContactPage';
vi.mock('../src/components/SpamCheck', () => ({
  SpamCheck: ({ onToken }: { onToken: (v: string) => void }) => (
    <button type="button" onClick={() => onToken('test-token')}>
      Verify spam check
    </button>
  ),
}));
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
async function fill() {
  const user = userEvent.setup();
  render(
    <MemoryRouter initialEntries={['/contact?category=Website%20Development']}>
      <ContactPage />
    </MemoryRouter>
  );
  await user.type(screen.getByLabelText('Name'), 'Test User');
  await user.type(screen.getByLabelText('Email'), 'test@example.com');
  await user.type(
    screen.getByLabelText('What would you like to accomplish?'),
    'I need a website for my growing business.'
  );
  await user.click(
    screen.getByLabelText(
      'I agree that Techsonic may use these details to respond to this inquiry.'
    )
  );
  await user.click(screen.getByText('Verify spam check'));
  return user;
}
describe('real contact submission state', () => {
  it('shows success only after the server accepts delivery and routes website inquiries', async () => {
    const fetcher = vi.fn().mockResolvedValue(Response.json({ accepted: true }, { status: 202 }));
    vi.stubGlobal('fetch', fetcher);
    const user = await fill();
    await user.click(screen.getByRole('button', { name: 'Send inquiry ↗' }));
    await waitFor(() => expect(screen.getByText('Request accepted')).toBeTruthy());
    expect(JSON.parse(fetcher.mock.calls[0][1].body).category).toBe('Website Development');
  });
  it('shows failure and preserves entered content after a server rejection', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(Response.json({ error: 'Delivery unavailable' }, { status: 502 }))
    );
    const user = await fill();
    await user.click(screen.getByRole('button', { name: 'Send inquiry ↗' }));
    await waitFor(() => expect(screen.getByRole('alert').textContent).toBe('Delivery unavailable'));
    expect((screen.getByLabelText('Name') as HTMLInputElement).value).toBe('Test User');
    expect(screen.queryByText('Request accepted')).toBeNull();
  });
  it('keeps submission disabled before spam verification', () => {
    render(
      <MemoryRouter>
        <ContactPage />
      </MemoryRouter>
    );
    expect(
      (screen.getByRole('button', { name: 'Send inquiry ↗' }) as HTMLButtonElement).disabled
    ).toBe(true);
  });
});

// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import AiAdvisor from '../src/components/AiAdvisor';
import { trackAnalytics } from '../src/lib/analytics';
vi.mock('../src/lib/analytics', () => ({ trackAnalytics: vi.fn(() => true) }));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.mocked(trackAnalytics).mockClear();
});
const renderAdvisor = () =>
  render(
    <MemoryRouter>
      <AiAdvisor />
    </MemoryRouter>
  );
describe('AI Advisor interface', () => {
  it('opens, responds, resets, and closes with Escape', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce(Response.json({ available: true }))
        .mockResolvedValueOnce(Response.json({ reply: 'Consider site inventory first.' }))
    );
    renderAdvisor();
    expect(screen.getByRole('dialog', { name: 'Techsonic AI Advisor' })).toBeTruthy();
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Send message' }).hasAttribute('disabled')).toBe(
        true
      )
    );
    const input = screen.getByLabelText('Message Techsonic AI Advisor');
    await user.type(input, 'How should we evaluate SD-WAN?');
    await user.click(screen.getByRole('button', { name: 'Send message' }));
    await screen.findByText('Consider site inventory first.');
    expect(
      screen.getByRole('link', { name: /Request a consultation/ }).getAttribute('href')
    ).toContain('category=Technology%20Advisory');
    await user.click(screen.getByRole('button', { name: 'New conversation' }));
    expect(screen.queryByText('Consider site inventory first.')).toBeNull();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(trackAnalytics).toHaveBeenCalledTimes(1);
    expect(trackAnalytics).toHaveBeenCalledWith({ name: 'ai_advisor_open' });
  });
  it('shows unavailable state without making a model request', async () => {
    const fetcher = vi.fn().mockResolvedValue(Response.json({ available: false }));
    vi.stubGlobal('fetch', fetcher);
    renderAdvisor();
    await screen.findByText(/AI Advisor is not configured/);
    expect(screen.getByRole('button', { name: 'Send message' }).hasAttribute('disabled')).toBe(
      true
    );
    await userEvent.click(screen.getByRole('button', { name: 'Check again' }));
    await waitFor(() => expect(fetcher).toHaveBeenCalledTimes(2));
  });
  it('supports error recovery without submitting a partial conversation', async () => {
    const user = userEvent.setup();
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(Response.json({ available: true }))
      .mockResolvedValueOnce(Response.json({ error: 'Temporary failure' }, { status: 502 }));
    vi.stubGlobal('fetch', fetcher);
    renderAdvisor();
    await screen.findByRole('button', { name: 'Build a website or application' });
    await user.click(screen.getByRole('button', { name: 'Build a website or application' }));
    await screen.findByText('Temporary failure');
    await user.click(screen.getByRole('button', { name: 'Edit and retry' }));
    expect(
      (screen.getByLabelText('Message Techsonic AI Advisor') as HTMLTextAreaElement).value
    ).toBe('Build a website or application');
    expect(
      screen.getByRole('link', { name: /Request a consultation/ }).getAttribute('href')
    ).toContain('category=Technology%20Advisory');
  });
});

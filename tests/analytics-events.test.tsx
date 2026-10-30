// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ToolsPage from '../src/pages/ToolsPage';
import { trackAnalytics } from '../src/lib/analytics';

vi.mock('../src/lib/analytics', () => ({ trackAnalytics: vi.fn(() => true) }));
afterEach(() => {
  cleanup();
  vi.mocked(trackAnalytics).mockClear();
});

it('tracks calculator engagement using fixed tool IDs and never serializes inputs or results', () => {
  const view = render(
    <MemoryRouter>
      <ToolsPage />
    </MemoryRouter>
  );
  for (const [section, tool] of [
    ['risk', 'contract-controls'],
    ['sla', 'sla-credit'],
    ['bandwidth', 'bandwidth'],
    ['cost', 'cost-comparison'],
  ]) {
    const input = view.container.querySelector(`#${section} input`)!;
    if (input.getAttribute('type') === 'checkbox') fireEvent.click(input);
    else fireEvent.change(input, { target: { value: '12345' } });
    expect(trackAnalytics).toHaveBeenCalledWith({ name: 'tool_use', tool });
  }
  expect(JSON.stringify(vi.mocked(trackAnalytics).mock.calls)).not.toContain('12345');
  expect(JSON.stringify(vi.mocked(trackAnalytics).mock.calls)).not.toMatch(
    /page_location|result|value/
  );
});

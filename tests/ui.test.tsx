// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AdvisoryProcess } from '../src/components/AdvisoryProcess';
import CarrierSlaCalculator from '../src/components/CarrierSlaCalculator';
import SlaCreditCalculator from '../src/components/SlaCreditCalculator';
import { Logo } from '../src/components/Logo';
afterEach(cleanup);
describe('interactive planning controls', () => {
  it('shows each stage without completed milestone language', async () => {
    const user = userEvent.setup();
    render(<AdvisoryProcess />);
    await user.click(screen.getByRole('button', { name: /Negotiate/ }));
    expect(screen.getByText('Align commercial terms with operational needs.')).toBeTruthy();
    expect(screen.queryByText('Completed')).toBeNull();
    expect(screen.getAllByRole('button')).toHaveLength(5);
  });
  it('records and reverses user confirmation without asserting compliance', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <CarrierSlaCalculator />
      </MemoryRouter>
    );
    const control = screen.getByRole('checkbox', { name: /Physical Pathway Diversity/ });
    expect(screen.getAllByText('Not yet verified')).toHaveLength(4);
    await user.click(control);
    expect(screen.getByText('1 / 4')).toBeTruthy();
    await user.click(control);
    expect(screen.getByText('0 / 4')).toBeTruthy();
    expect(screen.getByText(/not independent proof of contractual compliance/)).toBeTruthy();
  });
  it('updates SLA output and exposes invalid input instead of NaN', async () => {
    const user = userEvent.setup();
    render(<SlaCreditCalculator />);
    expect(screen.getByText('$100.00')).toBeTruthy();
    const field = screen.getByLabelText('Excluded outage minutes');
    await user.clear(field);
    await user.type(field, '60');
    expect(screen.getByText('$0.00')).toBeTruthy();
    await user.clear(field);
    await user.type(field, '100');
    expect(screen.getByRole('alert').textContent).toMatch(/Excluded minutes/);
    expect(screen.queryByText('$NaN')).toBeNull();
  });
  it('selects the icon and renders a visible legal identity', () => {
    const view = render(<Logo variant="icon" />);
    expect(screen.getByRole('img').getAttribute('src')).toContain('techsonic-icon.svg');
    view.rerender(<Logo variant="legal" />);
    expect(screen.getByText('Techsonic LLC')).toBeTruthy();
  });
});

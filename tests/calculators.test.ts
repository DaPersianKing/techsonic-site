import { describe, expect, it } from 'vitest';
import {
  calculateSla,
  calculateBandwidth,
  calculateCost,
  type SlaInput,
} from '../src/lib/calculators';
const sla: SlaInput = {
  mrc: 1000,
  target: 99.9,
  days: 30,
  outages: [90],
  exclusions: 0,
  method: 'fixed',
  percent: 10,
  tiers: [
    { belowUptime: 99.9, percent: 10 },
    { belowUptime: 99, percent: 25 },
  ],
  cap: 100,
};
describe('contract-specific SLA arithmetic', () => {
  it('calculates 30-day uptime, allowance, difference and fixed credit', () => {
    const r = calculateSla(sla);
    expect(r.minutes).toBe(43200);
    expect(r.actual).toBeCloseTo(99.7916667);
    expect(r.allowed).toBeCloseTo(43.2);
    expect(r.excess).toBeCloseTo(46.8);
    expect(r.difference).toBeCloseTo(-0.1083333);
    expect(r.credit).toBe(100);
  });
  it('subtracts exclusions without changing the denominator', () => {
    const r = calculateSla({ ...sla, exclusions: 60 });
    expect(r.qualifying).toBe(30);
    expect(r.credit).toBe(0);
    expect(r.rawUptime).toBeLessThan(r.actual);
  });
  it('does not credit exact threshold equality', () => {
    expect(calculateSla({ ...sla, target: 99, days: 1, outages: [14.4] }).credit).toBe(0);
  });
  it('applies proportional terms only when selected', () => {
    expect(calculateSla({ ...sla, method: 'proportional' }).credit).toBeCloseTo(
      (1000 * 90) / 43200
    );
  });
  it('uses the lowest matching tier regardless of entry order and caps credit', () => {
    const r = calculateSla({ ...sla, method: 'tiered', outages: [900], cap: 15 });
    expect(r.credit).toBe(150);
  });
  it('accepts zero outage and full exclusion boundaries', () => {
    expect(calculateSla({ ...sla, outages: [0] }).actual).toBe(100);
    expect(calculateSla({ ...sla, exclusions: 90 }).credit).toBe(0);
  });
  it('handles complete downtime with a 100 percent credit', () => {
    const r = calculateSla({ ...sla, days: 1, outages: [1440], percent: 100 });
    expect(r.actual).toBe(0);
    expect(r.credit).toBe(1000);
  });
  it.each([
    { days: 0 },
    { mrc: -1 },
    { target: 101 },
    { cap: 101 },
    { outages: [50000] },
    { exclusions: 91 },
    { mrc: NaN },
    { days: Infinity },
  ])('rejects invalid input %j', (changes) => {
    expect(() => calculateSla({ ...sla, ...changes })).toThrow();
  });
  it('rejects ambiguous duplicate tiers', () => {
    expect(() =>
      calculateSla({
        ...sla,
        method: 'tiered',
        tiers: [
          { belowUptime: 99, percent: 10 },
          { belowUptime: 99, percent: 20 },
        ],
      })
    ).toThrow(/unique/);
  });
});
describe('bandwidth assumptions', () => {
  const input = {
    users: 100,
    locations: 2,
    simultaneous: 50,
    application: 2,
    voice: 0.1,
    video: 1.5,
    growth: 20,
    headroom: 25,
  };
  it('compounds growth and headroom after concurrency and application budgets', () => {
    const r = calculateBandwidth(input);
    expect(r.baseline).toBe(180);
    expect(r.capacity).toBe(270);
    expect(r.perLocation).toBe(135);
  });
  it('handles no concurrent demand', () =>
    expect(calculateBandwidth({ ...input, simultaneous: 0 }).capacity).toBe(0));
  it('rejects zero locations and fractional users', () => {
    expect(() => calculateBandwidth({ ...input, locations: 0 })).toThrow();
    expect(() => calculateBandwidth({ ...input, users: 1.2 })).toThrow();
  });
});
describe('telecom total cost', () => {
  const input = {
    name: 'A',
    mrc: 100,
    nrc: 50,
    months: 24,
    escalator: 10,
    credits: 100,
    taxes: 10,
    installation: 50,
  };
  it('escalates after 12 months, taxes recurring charges and applies credit once', () => {
    const r = calculateCost(input);
    expect(r.total).toBeCloseTo(2772);
    expect(r.firstMonth).toBeCloseTo(110);
    expect(r.firstYear).toBeCloseTo(1320);
    expect(r.effectiveMonthly).toBeCloseTo(115.5);
    expect(r.sensitivity).toBeCloseTo(277.2);
  });
  it('supports a short term and zero spend', () => {
    expect(calculateCost({ ...input, months: 1 }).total).toBeCloseTo(110);
    expect(calculateCost({ ...input, mrc: 0, nrc: 0, installation: 0, credits: 0 }).total).toBe(0);
  });
  it.each([{ months: 0 }, { months: 1.5 }, { credits: 999999 }, { escalator: -1 }])(
    'rejects invalid input %j',
    (changes) => expect(() => calculateCost({ ...input, ...changes })).toThrow()
  );
});

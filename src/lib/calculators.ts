function finite(value: number, name: string, min = 0, max = 1e12) {
  if (!Number.isFinite(value) || value < min || value > max)
    throw new Error(`${name} must be between ${min} and ${max}.`);
  return value;
}
export interface CreditTier {
  belowUptime: number;
  percent: number;
}
export interface SlaInput {
  mrc: number;
  target: number;
  days: number;
  outages: number[];
  exclusions: number;
  method: 'fixed' | 'proportional' | 'tiered';
  percent: number;
  tiers: CreditTier[];
  cap: number;
}
export function calculateSla(input: SlaInput) {
  finite(input.mrc, 'Monthly charge');
  finite(input.target, 'Uptime target', 0, 100);
  finite(input.days, 'Period days', 1, 366);
  finite(input.percent, 'Credit percentage', 0, 100);
  finite(input.cap, 'Credit cap', 0, 100);
  const minutes = input.days * 1440;
  const outageMinutes = input.outages.reduce(
    (total, duration) => total + finite(duration, 'Outage minutes', 0, minutes),
    0
  );
  finite(outageMinutes, 'Total outage minutes', 0, minutes);
  finite(input.exclusions, 'Excluded minutes', 0, outageMinutes);
  const qualifying = outageMinutes - input.exclusions;
  const actual = ((minutes - qualifying) / minutes) * 100;
  const allowed = minutes * (1 - input.target / 100);
  const excess = Math.max(0, qualifying - allowed);
  const breached = actual + 1e-10 < input.target;
  let creditPercent = 0;
  if (input.method === 'fixed') creditPercent = breached ? input.percent : 0;
  if (input.method === 'proportional') creditPercent = breached ? (qualifying / minutes) * 100 : 0;
  if (input.method === 'tiered') {
    for (const tier of input.tiers) {
      finite(tier.belowUptime, 'Tier uptime', 0, 100);
      finite(tier.percent, 'Tier credit', 0, 100);
    }
    if (new Set(input.tiers.map((t) => t.belowUptime)).size !== input.tiers.length)
      throw new Error('Tier thresholds must be unique.');
    const tier = [...input.tiers]
      .sort((a, b) => a.belowUptime - b.belowUptime)
      .find((t) => actual + 1e-10 < t.belowUptime);
    creditPercent = breached ? (tier?.percent ?? 0) : 0;
  }
  return {
    minutes,
    outageMinutes,
    qualifying,
    actual,
    rawUptime: ((minutes - outageMinutes) / minutes) * 100,
    allowed,
    excess,
    difference: actual - input.target,
    credit: (input.mrc * Math.min(creditPercent, input.cap)) / 100,
    breached,
  };
}
export interface BandwidthInput {
  users: number;
  locations: number;
  simultaneous: number;
  application: number;
  voice: number;
  video: number;
  growth: number;
  headroom: number;
}
export function calculateBandwidth(i: BandwidthInput) {
  finite(i.users, 'Users', 1, 1e6);
  finite(i.locations, 'Locations', 1, 10000);
  finite(i.simultaneous, 'Simultaneous usage', 0, 100);
  finite(i.growth, 'Growth', 0, 1000);
  finite(i.headroom, 'Headroom', 0, 200);
  finite(i.application, 'Application Mbps', 0, 10000);
  finite(i.voice, 'Voice Mbps', 0, 1000);
  finite(i.video, 'Video Mbps', 0, 1000);
  if (!Number.isInteger(i.users) || !Number.isInteger(i.locations))
    throw new Error('Users and locations must be whole numbers.');
  const baseline = ((i.users * i.simultaneous) / 100) * (i.application + i.voice + i.video);
  const capacity = baseline * (1 + i.growth / 100) * (1 + i.headroom / 100);
  return { baseline, capacity, perLocation: capacity / i.locations };
}
export interface CostInput {
  name: string;
  mrc: number;
  nrc: number;
  months: number;
  escalator: number;
  credits: number;
  taxes: number;
  installation: number;
}
export function calculateCost(i: CostInput) {
  finite(i.mrc, 'MRC');
  finite(i.nrc, 'NRC');
  finite(i.months, 'Contract months', 1, 120);
  finite(i.escalator, 'Annual escalator', 0, 100);
  finite(i.credits, 'Credits');
  finite(i.taxes, 'Tax and fee rate', 0, 100);
  finite(i.installation, 'Installation cost');
  if (!Number.isInteger(i.months)) throw new Error('Contract months must be a whole number.');
  const recurring = Array.from(
    { length: i.months },
    (_, month) => i.mrc * (1 + i.escalator / 100) ** Math.floor(month / 12) * (1 + i.taxes / 100)
  );
  const preCredit = recurring.reduce((sum, cost) => sum + cost, 0) + i.nrc + i.installation;
  if (i.credits > preCredit) throw new Error('Credits cannot exceed total modeled charges.');
  const total = preCredit - i.credits;
  return {
    total,
    firstMonth: recurring[0],
    firstYear:
      recurring.slice(0, 12).reduce((a, b) => a + b, 0) + i.nrc + i.installation - i.credits,
    effectiveMonthly: total / i.months,
    sensitivity: recurring.reduce((a, b) => a + b, 0) * 0.1,
  };
}

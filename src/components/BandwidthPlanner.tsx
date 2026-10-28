import { useState } from 'react';
import { calculateBandwidth, type BandwidthInput } from '../lib/calculators';
import { ExportSummary, NumberField } from './ToolFields';
const fields: [keyof BandwidthInput, string, number, number][] = [
  ['users', 'Total users across locations', 1, 1e6],
  ['locations', 'Locations', 1, 10000],
  ['simultaneous', 'Simultaneous usage (%)', 0, 100],
  ['application', 'Application Mbps / active user', 0, 10000],
  ['voice', 'Voice Mbps / active user', 0, 1000],
  ['video', 'Video Mbps / active user', 0, 1000],
  ['growth', 'Expected growth (%)', 0, 1000],
  ['headroom', 'Planning headroom (%)', 0, 200],
];
export default function BandwidthPlanner() {
  const [input, setInput] = useState<BandwidthInput>({
    users: 100,
    locations: 2,
    simultaneous: 50,
    application: 2,
    voice: 0.1,
    video: 1.5,
    growth: 20,
    headroom: 25,
  });
  const [redundancy, setRedundancy] = useState('full');
  let result: ReturnType<typeof calculateBandwidth> | undefined;
  let error = '';
  try {
    result = calculateBandwidth(input);
  } catch (e) {
    error = (e as Error).message;
  }
  return (
    <section id="bandwidth" className="tool-section">
      <p className="eyebrow">03 / Capacity planning</p>
      <h2>Interactive Bandwidth Planner</h2>
      <p>
        Directional estimates for an evenly distributed user population. Validate busy-hour traffic,
        upload requirements, application quality, and site-specific demand before purchasing.
      </p>
      <div className="tool-layout">
        <div className="field-grid">
          {fields.map(([key, label, min, max]) => (
            <NumberField
              key={key}
              label={label}
              value={input[key]}
              min={min}
              max={max}
              step={key === 'users' || key === 'locations' ? 1 : 'any'}
              onChange={(value) => setInput((old) => ({ ...old, [key]: value }))}
            />
          ))}
          <label className="field wide-field">
            Redundancy requirement
            <select value={redundancy} onChange={(e) => setRedundancy(e.target.value)}>
              <option value="full">Full capacity on either path</option>
              <option value="critical">Critical applications only on backup</option>
              <option value="single">Single path — outage exposure accepted</option>
            </select>
          </label>
        </div>
        <div className="result" aria-live="polite">
          <h3>Estimated capacity</h3>
          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}
          {result && (
            <>
              <dl>
                <dt>Baseline aggregate demand</dt>
                <dd>{result.baseline.toFixed(1)} Mbps</dd>
                <dt>With growth & headroom</dt>
                <dd>{result.capacity.toFixed(1)} Mbps</dd>
                <dt>Average per location</dt>
                <dd>{result.perLocation.toFixed(1)} Mbps</dd>
                <dt>Planning headroom</dt>
                <dd>{input.headroom}%</dd>
              </dl>
              <p className="fine-print">
                Default headroom of 25% is a starting assumption, not a service guarantee. Voice,
                video, and application budgets are additive per active user. Growth and headroom
                compound.
              </p>
              <h4>Architecture recommendation</h4>
              <p className="fine-print">
                {redundancy === 'full'
                  ? `Plan each independent path for at least ${result.perLocation.toFixed(1)} Mbps per location. Validate physical diversity, edge capacity, and failover tests.`
                  : redundancy === 'critical'
                    ? 'Define the critical workload subset before sizing the backup. Apply QoS and test the degraded operating mode; no backup capacity is inferred here.'
                    : 'A single circuit is a single service failure exposure. Define recovery expectations and consider a separately qualified backup.'}
              </p>
              <ExportSummary
                summary={`Bandwidth planning estimate\nAssumptions: ${JSON.stringify(input)}\nBaseline: ${result.baseline.toFixed(1)} Mbps\nTotal planned: ${result.capacity.toFixed(1)} Mbps\nAverage site: ${result.perLocation.toFixed(1)} Mbps\nRedundancy: ${redundancy}\nValidate site traffic, upload demand, physical paths, QoS and failover before procurement.`}
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
}

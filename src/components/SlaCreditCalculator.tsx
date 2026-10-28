import { useState } from 'react';
import { calculateSla, type SlaInput } from '../lib/calculators';
import { ExportSummary, NumberField, money } from './ToolFields';
const initial: SlaInput = {
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
export default function SlaCreditCalculator() {
  const [input, setInput] = useState(initial);
  const update = (key: keyof SlaInput, value: number) =>
    setInput((old) => ({ ...old, [key]: value }));
  let result: ReturnType<typeof calculateSla> | undefined;
  let error = '';
  try {
    result = calculateSla(input);
  } catch (e) {
    error = (e as Error).message;
  }
  return (
    <section id="sla" className="tool-section">
      <p className="eyebrow">02 / Contract arithmetic</p>
      <h2>Quantitative SLA Calculator</h2>
      <p>
        Use the measurement period, qualifying minutes, and credit method in your executed
        agreement. Example inputs are editable assumptions, not carrier terms.
      </p>
      <div className="tool-layout">
        <div className="stack">
          <div className="field-grid">
            <NumberField
              label="Monthly recurring charge (USD)"
              value={input.mrc}
              onChange={(v) => update('mrc', v)}
            />
            <NumberField
              label="SLA uptime target (%)"
              value={input.target}
              max={100}
              onChange={(v) => update('target', v)}
            />
            <NumberField
              label="Measurement period (days)"
              min={1}
              max={366}
              value={input.days}
              onChange={(v) => update('days', v)}
            />
            <NumberField
              label="Excluded outage minutes"
              value={input.exclusions}
              onChange={(v) => update('exclusions', v)}
              hint="Subtract only exclusions permitted by your agreement. Period denominator remains unchanged."
            />
          </div>
          <fieldset>
            <legend>Outages — {input.outages.length} entered</legend>
            <p className="fine-print">
              Enter non-overlapping outages. Merge simultaneous incidents before entering them.
            </p>
            {input.outages.map((duration, i) => (
              <div className="outage-row" key={i}>
                <NumberField
                  label={`Outage ${i + 1} duration (minutes)`}
                  value={duration}
                  onChange={(v) =>
                    setInput((old) => ({
                      ...old,
                      outages: old.outages.map((n, j) => (i === j ? v : n)),
                    }))
                  }
                />
                <button
                  disabled={input.outages.length === 1}
                  onClick={() =>
                    setInput((old) => ({ ...old, outages: old.outages.filter((_, j) => i !== j) }))
                  }
                  aria-label={`Remove outage ${i + 1}`}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              className="text-link"
              disabled={input.outages.length >= 20}
              onClick={() => setInput((old) => ({ ...old, outages: [...old.outages, 0] }))}
            >
              + Add outage
            </button>
          </fieldset>
          <label className="field">
            Credit calculation method
            <select
              value={input.method}
              onChange={(e) =>
                setInput((old) => ({ ...old, method: e.target.value as SlaInput['method'] }))
              }
            >
              <option value="fixed">Fixed % of MRC when target is missed</option>
              <option value="proportional">Qualifying downtime / period × MRC</option>
              <option value="tiered">Uptime thresholds (% of MRC)</option>
            </select>
          </label>
          {input.method === 'fixed' && (
            <NumberField
              label="Contract credit percentage (%)"
              max={100}
              value={input.percent}
              onChange={(v) => update('percent', v)}
            />
          )}
          {input.method === 'tiered' && (
            <fieldset>
              <legend>Contract credit tiers</legend>
              <p className="fine-print">
                Strictly below each uptime threshold. The lowest matching threshold applies; credits
                are not additive.
              </p>
              {input.tiers.map((tier, i) => (
                <div className="outage-row" key={i}>
                  <NumberField
                    label={`Tier ${i + 1}: uptime below (%)`}
                    max={100}
                    value={tier.belowUptime}
                    onChange={(v) =>
                      setInput((old) => ({
                        ...old,
                        tiers: old.tiers.map((t, j) => (i === j ? { ...t, belowUptime: v } : t)),
                      }))
                    }
                  />
                  <NumberField
                    label={`Tier ${i + 1}: credit (%)`}
                    max={100}
                    value={tier.percent}
                    onChange={(v) =>
                      setInput((old) => ({
                        ...old,
                        tiers: old.tiers.map((t, j) => (i === j ? { ...t, percent: v } : t)),
                      }))
                    }
                  />
                  <button
                    aria-label={`Remove tier ${i + 1}`}
                    disabled={input.tiers.length === 1}
                    onClick={() =>
                      setInput((old) => ({ ...old, tiers: old.tiers.filter((_, j) => j !== i) }))
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                className="text-link"
                disabled={input.tiers.length >= 10}
                onClick={() =>
                  setInput((old) => ({
                    ...old,
                    tiers: [...old.tiers, { belowUptime: 0, percent: 0 }],
                  }))
                }
              >
                + Add tier
              </button>
            </fieldset>
          )}
          <NumberField
            label="Maximum service credit (% of MRC)"
            max={100}
            value={input.cap}
            onChange={(v) => update('cap', v)}
          />
        </div>
        <div className="result" aria-live="polite">
          <h3>Potential credit exposure</h3>
          {error && (
            <p role="alert" className="error-message">
              {error}
            </p>
          )}
          {result && (
            <>
              <dl>
                <dt>Actual uptime (after exclusions)</dt>
                <dd>{result.actual.toFixed(5)}%</dd>
                <dt>Observed uptime (all outages)</dt>
                <dd>{result.rawUptime.toFixed(5)}%</dd>
                <dt>Allowed downtime</dt>
                <dd>{result.allowed.toFixed(2)} min</dd>
                <dt>Qualifying downtime</dt>
                <dd>{result.qualifying.toFixed(2)} min</dd>
                <dt>Downtime above allowance</dt>
                <dd>{result.excess.toFixed(2)} min</dd>
                <dt>Difference against target</dt>
                <dd>{result.difference.toFixed(5)} pp</dd>
                <dt>Potential credit</dt>
                <dd>{money(result.credit)}</dd>
              </dl>
              <div
                className="bar"
                role="img"
                aria-label={`Qualifying uptime ${result.actual.toFixed(3)} percent`}
              >
                <span style={{ width: `${result.actual}%` }} />
              </div>
              <p className="fine-print">
                Availability = (period minutes − qualifying downtime) / period minutes × 100. A
                credit is modeled only when the target is missed. MRC is the entered credit basis;
                no period proration is assumed. If your agreement changes the denominator or uses
                another formula, request a tailored review.
              </p>
              <h4>Documentation & claim checklist</h4>
              <ul className="fine-print">
                <li>Executed SLA, service and measurement scope</li>
                <li>Incident tickets, timestamps and monitoring evidence</li>
                <li>Applicable exclusions and claim eligibility</li>
                <li>Carrier deadlines, submission owner and billing reconciliation</li>
              </ul>
              <ExportSummary
                summary={`SLA assessment — user-entered assumptions\nInputs: ${JSON.stringify(input)}\nActual qualifying uptime: ${result.actual.toFixed(5)}%\nAllowed downtime: ${result.allowed.toFixed(2)} min\nQualifying downtime: ${result.qualifying} min\nTarget difference: ${result.difference.toFixed(5)} percentage points\nPotential credit: ${money(result.credit)}\nEstimate only. Carrier eligibility, deadlines, exclusions and contract terms govern.`}
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
}

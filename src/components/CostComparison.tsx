import { useState } from 'react';
import { calculateCost, type CostInput } from '../lib/calculators';
import { ExportSummary, NumberField, money } from './ToolFields';
const fields: [keyof Omit<CostInput, 'name'>, string][] = [
  ['mrc', 'Monthly recurring charge (USD)'],
  ['nrc', 'Other nonrecurring charges (USD)'],
  ['months', 'Contract term (months)'],
  ['escalator', 'Annual MRC escalator (%)'],
  ['credits', 'Total one-time credits (USD)'],
  ['taxes', 'Recurring taxes & fees (%)'],
  ['installation', 'One-time installation (USD)'],
];
const defaults = (name: string): CostInput => ({
  name,
  mrc: 500,
  nrc: 0,
  months: 36,
  escalator: 0,
  credits: 0,
  taxes: 0,
  installation: 0,
});
export default function CostComparison() {
  const [providers, setProviders] = useState([defaults('Option A'), defaults('Option B')]);
  const rows = providers.map((provider) => {
    try {
      return { provider, result: calculateCost(provider), error: '' };
    } catch (e) {
      return { provider, result: undefined, error: (e as Error).message };
    }
  });
  const sameTerm = providers.every((p) => p.months === providers[0].months);
  const valid = rows.every((r) => r.result);
  const totals = rows.flatMap((r) => (r.result ? [r.result.total] : []));
  return (
    <section id="cost" className="tool-section">
      <p className="eyebrow">04 / Commercial modeling</p>
      <h2>Telecom Cost Comparison</h2>
      <p>
        User-entered assumptions only. These are not carrier quotes or available offers. All values
        use USD; do not mix currencies.
      </p>
      <div className="stack" style={{ marginTop: 25 }}>
        {providers.map((p, i) => (
          <fieldset key={i}>
            <legend>Provider option {i + 1}</legend>
            <div className="field-grid">
              <label className="field">
                Provider name
                <input
                  value={p.name}
                  maxLength={80}
                  onChange={(e) =>
                    setProviders((old) =>
                      old.map((item, j) => (j === i ? { ...item, name: e.target.value } : item))
                    )
                  }
                />
              </label>
              {fields.map(([key, label]) => (
                <NumberField
                  key={key}
                  label={`${label} — option ${i + 1}`}
                  value={p[key]}
                  min={key === 'months' ? 1 : 0}
                  max={key === 'months' ? 120 : key === 'taxes' || key === 'escalator' ? 100 : 1e9}
                  step={key === 'months' ? 1 : 'any'}
                  onChange={(value) =>
                    setProviders((old) =>
                      old.map((item, j) => (j === i ? { ...item, [key]: value } : item))
                    )
                  }
                />
              ))}
            </div>
            {providers.length > 2 && (
              <button
                className="text-link"
                onClick={() => setProviders((old) => old.filter((_, j) => j !== i))}
              >
                Remove option {i + 1}
              </button>
            )}
          </fieldset>
        ))}
        <button
          className="button secondary"
          disabled={providers.length >= 4}
          onClick={() =>
            setProviders((old) => [
              ...old,
              defaults(`Option ${String.fromCharCode(65 + old.length)}`),
            ])
          }
        >
          Add provider option
        </button>
        <div className="result" aria-live="polite">
          <h3>Modeled cost comparison</h3>
          {rows.map(
            (r, i) =>
              r.error && (
                <p key={i} className="error-message" role="alert">
                  {r.provider.name || `Option ${i + 1}`}: {r.error}
                </p>
              )
          )}
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Option</th>
                  <th>First month recurring</th>
                  <th>First year incl. one-time costs</th>
                  <th>Lifetime TCO</th>
                  <th>Effective monthly</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    <th>{r.provider.name || `Option ${i + 1}`}</th>
                    {r.result ? (
                      <>
                        <td>{money(r.result.firstMonth)}</td>
                        <td>{money(r.result.firstYear)}</td>
                        <td>
                          {money(r.result.total)} / {r.provider.months} mo
                        </td>
                        <td>{money(r.result.effectiveMonthly)}</td>
                      </>
                    ) : (
                      <td colSpan={4}>Correct inputs to calculate.</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {valid && (
            <>
              <p>
                {sameTerm
                  ? `Modeled spread between highest and lowest lifetime cost: ${money(Math.max(...totals) - Math.min(...totals))}. Review availability and service scope before treating this as a savings opportunity.`
                  : 'Contract terms differ. Lifetime totals are not directly comparable; use effective monthly cost and normalize the evaluation horizon.'}
              </p>
              {rows.map(
                (r, i) =>
                  r.result && (
                    <div key={i}>
                      <p className="fine-print">
                        {r.provider.name}: {money(r.result.total)} lifetime TCO. A 10% MRC increase
                        changes TCO by {money(r.result.sensitivity)}.
                      </p>
                      <div
                        className="bar"
                        role="img"
                        aria-label={`${r.provider.name} lifetime TCO ${money(r.result.total)}`}
                      >
                        <span
                          style={{
                            width: `${Math.max(...totals) ? (r.result.total / Math.max(...totals)) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  )
              )}
              <ExportSummary
                summary={`Telecom comparison — user-entered assumptions, not carrier quotes\n${rows.map((r) => `${JSON.stringify(r.provider)}\nTCO: ${money(r.result!.total)}; effective monthly: ${money(r.result!.effectiveMonthly)}; first year: ${money(r.result!.firstYear)}; +10% MRC sensitivity: ${money(r.result!.sensitivity)}`).join('\n')}\nAnnual escalators apply after each 12 months. Taxes apply to recurring charges only. NRC excludes separately entered installation. Credits are applied once. No discounting, exit costs or service equivalence assumed.`}
              />
            </>
          )}
          <p className="fine-print">
            Escalators apply on each 12-month anniversary. Taxes/fees apply only to recurring
            charges. NRC must exclude separately entered installation. Credits apply once in year
            one. A short contract’s first-year figure covers its entered months only. No tax on
            one-time charges, present-value discounting, termination cost, or service equivalence is
            assumed.
          </p>
        </div>
      </div>
    </section>
  );
}

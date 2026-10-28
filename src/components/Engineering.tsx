import { useState } from 'react';
export function Engineering() {
  const [view, setView] = useState<'network' | 'workflow'>('network');
  return (
    <section id="engineering" className="technical section">
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">From decision to design</p>
            <h2>Inside the Engineering</h2>
          </div>
          <p>
            Architecture that explains the decision.
            <br />
            Examples grounded in real engineering principles.
          </p>
        </div>
        <div className="segmented">
          <button aria-pressed={view === 'network'} onClick={() => setView('network')}>
            Dual-DIA network
          </button>
          <button aria-pressed={view === 'workflow'} onClick={() => setView('workflow')}>
            Invoice automation
          </button>
        </div>
        <div className="engineering-layout">
          <div
            className="architecture"
            aria-label={
              view === 'network'
                ? 'Example topology: two separately qualified carrier paths feed SD-WAN edges, a security policy layer, and business applications.'
                : 'Example workflow: invoices are extracted, compared to a rate card, reviewed by a person, and reconciled.'
            }
          >
            <p className="diagram-label">
              REFERENCE ARCHITECTURE / {view === 'network' ? 'N-01' : 'A-01'}
            </p>
            {view === 'network' ? (
              <>
                <div className="diagram-row">
                  <div>
                    Carrier A · DIA<small>Entry A / route evidence</small>
                  </div>
                  <div>
                    Carrier B · DIA<small>Entry B / route evidence</small>
                  </div>
                </div>
                <div className="diagram-connectors" aria-hidden>
                  ↓<span>↓</span>
                </div>
                <div className="diagram-node">
                  SD-WAN edge pair
                  <small>Health probes · failover policy · shared failure review</small>
                </div>
                <div className="diagram-arrow" aria-hidden>
                  ↓
                </div>
                <div className="diagram-node">
                  Security & access policy<small>Identity · inspection · application routing</small>
                </div>
                <div className="diagram-arrow" aria-hidden>
                  ↓
                </div>
                <div className="diagram-row">
                  <div>Cloud workloads</div>
                  <div>Business applications</div>
                </div>
              </>
            ) : (
              <>
                {[
                  'Invoice ingestion / approved files',
                  'Structured extraction / source references',
                  'Rate-card comparison / deterministic rules',
                  'Exception queue / human validation',
                  'Reconciliation / audit trail',
                ].map((item, i) => (
                  <div key={item}>
                    <div className="diagram-node">{item}</div>
                    {i < 4 && (
                      <div className="diagram-arrow" aria-hidden>
                        ↓
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
          <div className="engineering-notes">
            <span className="eyebrow">Design notes</span>
            {view === 'network' ? (
              <>
                <h3>Two providers ≠ two physical paths.</h3>
                <p>
                  Qualify the underlying fiber, building entries, shared facilities, power, and
                  last-mile dependencies before calling a design diverse.
                </p>
                <ol>
                  <li>Request route evidence and document what remains unknown.</li>
                  <li>Set failover acceptance tests against application needs.</li>
                  <li>Align monitoring and carrier tickets with SLA claim duties.</li>
                </ol>
              </>
            ) : (
              <>
                <h3>Automate the repeatable. Review the exception.</h3>
                <p>
                  Preserve source references and confidence signals. Do not let extraction output
                  silently become an approved billing decision.
                </p>
                <ol>
                  <li>Validate supplier, service period, currency, and circuit identifiers.</li>
                  <li>Keep contract rates separate from inferred values.</li>
                  <li>Require human approval for disputes and downstream actions.</li>
                </ol>
              </>
            )}
            <p className="fine-print">
              Illustrative design. Not a customer deployment or a claim of measured results.
            </p>
          </div>
        </div>
        <details className="matrix">
          <summary>Inspect a sample carrier qualification matrix</summary>
          <div className="table-scroll">
            <table>
              <caption>Evaluation template — no carrier has been scored</caption>
              <thead>
                <tr>
                  <th>Criterion</th>
                  <th>Evidence to request</th>
                  <th>Decision gate</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Service availability</td>
                  <td>Address qualification and demarcation</td>
                  <td>Confirm delivery scope</td>
                </tr>
                <tr>
                  <td>Path diversity</td>
                  <td>Route and building-entry evidence</td>
                  <td>Review shared failure points</td>
                </tr>
                <tr>
                  <td>SLA and support</td>
                  <td>Executed terms and escalation process</td>
                  <td>Assign claim responsibility</td>
                </tr>
                <tr>
                  <td>Commercial fit</td>
                  <td>MRC, NRC, escalators, renewal and exit</td>
                  <td>Normalize lifetime TCO</td>
                </tr>
              </tbody>
            </table>
          </div>
        </details>
      </div>
    </section>
  );
}

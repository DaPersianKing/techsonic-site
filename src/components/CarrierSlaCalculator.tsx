import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExportSummary } from './ToolFields';
const controls = [
  {
    title: 'Physical Pathway Diversity',
    question: 'Have independent physical routes and building entry points been verified?',
    issue: 'Two carriers can share underlying fiber infrastructure.',
    action:
      'Confirm route diversity, physical entry points, and documented evidence where available.',
  },
  {
    title: 'Chronic Outage Termination',
    question:
      'Does the agreement include actionable termination provisions for repeated service failures?',
    issue: 'Standard service credits may not adequately protect customers from chronic outages.',
    action:
      'Negotiate objectively defined chronic-outage termination rights, subject to agreement.',
  },
  {
    title: 'SLA Credit Claims',
    question:
      'Are outage documentation, credit eligibility, claim deadlines, and submission responsibilities established?',
    issue: 'Claims may be lost if carrier-specific deadlines or evidence requirements are not met.',
    action: 'Document monitoring, tickets, deadlines, and billing reconciliation.',
  },
  {
    title: 'Billing and Contract Transparency',
    question:
      'Have billing start dates, escalators, renewals, cancellations, installation charges, and other material terms been validated?',
    issue: 'Unexpected charges and unfavorable renewals can materially increase contract cost.',
    action: 'Conduct commercial term validation before execution.',
  },
];
export default function CarrierSlaCalculator() {
  const [confirmed, setConfirmed] = useState<boolean[]>(controls.map(() => false));
  const count = confirmed.filter(Boolean).length;
  const summary = `Enterprise Circuit & Contract Risk Checker\nControls reviewed: ${count}/4 confirmed by user\nControls requiring review: ${4 - count}\n${controls.map((c, i) => `${c.title}: ${confirmed[i] ? 'Confirmed by user' : 'Not yet verified'}${confirmed[i] ? '' : `\nRecommended review: ${c.action}`}`).join('\n')}\nUser confirmations are not independent proof of compliance. Review the executed agreement and supporting evidence.`;
  return (
    <section id="risk" className="tool-section">
      <p className="eyebrow">01 / Contract controls</p>
      <h2>Enterprise Circuit & Contract Risk Checker</h2>
      <p>
        A practical review checklist. Confirm only the controls you have checked against your
        agreement and supporting evidence.
      </p>
      <div className="tool-layout">
        <div>
          {controls.map((c, i) => (
            <div className="control" key={c.title}>
              <label htmlFor={`risk-${i}`}>
                <input
                  id={`risk-${i}`}
                  type="checkbox"
                  checked={confirmed[i]}
                  onChange={(e) =>
                    setConfirmed((old) => old.map((v, n) => (n === i ? e.target.checked : v)))
                  }
                />
                <span>
                  {c.title}
                  <span className="sr-only">: {c.question}</span>
                </span>
              </label>
              <p>{c.question}</p>
              <p>
                <strong>Potential issue:</strong> {c.issue}
              </p>
              {!confirmed[i] && (
                <p>
                  <strong>Recommended review:</strong> {c.action}
                </p>
              )}
              <small>{confirmed[i] ? 'Confirmed by user' : 'Not yet verified'}</small>
            </div>
          ))}
        </div>
        <div className="result" aria-live="polite">
          <h3>Assessment summary</h3>
          <dl>
            <dt>Controls reviewed / confirmed by user</dt>
            <dd>{count} / 4</dd>
            <dt>Controls requiring review</dt>
            <dd>{4 - count}</dd>
          </dl>
          <div className="bar" role="img" aria-label={`${count} of 4 controls confirmed by user`}>
            <span style={{ width: `${(count / 4) * 100}%` }} />
          </div>
          <p className="fine-print">
            A checked box records your confirmation. It is not independent proof of contractual
            compliance. Unchecked controls are unverified, not a universal risk score.
          </p>
          <Link
            className="button"
            to="/contact?category=Technology%20Advisory&intent=contract-review"
          >
            Request Contract Review ↗
          </Link>
          <ExportSummary summary={summary} />
        </div>
      </div>
    </section>
  );
}

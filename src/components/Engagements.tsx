import { engagements } from '../data/content';
export function Engagements() {
  return (
    <section id="engagements" className="section container">
      <div className="section-heading">
        <div>
          <p className="eyebrow">The work, made tangible</p>
          <h2>Selected Engagements & Outcomes</h2>
        </div>
        <p>
          Illustrative, anonymized engagement profiles. Outcomes below are objectives, not verified
          customer results.
        </p>
      </div>
      <div className="engagements">
        {engagements.map((item, i) => (
          <details key={item.title} className="engagement">
            <summary>
              <span className="index">0{i + 1}</span>
              <span>
                <small>{item.context}</small>
                <h3>{item.title}</h3>
              </span>
              <span className="expand" aria-hidden>
                +
              </span>
            </summary>
            <div className="engagement-body">
              {[
                ['Challenge', item.challenge],
                ['Technical Approach', item.approach],
                ['Commercial Strategy', item.commercial],
                ['Outcome', item.outcome],
              ].map(([label, text]) => (
                <div key={label}>
                  <h4>{label}</h4>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

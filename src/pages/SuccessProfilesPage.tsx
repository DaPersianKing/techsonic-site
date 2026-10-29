import { Link } from 'react-router-dom';
import { successProfiles } from '../data/successProfiles';
import { CaseStudyDiagram } from '../components/CaseStudyDiagram';
export default function SuccessProfilesPage() {
  return (
    <>
      <section className="page-hero container">
        <p className="eyebrow">Success Profiles / Enterprise technology advisory</p>
        <h1>
          Complex environments.
          <br />
          <span>Clearer technology decisions.</span>
        </h1>
        <p className="lede">
          Explore the operating requirements, engineering considerations, and commercial decisions
          behind six anonymized enterprise engagement profiles.
        </p>
        <p className="fine-print">
          Profiles describe supplied engagement scope. Evaluation paths are conceptual;
          implementation milestones and measured benefits are included only when substantiated.
        </p>
      </section>
      <section className="container section case-library" aria-label="Enterprise case studies">
        {successProfiles.map((profile, i) => (
          <article key={profile.id} className="case-study">
            <header>
              <p className="eyebrow">
                0{i + 1} / {profile.industry}
              </p>
              <p className="case-category">{profile.category}</p>
              <h2>{profile.customer}</h2>
              <p className="case-title">{profile.title}</p>
              <p>{profile.challenge}</p>
            </header>
            <CaseStudyDiagram profile={profile} />
            <details className="case-expansion">
              <summary>
                View Full Case Study<span className="sr-only"> — {profile.customer}</span>
              </summary>
              <div className="case-sections">
                <section>
                  <p className="eyebrow">01 / Context</p>
                  <h3>Customer Environment</h3>
                  <p>{profile.environment}</p>
                </section>
                <section>
                  <p className="eyebrow">02 / Operating considerations</p>
                  <h3>Business Challenges</h3>
                  <p>{profile.considerations}</p>
                </section>
                <section className="case-wide">
                  <p className="eyebrow">03 / Conceptual approach</p>
                  <h3>Solution & Execution</h3>
                  <p className="case-note">
                    The following maps requirements to a proposed evaluation and planning approach.
                    It does not assert completed implementation.
                  </p>
                  <div className="case-approach">
                    {profile.approach.map((item) => (
                      <div key={item.gap}>
                        <h4>{item.gap}</h4>
                        <p>{item.response}</p>
                      </div>
                    ))}
                  </div>
                </section>
                <section>
                  <p className="eyebrow">04 / Evidence boundary</p>
                  <h3>Results & Business Value</h3>
                  <p>{profile.value}</p>
                </section>
                <section>
                  <p className="eyebrow">05 / Design interpretation</p>
                  <h3>Technical Architecture</h3>
                  <p>
                    {profile.diagram.title} connects{' '}
                    {profile.diagram.stages.join(', ').toLowerCase()}. The visual above explains the
                    decision sequence; it does not identify deployed systems or imply an implemented
                    topology.
                  </p>
                </section>
                <section className="case-wide">
                  <p className="eyebrow">06 / Applying the insight</p>
                  <h3>Key Takeaways</h3>
                  <ul>
                    {profile.takeaways.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
              </div>
            </details>
          </article>
        ))}
      </section>
      <section className="cta-band">
        <div className="container">
          <h2>Facing a Similar Technology Challenge?</h2>
          <p>
            Let’s evaluate your technical requirements, commercial options, and potential
            opportunities for improvement.
          </p>
          <Link
            className="button"
            to="/contact?category=Technology%20Advisory&intent=success-profile"
          >
            Let’s Talk ↗
          </Link>
        </div>
      </section>
    </>
  );
}

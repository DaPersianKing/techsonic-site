import { Link } from 'react-router-dom';
export default function DevelopmentPage() {
  return (
    <>
      <section className="page-hero container">
        <p className="eyebrow">Development & Automation</p>
        <h1>
          Less friction.
          <br />
          <span>More possibility.</span>
        </h1>
        <p className="lede">
          Build the website, application, or connected workflow your business actually needs. Start
          with the operation. Engineer around the people using it.
        </p>
        <div className="actions">
          <Link className="button" to="/contact?category=Custom%20Engineering">
            Discuss a custom project ↗
          </Link>
          <Link className="text-link" to="/website-development">
            Explore website development →
          </Link>
        </div>
      </section>
      <section className="container section service-list">
        {[
          [
            'Business websites',
            'Professional websites, online ordering and booking integrations, and digital storefronts.',
            'Responsive design, accessible interactions, content structure, and a launch and care plan.',
          ],
          [
            'Custom applications',
            'Operational tools designed around the way your team works.',
            'Typed data contracts, permission boundaries, validation, loading and failure states, and acceptance tests.',
          ],
          [
            'API integrations',
            'Connect the systems you already use, with explicit ownership of the data flow.',
            'Authentication design, field mapping, bounded retries, monitoring, and reconciliation paths.',
          ],
          [
            'Workflow automation & AI',
            'Automate repetitive work while keeping important decisions accountable.',
            'Documented triggers, review gates, exception queues, audit trails, and operational handover.',
          ],
        ].map(([title, scope, output], i) => (
          <article key={title}>
            <span className="index">0{i + 1}</span>
            <div>
              <h2>{title}</h2>
              <p>{scope}</p>
            </div>
            <div>
              <h3>Built for operation</h3>
              <p>{output}</p>
            </div>
          </article>
        ))}
      </section>
      <section className="cta-band">
        <div className="container">
          <p className="eyebrow">Discover → design → build → validate → support</p>
          <h2>
            A useful solution starts
            <br />
            with a specific problem.
          </h2>
          <Link className="button" to="/contact?category=Custom%20Engineering">
            Tell us what’s getting in the way ↗
          </Link>
        </div>
      </section>
    </>
  );
}

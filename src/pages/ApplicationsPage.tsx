import { Link } from 'react-router-dom';
import { applications } from '../data/showcases';
import { ShowcaseImage } from '../components/ShowcaseImage';
export default function ApplicationsPage() {
  return (
    <>
      <section className="page-hero container">
        <p className="eyebrow">Custom Applications</p>
        <h1>
          Purpose-Built Applications.
          <br />
          <span>Real Business Problems.</span>
        </h1>
        <p className="lede">
          Explore custom software and AI-enabled applications designed to support technology
          sourcing, telecommunications operations, business intelligence, and technical
          decision-making.
        </p>
      </section>
      <section className="container section showcase-list">
        {applications.map((app, i) => (
          <article className="showcase-row" key={app.id}>
            <ShowcaseImage directory="applications" id={app.id} title={app.name} />
            <div className="showcase-copy">
              <p className="eyebrow">
                0{i + 1} / {app.category}
              </p>
              <h2>{app.name}</h2>
              {app.id === 'supplier-intel-engine' && (
                <p className="status-badge">Under Development</p>
              )}
              <p>{app.description}</p>
              <h3>Focus areas</h3>
              <ul>
                {app.focus.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Link
                className="text-link"
                to={`/contact?category=Custom%20Engineering&intent=${app.id === 'supplier-intel-engine' ? 'application-status' : 'application-demo'}&application=${encodeURIComponent(app.name)}`}
              >
                {app.id === 'supplier-intel-engine'
                  ? 'Discuss development status'
                  : 'Discuss this application'}{' '}
                →
              </Link>
            </div>
          </article>
        ))}
      </section>
      <section className="cta-band">
        <div className="container">
          <h2>Interested in a Demo or Trial Access?</h2>
          <p>
            Tell us which application you’re interested in and what you’re looking to accomplish.
            We’ll discuss available demonstrations, development status, and potential fit.
          </p>
          <p className="fine-print">
            Availability is discussed individually. Supplier Intel Engine is under development; no
            demo or trial is offered for it here.
          </p>
          <Link
            className="button"
            to="/contact?category=Custom%20Engineering&intent=application-demo"
          >
            Let’s Talk ↗
          </Link>
        </div>
      </section>
    </>
  );
}

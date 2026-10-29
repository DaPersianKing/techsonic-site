import { Link } from 'react-router-dom';
import { advisoryServices } from '../data/content';
import { AdvisoryProcess } from '../components/AdvisoryProcess';
export default function AdvisoryPage() {
  return (
    <>
      <section className="page-hero container">
        <p className="eyebrow">Technology Advisory & Solutions</p>
        <h1>
          Engineering depth.
          <br />
          <span>Commercial perspective.</span>
        </h1>
        <p className="lede">
          From the architecture to the agreement, make the important decisions with a clear view of
          requirements, alternatives, and tradeoffs.
        </p>
        <Link className="button" to="/contact?category=Technology%20Advisory">
          Talk to a Technology Advisor ↗
        </Link>
      </section>
      <section id="advisory" className="container section service-list">
        {advisoryServices.map((service, i) => (
          <article key={service.title}>
            <span className="index">0{i + 1}</span>
            <div>
              <h2>{service.title}</h2>
              <p>{service.scope}</p>
            </div>
            <div>
              <h3>What you can expect</h3>
              <p>{service.output}</p>
            </div>
          </article>
        ))}
      </section>
      <section className="container section split">
        <div>
          <p className="eyebrow">A structured way forward</p>
          <h2>
            Clear outputs.
            <br />
            At every stage.
          </h2>
          <p>
            Scope, ownership, deliverables, and acceptance criteria are agreed for each engagement.
          </p>
        </div>
        <AdvisoryProcess />
      </section>
      <section id="ecosystem" className="section pale">
        <div className="container split">
          <div>
            <p className="eyebrow">Supplier ecosystem</p>
            <h2>
              Broader options.
              <br />A disciplined evaluation.
            </h2>
          </div>
          <div className="prose">
            <p>
              Technology services distributor (TSD), cloud service provider (CSP), and hyperscaler
              ecosystems support evaluation and sourcing across network, cloud, security,
              communications, SaaS, and AI.
            </p>
            <p>
              We compare solution fit, service availability, support responsibilities, and
              commercial terms. Access and contracting routes depend on the supplier, service,
              geography, and engagement.
            </p>
            <p>
              No blanket certification, direct partnership, resale authorization, or preferential
              rate is implied. Relevant relationship and commercial disclosures belong in the
              engagement discussion.
            </p>
            <Link to="/tools" className="text-link">
              Explore the planning tools →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

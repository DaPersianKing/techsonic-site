import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { AdvisoryProcess } from '../components/AdvisoryProcess';
import { Engineering } from '../components/Engineering';
import { Engagements } from '../components/Engagements';
import { positioning } from '../data/content';
import { useSectionReveal } from '../lib/useSectionReveal';
export default function HomePage() {
  useSectionReveal();
  return (
    <>
      <section className="hero container">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="blue-rule" /> Business priorities. Technical clarity.
          </p>
          <h1>
            Technology Advisory.
            <br />
            <span>Solutions.</span>
            <br />
            Engineering.
          </h1>
          <p className="lede">
            We help businesses make better technology decisions, negotiate stronger commercial
            terms, and build solutions that solve real operational problems.
          </p>
          <div className="actions">
            <Link className="button" to="/contact?category=Technology%20Advisory">
              Talk to a Technology Advisor <ArrowUpRight size={18} aria-hidden />
            </Link>
            <Link className="text-link" to="/advisory">
              Explore Our Solutions <ArrowRight size={18} aria-hidden />
            </Link>
          </div>
        </div>
        <AdvisoryProcess />
      </section>
      <div className="capability-strip">
        <div className="container">
          NETWORKING <span>Cloud</span> CYBERSECURITY <span>Communications</span> SaaS{' '}
          <span>AI</span>
        </div>
      </div>
      <section id="solutions" className="section container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Two disciplines. One connected approach.</p>
            <h2>
              Source the right technology.
              <br />
              Build the right solution.
            </h2>
          </div>
          <p>
            Technical guidance and commercial expertise, from the first requirement to what comes
            next.
          </p>
        </div>
        <div className="business-lines">
          <Link to="/advisory" className="business-line primary-line">
            <span className="eyebrow">01 / Our core practice</span>
            <h3>
              Technology Advisory
              <br />& Solutions
            </h3>
            <p>
              Evaluate suppliers, design resilient infrastructure, negotiate agreements, and put the
              right technology to work.
            </p>
            <ul>
              <li>Networking, cloud & cybersecurity</li>
              <li>Communications, SaaS & AI</li>
              <li>Sourcing, contracts & lifecycle optimization</li>
            </ul>
            <span className="text-link">
              Explore advisory <ArrowUpRight aria-hidden />
            </span>
          </Link>
          <Link to="/development" className="business-line">
            <span className="eyebrow">02 / Built around your business</span>
            <h3>
              Development
              <br />& Automation
            </h3>
            <p>
              Websites, applications, and connected workflows that make everyday operations work
              better.
            </p>
            <ul>
              <li>Business websites & digital storefronts</li>
              <li>Custom applications & API integrations</li>
              <li>Workflow automation & AI-enabled processes</li>
            </ul>
            <span className="text-link">
              Explore development <ArrowUpRight aria-hidden />
            </span>
          </Link>
        </div>
      </section>
      <section className="mission-section section" aria-labelledby="mission-title">
        <div className="container mission-inner">
          <div>
            <p className="eyebrow">Our mission</p>
            <h2 id="mission-title">
              Make technology work for the business. Not the other way around.
            </h2>
          </div>
          <p>
            We exist to help organizations make confident technology decisions, eliminate
            unnecessary complexity, and turn technical investments into measurable business value
            through independent-minded advisory, thoughtful engineering, and practical execution.
          </p>
        </div>
      </section>
      <Engineering />
      <Engagements />
      <section id="ai-tools" className="tools-promo section">
        <div className="container split">
          <div>
            <p className="eyebrow">Make the assumptions visible</p>
            <h2>
              Better questions.
              <br />
              More informed decisions.
            </h2>
            <p>
              Practical planning tools for the technical and commercial details that matter. Your
              inputs, transparent calculations, actionable next steps.
            </p>
            <Link className="button" to="/tools">
              Open the planning tools <ArrowUpRight size={18} aria-hidden />
            </Link>
          </div>
          <div className="tool-directory">
            {[
              ['01', 'Circuit & contract risk', 'Review four key contract controls.'],
              ['02', 'SLA credit calculator', 'Apply the terms in your agreement.'],
              ['03', 'Bandwidth planner', 'Model capacity and resilience.'],
              ['04', 'Telecom cost comparison', 'Compare the full contract cost.'],
            ].map(([n, name, detail], i) => (
              <Link key={n} to={`/tools#${['risk', 'sla', 'bandwidth', 'cost'][i]}`}>
                <span>{n}</span>
                <div>
                  <h3>{name}</h3>
                  <p>{detail}</p>
                </div>
                <ArrowUpRight size={20} aria-hidden />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section id="about" className="section container split">
        <div>
          <p className="eyebrow">About Techsonic LLC</p>
          <h2>
            Business needs.
            <br />
            Technical execution.
            <br />
            <span className="blue-text">Connected.</span>
          </h2>
        </div>
        <div className="prose">
          <p>{positioning}</p>
          <p>
            Through our technology distribution, cloud service provider, and hyperscaler ecosystems,
            we connect organizations with the right solutions while providing technical guidance,
            competitive sourcing, and commercial expertise.
          </p>
          <p>
            For small and midsize businesses, we also deliver website and application development,
            systems integration, workflow automation, and AI-enabled solutions designed to improve
            operations and support growth.
          </p>
          <p>
            From sourcing the right technology to building the right solution, Techsonic bridges the
            gap between business needs and technical execution.
          </p>
          <Link className="text-link" to="/intelligence">
            Read the Technology Intelligence Brief <ArrowRight size={18} aria-hidden />
          </Link>
        </div>
      </section>
      <section className="cta-band">
        <div className="container">
          <p className="eyebrow">Let’s move your next decision forward</p>
          <h2>
            What does your business
            <br />
            need to do next?
          </h2>
          <Link className="button" to="/contact">
            Start a conversation <ArrowUpRight size={18} aria-hidden />
          </Link>
        </div>
      </section>
    </>
  );
}

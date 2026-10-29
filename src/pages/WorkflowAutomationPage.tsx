import { Link } from 'react-router-dom';
import { workflows } from '../data/showcases';
import { ShowcaseImage } from '../components/ShowcaseImage';
export default function WorkflowAutomationPage() {
  return (
    <>
      <section className="page-hero container">
        <p className="eyebrow">Workflow Automation</p>
        <h1>
          Automate the Work.
          <br />
          <span>Keep Control of the Outcome.</span>
        </h1>
        <p className="lede">
          Connect business systems, process information, reduce repetitive work, and introduce
          intelligent automation where it improves operational efficiency.
        </p>
      </section>
      <section className="container section showcase-list">
        {workflows.map((flow, i) => (
          <article className="showcase-row" key={flow.id}>
            <ShowcaseImage directory="workflows" id={flow.id} title={flow.title} />
            <div className="showcase-copy">
              <p className="eyebrow">0{i + 1} / Reference workflow</p>
              <h2>{flow.title}</h2>
              <h3>Business challenge</h3>
              <p>{flow.challenge}</p>
              <details>
                <summary>Explore the technical approach</summary>
                <ol>
                  {flow.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
                <p>
                  Define permissions, validation, exception handling, and human approval boundaries
                  before connecting production systems.
                </p>
              </details>
              <h3>Business value</h3>
              <p>{flow.value}</p>
              {flow.id === 'ai-assistant-architecture' && (
                <details>
                  <summary>How the Knowledge Engine Works</summary>
                  <p>
                    Documents are ingested and divided into chunks. Embeddings represent those
                    chunks in vector storage. Semantic retrieval selects relevant material to ground
                    a response. Source references, access controls, and human review remain
                    essential; retrieval does not guarantee correctness.
                  </p>
                </details>
              )}
              <p className="fine-print">
                Illustrative architecture. Any dashboard values in the graphic are examples, not
                measured customer results.
              </p>
              <Link
                className="text-link"
                to={`/contact?category=Custom%20Engineering&intent=workflow-automation&workflow=${encodeURIComponent(flow.title)}`}
              >
                Discuss this workflow →
              </Link>
            </div>
          </article>
        ))}
      </section>
      <section className="cta-band">
        <div className="container">
          <h2>Have a Process That Should Be Automated?</h2>
          <p>
            Let’s evaluate the workflow, integration requirements, and business case to determine a
            practical implementation approach.
          </p>
          <Link
            className="button"
            to="/contact?category=Custom%20Engineering&intent=workflow-automation"
          >
            Let’s Talk ↗
          </Link>
        </div>
      </section>
    </>
  );
}

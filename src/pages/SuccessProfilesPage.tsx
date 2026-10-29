import { Link } from 'react-router-dom';
const profiles = [
  {
    industry: 'Manufacturing',
    name: 'Fortune 500 Global Manufacturer',
    title: 'Enterprise Mobility & Network Transformation',
    metrics: [
      ['Engagement MRR', '≈ $80K'],
      ['Approximate TCV', '≈ $2.9M'],
    ],
    scope: [
      'Enterprise mobility',
      'Carrier sourcing',
      'Multi-location network strategy',
      'Infrastructure modernization',
    ],
    description:
      'Enterprise mobility sourcing, commercial negotiation, and network strategy across a complex manufacturing environment.',
  },
  {
    industry: 'Grocery retail',
    name: 'Major Multi-Brand Grocery Retailer',
    title: 'Communications & Multi-Site Network Strategy',
    metrics: [
      ['Communications engagement ARR', '≈ $450K'],
      ['Separate network initiative MRR', '≈ $36K'],
      ['Separate network initiative TCV', '≈ $1.3M'],
    ],
    scope: [
      'UCaaS and CCaaS',
      'Enterprise voice modernization',
      'Store communications',
      'Multi-site network transformation',
    ],
    description:
      'Two separate commercial references: enterprise communications and a distinct network transformation initiative. Figures are not combined.',
  },
  {
    industry: 'Financial services',
    name: 'National Financial Services Organization',
    title: 'Enterprise Connectivity & Circuit Renewal Strategy',
    metrics: [
      ['Engagement MRR', '≈ $22K'],
      ['Approximate TCV', '≈ $780K'],
    ],
    scope: [
      'DIA',
      'Enterprise connectivity',
      'Carrier evaluations',
      'Circuit renewal strategy',
      'Commercial negotiation',
    ],
    description:
      'Connectivity sourcing and commercial evaluation with attention to circuit renewal decisions.',
  },
  {
    industry: 'Engineering & consulting',
    name: 'Multi-State Engineering & Consulting Firm',
    title: 'Multi-Site Connectivity & Network Modernization',
    metrics: [
      ['Engagement MRR', '≈ $29K'],
      ['Approximate TCV', '≈ $1.05M'],
    ],
    scope: ['Multi-site connectivity', 'MPLS', 'DIA', 'Network modernization', 'Carrier sourcing'],
    description:
      'Carrier sourcing and network modernization considerations across a multi-state operating environment.',
  },
  {
    industry: 'Specialty retail',
    name: 'National Specialty Retail Chain',
    title: 'Distributed Infrastructure & Procurement Strategy',
    metrics: [],
    scope: [
      'Distributed enterprise infrastructure',
      'Multi-location connectivity',
      'Procurement strategy',
      'Carrier evaluation',
      'Contract optimization',
    ],
    description:
      'Evaluation of distributed connectivity requirements, procurement options, and contract considerations.',
  },
  {
    industry: 'Grocery retail',
    name: 'Regional Grocery Retail Organization',
    title: 'Managed Security Sourcing',
    metrics: [
      ['Engagement MRR', '≈ $17K'],
      ['Agreement term', '36 months'],
    ],
    scope: [
      'Managed detection and response',
      'Cybersecurity sourcing',
      'Managed security services',
      'Commercial negotiation',
    ],
    description:
      'Managed security sourcing and commercial evaluation for a regional retail environment.',
  },
];
export default function SuccessProfilesPage() {
  return (
    <>
      <section className="page-hero container">
        <p className="eyebrow">Success Profiles</p>
        <h1>
          Real Challenges.
          <br />
          <span>Practical Solutions. Lasting Impact.</span>
        </h1>
        <p className="lede">
          Explore complex technology engagements across enterprise connectivity, communications,
          cybersecurity, and infrastructure modernization. Each profile highlights the technical
          requirements, commercial strategy, and business considerations behind the engagement.
        </p>
        <p className="fine-print">
          Anonymized professional engagement experience. Commercial references are approximate
          figures supplied for these profiles; they are not savings or a claim of exclusive
          Techsonic delivery. MRR means monthly recurring revenue, ARR annual recurring revenue, and
          TCV total contract value. Deployment outcomes are stated only where supported.
        </p>
      </section>
      <section className="container section success-profiles">
        {profiles.map((profile, i) => (
          <article key={profile.name} className="success-profile">
            <p className="eyebrow">
              0{i + 1} / {profile.industry}
            </p>
            <h2>{profile.name}</h2>
            <h3>{profile.title}</h3>
            <dl className="profile-metrics">
              {profile.metrics.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <p>{profile.description}</p>
            <details>
              <summary>View Engagement Details</summary>
              <div className="profile-details">
                <div>
                  <h4>Business challenge</h4>
                  <p>{profile.description}</p>
                </div>
                <div>
                  <h4>Technology requirements</h4>
                  <ul>
                    {profile.scope.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4>Advisory and sourcing strategy</h4>
                  <p>
                    Evaluation scope: {profile.scope.join(', ').toLowerCase()}. Supplier identities
                    and confidential engagement details are omitted.
                  </p>
                </div>
                <div>
                  <h4>Commercial considerations</h4>
                  <p>
                    {profile.metrics.length
                      ? 'The figures above describe separate engagement revenue or contract-value references, not realized or projected savings. No contract value is derived from rounded monthly figures.'
                      : 'No financial result is published for this profile.'}
                  </p>
                </div>
                <div>
                  <h4>Technical approach</h4>
                  <p>
                    Focus areas are listed above. Deployed topology, product selections, and
                    implementation milestones are not asserted without supporting records.
                  </p>
                </div>
                <div>
                  <h4>Engagement outcome</h4>
                  <p>
                    Scope and commercial references are provided where available. Completed
                    migration, realized savings, and measured operational outcomes are not
                    specified.
                  </p>
                </div>
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

import { Link } from 'react-router-dom';

const resources: Record<string, { to: string; label: string; detail: string }[]> = {
  '/advisory': [
    {
      to: '/tools',
      label: 'Technology planning tools',
      detail:
        'Review contract controls, SLA credits, capacity, and costs before comparing suppliers.',
    },
    {
      to: '/success-profiles',
      label: 'Enterprise success profiles',
      detail: 'See how advisory decisions connect to technical delivery in anonymized engagements.',
    },
    {
      to: '/development',
      label: 'Development and automation',
      detail:
        'Connect technology sourcing with applications and integrations built around your operations.',
    },
  ],
  '/development': [
    {
      to: '/advisory',
      label: 'Technology advisory',
      detail: 'Align the infrastructure and supplier decisions behind your next application.',
    },
    {
      to: '/success-profiles',
      label: 'Explore success profiles',
      detail: 'Review the technical and operational context behind enterprise engagements.',
    },
    {
      to: '/tools',
      label: 'Plan capacity and costs',
      detail: 'Make assumptions explicit before defining a development scope.',
    },
  ],
  '/tools': [
    {
      to: '/advisory',
      label: 'Discuss your technology options',
      detail: 'Bring your planning assumptions into a sourcing or infrastructure review.',
    },
    {
      to: '/success-profiles',
      label: 'Explore enterprise engagements',
      detail: 'See how connectivity and communications decisions fit into broader projects.',
    },
    {
      to: '/development',
      label: 'Build a tailored workflow',
      detail: 'Turn repeated planning and operational tasks into connected applications.',
    },
  ],
  '/success-profiles': [
    {
      to: '/advisory',
      label: 'Explore our advisory approach',
      detail: 'Understand our evaluation, sourcing, negotiation, and implementation process.',
    },
    {
      to: '/tools',
      label: 'Test your planning assumptions',
      detail: 'Review bandwidth, service credits, contract controls, and telecom costs.',
    },
    {
      to: '/development',
      label: 'Explore custom development',
      detail: 'Connect infrastructure decisions to business applications and automation.',
    },
  ],
  '/contact': [
    {
      to: '/advisory',
      label: 'Technology advisory services',
      detail: 'Review the scope of a sourcing, network, cloud, or security discussion.',
    },
    {
      to: '/development',
      label: 'Development services',
      detail: 'Explore websites, custom applications, and workflow automation.',
    },
    {
      to: '/success-profiles',
      label: 'Success profiles',
      detail: 'Read anonymized examples before discussing your requirements.',
    },
  ],
};

export function RelatedResources({ path }: { path: string }) {
  const items = resources[path.replace(/\/+$/, '')];
  if (!items) return null;
  return (
    <section className="container section related-resources" aria-labelledby="related-title">
      <h2 id="related-title">Plan your next step</h2>
      <div className="related-grid">
        {items.map((item) => (
          <article key={item.to}>
            <h3>
              <Link to={item.to}>{item.label}</Link>
            </h3>
            <p>{item.detail}</p>
          </article>
        ))}
      </div>
      {path !== '/contact' && (
        <Link className="text-link" to="/contact">
          Discuss your project with Techsonic →
        </Link>
      )}
    </section>
  );
}

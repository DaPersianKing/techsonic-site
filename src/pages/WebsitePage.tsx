import { useState } from 'react';
import { Link } from 'react-router-dom';
import { portfolio } from '../data/content';
const packages = [
  {
    name: 'Standard',
    intro: 'A professional presence. A clear first impression.',
    items: [
      '1–3 thoughtfully designed pages',
      'Mobile-friendly layout',
      'Contact form setup',
      'Basic search setup',
      'Managed hosting & HTTPS',
    ],
    option: 'Optional: additional content and integrations, quoted to scope.',
  },
  {
    name: 'Growth',
    intro: 'Make the next step easier for your customers.',
    items: [
      'Everything in Standard',
      'Up to 5 custom pages',
      'Booking or menu integration with a supported platform',
      'Review-request link setup',
      '30 minutes per month of content edits',
    ],
    option: 'Optional: advanced lead capture and customer engagement integrations.',
  },
  {
    name: 'VIP',
    intro: 'Bring more of your business online.',
    items: [
      'Everything in Growth',
      'Store or catering setup with a supported platform',
      'Catalog setup within agreed scope',
      'Asset selection & preparation',
      'Priority launch scheduling',
    ],
    option:
      'Custom quoted: custom integrations, workflow automation, and ongoing optimization beyond agreed care.',
  },
];
export default function WebsitePage() {
  const [preview, setPreview] = useState<'desktop' | 'mobile'>('desktop');
  return (
    <>
      <section className="page-hero container">
        <p className="eyebrow">Websites for growing businesses</p>
        <h1>
          Your business has character.
          <br />
          <span>Your website should, too.</span>
        </h1>
        <p className="lede">
          Professional websites for the way your customers browse, book, inquire, and shop. Designed
          with care. Engineered to work.
        </p>
        <div className="actions">
          <Link className="button" to="/contact?category=Website%20Development&intent=consultation">
            Schedule Website Consultation ↗
          </Link>
          <Link className="text-link" to="/contact?category=Website%20Development&intent=estimate">
            Request Project Estimate →
          </Link>
        </div>
      </section>
      <section className="container section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Real websites. Real interactions.</p>
            <h2>See what’s possible.</h2>
          </div>
          <div className="segmented">
            <button aria-pressed={preview === 'desktop'} onClick={() => setPreview('desktop')}>
              Desktop
            </button>
            <button aria-pressed={preview === 'mobile'} onClick={() => setPreview('mobile')}>
              Mobile
            </button>
          </div>
        </div>
        <div className="portfolio">
          {portfolio.map((site) => (
            <article key={site.id}>
              <div
                className={`portfolio-preview image-zoom-container image-zoom-container--portfolio ${preview}`}
              >
                <img
                  src={`/assets/portfolio/${site.id}-${preview}.jpg`}
                  alt={`${site.name} live website, ${preview} screenshot`}
                  loading="lazy"
                  width={preview === 'desktop' ? 1265 : 375}
                  height={preview === 'desktop' ? 712 : 812}
                />
              </div>
              <div className="portfolio-copy">
                <span className="eyebrow">{site.industry} / Website demo</span>
                <h3>{site.name}</h3>
                <p>{site.description}</p>
                <p>
                  <strong>Demonstrated:</strong> {site.capabilities}
                </p>
                <div className="actions">
                  <a className="text-link" href={site.url} target="_blank" rel="noreferrer">
                    View Live Demo ↗
                    <span className="sr-only"> — {site.name}, opens in a new tab</span>
                  </a>
                  <Link
                    className="text-link"
                    to={`/contact?category=Website%20Development&demo=${site.id}`}
                  >
                    Request Similar Website →<span className="sr-only"> — {site.name}</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="fine-print">
          Actual demo screenshots captured October 28, 2026. Fictional businesses; demonstrations do
          not process real payments, orders, bookings, or inquiries. Production integrations are
          separately scoped.
        </p>
      </section>
      <section className="pale section">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Find your fit</p>
              <h2>Three ways to move forward.</h2>
            </div>
            <p>
              A one-time build with ongoing care.
              <br />
              Final scope is agreed before work begins.
            </p>
          </div>
          <div className="packages">
            {packages.map((tier, i) => (
              <article key={tier.name}>
                <span className="eyebrow">
                  0{i + 1} / {tier.name}
                </span>
                <h3>{tier.name}</h3>
                <p>{tier.intro}</p>
                <h4>Included</h4>
                <ul>
                  {tier.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className="fine-print">{tier.option}</p>
                <Link
                  className="button secondary"
                  to={`/contact?category=Website%20Development&package=${tier.name}`}
                >
                  Discuss {tier.name} ↗
                </Link>
              </article>
            ))}
          </div>
          <p className="fine-print">
            Third-party subscriptions, domains, payment processing, and messaging fees are
            additional. Page, catalog, revision, integration, and service limits are agreed before
            work begins. Content edits exclude new features and do not roll over.
          </p>
        </div>
      </section>
    </>
  );
}

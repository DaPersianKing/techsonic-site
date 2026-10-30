import { routeMetadata } from './metadata.ts';

export const productionOrigin = 'https://www.gotechsonic.com';

export function canonicalUrl(path: string): string {
  const pathname = new URL(path, productionOrigin).pathname.replace(/\/+$/, '') || '/';
  return `${productionOrigin}${pathname}`;
}

export function breadcrumbs(path: string) {
  const pathname = new URL(canonicalUrl(path)).pathname;
  const meta = routeMetadata[pathname];
  if (!meta || pathname === '/') return [];
  return [
    { name: 'Home', url: `${productionOrigin}/` },
    { name: meta.title, url: canonicalUrl(pathname) },
  ];
}

export function structuredData(path: string) {
  const organizationId = `${productionOrigin}/#organization`;
  const trail = breadcrumbs(path);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Organization', 'ProfessionalService'],
        '@id': organizationId,
        name: 'Techsonic',
        legalName: 'Techsonic LLC',
        url: `${productionOrigin}/`,
        logo: `${productionOrigin}/assets/logos/techsonic-official-light-bg.png`,
        email: 'hello@gotechsonic.com',
        telephone: '+14242793586',
        sameAs: ['https://www.linkedin.com/company/gotechsonic'],
        description:
          'Technology advisory, supplier sourcing, website and application development, and workflow automation for businesses.',
      },
      {
        '@type': 'WebSite',
        '@id': `${productionOrigin}/#website`,
        url: `${productionOrigin}/`,
        name: 'Techsonic LLC',
        publisher: { '@id': organizationId },
        inLanguage: 'en',
      },
      ...(trail.length
        ? [
            {
              '@type': 'BreadcrumbList',
              '@id': `${canonicalUrl(path)}#breadcrumbs`,
              itemListElement: trail.map((item, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: item.name,
                item: item.url,
              })),
            },
          ]
        : []),
    ],
  };
}

/** Escape data before embedding it in an HTML script element. */
export function serializedStructuredData(path: string): string {
  return JSON.stringify(structuredData(path)).replace(/</g, '\\u003c');
}

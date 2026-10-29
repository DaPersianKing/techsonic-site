export interface SuccessProfile {
  id: string;
  industry: string;
  customer: string;
  title: string;
  category: string;
  environment: string;
  challenge: string;
  considerations: string;
  approach: { gap: string; response: string }[];
  value: string;
  takeaways: string[];
  diagram: {
    title: string;
    stages: [string, string, string];
    annotations: [string, string, string];
  };
}

// Background and scope: user-supplied V2.1 engagement descriptions.
// Design paths are conceptual. No implementation or benefit measurement is inferred.
export const successProfiles: SuccessProfile[] = [
  {
    id: 'manufacturing',
    industry: 'Manufacturing',
    customer: 'Fortune 500 Global Manufacturer',
    title: 'Aligning enterprise mobility and network decisions',
    category: 'Mobility & network strategy',
    environment:
      'A global manufacturing organization with enterprise mobility and a multi-location network strategy in scope. Infrastructure modernization and carrier sourcing form part of the engagement context.',
    challenge:
      'Evaluate enterprise mobility sourcing alongside network strategy across a complex manufacturing environment.',
    considerations:
      'Mobility service requirements and location-level connectivity need a common evaluation framework. Treating them as isolated purchasing decisions can leave operational dependencies and commercial tradeoffs difficult to compare.',
    approach: [
      {
        gap: 'Different service requirements',
        response:
          'Capture mobility use cases and location-level network requirements before comparing carrier options.',
      },
      {
        gap: 'Technical and commercial alternatives',
        response:
          'Evaluate carrier fit, service responsibilities, recurring expense assumptions, and agreement flexibility against the same requirements.',
      },
      {
        gap: 'Modernization dependencies',
        response:
          'Define an infrastructure roadmap and acceptance criteria before proposing a migration sequence.',
      },
    ],
    value:
      'A consistent basis for evaluating mobility, carrier sourcing, and infrastructure modernization together. This is a business-value objective; delivery and performance results have not been substantiated for publication.',
    takeaways: [
      'Start with operating requirements rather than a carrier shortlist.',
      'Link mobility sourcing decisions to the wider network strategy.',
    ],
    diagram: {
      title: 'Mobility and network evaluation',
      stages: ['Operating requirements', 'Carrier evaluation', 'Modernization roadmap'],
      annotations: [
        'Mobility + location needs',
        'Technical fit + terms',
        'Dependencies + acceptance',
      ],
    },
  },
  {
    id: 'grocery-communications',
    industry: 'Grocery retail',
    customer: 'Major Multi-Brand Grocery Retailer',
    title: 'Coordinating communications and network change',
    category: 'UCaaS, CCaaS & connectivity',
    environment:
      'A multi-brand grocery organization with store communications, enterprise voice modernization, UCaaS, CCaaS, and multi-site network transformation in scope. Communications and network work are separate initiatives.',
    challenge:
      'Evaluate communications modernization while keeping the separate network transformation initiative aligned with store and enterprise requirements.',
    considerations:
      'Voice, customer-contact workflows, and site connectivity have different requirements but intersect at service quality and integration boundaries. Combining their evaluation without separating scope can obscure responsibilities and transition dependencies.',
    approach: [
      {
        gap: 'Distinct communications needs',
        response:
          'Gather store voice and contact-center requirements, then evaluate UCaaS and CCaaS against their respective use cases.',
      },
      {
        gap: 'Network dependencies',
        response:
          'Assess connectivity requirements separately, including application traffic and service-quality considerations.',
      },
      {
        gap: 'Cross-initiative coordination',
        response:
          'Identify integration, support ownership, and migration dependencies before agreeing a coordinated transition plan.',
      },
    ],
    value:
      'Clearer scope boundaries between communications and network decisions, with transition dependencies made explicit. This is the evaluation objective, not a verified service-performance improvement.',
    takeaways: [
      'Keep communications and network scope independently comparable.',
      'Coordinate transition dependencies without conflating the two initiatives.',
    ],
    diagram: {
      title: 'Two initiatives, explicit dependencies',
      stages: ['Store + enterprise needs', 'Separate evaluations', 'Transition coordination'],
      annotations: [
        'Voice + contact workflows',
        'UCaaS / CCaaS · network',
        'Integration + support ownership',
      ],
    },
  },
  {
    id: 'financial-connectivity',
    industry: 'Financial services',
    customer: 'National Financial Services Organization',
    title: 'Connecting circuit renewals to operational requirements',
    category: 'DIA & carrier evaluation',
    environment:
      'A national financial services organization evaluating Dedicated Internet Access (DIA), enterprise connectivity, carrier options, and circuit renewal strategy.',
    challenge:
      'Align connectivity sourcing and commercial negotiation with circuit renewal decisions.',
    considerations:
      'Renewal decisions need to account for service requirements as well as agreement timing. Evaluating price alone can leave service scope, transition lead times, and contractual obligations unresolved.',
    approach: [
      {
        gap: 'Circuit and renewal requirements',
        response:
          'Establish an inventory of the circuits under review, service requirements, and relevant agreement dates.',
      },
      {
        gap: 'Comparable carrier options',
        response:
          'Evaluate DIA proposals against technical requirements, availability evidence, support responsibilities, and total cost assumptions.',
      },
      {
        gap: 'Renewal versus transition',
        response:
          'Compare renewal terms with migration dependencies before establishing a negotiation and decision timetable.',
      },
    ],
    value:
      'A requirement-led basis for circuit renewal and carrier comparison. Reduced expense, improved availability, and completed migrations are not asserted without supporting measurements.',
    takeaways: [
      'Bring service requirements into renewal discussions early.',
      'Evaluate transition exposure alongside commercial terms.',
    ],
    diagram: {
      title: 'Circuit renewal decision path',
      stages: ['Circuit requirements', 'DIA carrier comparison', 'Renew or transition'],
      annotations: [
        'Service scope + dates',
        'Availability + support + cost',
        'Terms + transition dependencies',
      ],
    },
  },
  {
    id: 'engineering-network',
    industry: 'Engineering & consulting',
    customer: 'Multi-State Engineering & Consulting Firm',
    title: 'Evaluating the path from legacy WAN to modernization',
    category: 'MPLS, DIA & multi-site WAN',
    environment:
      'A multi-state engineering and consulting firm with multi-site connectivity, MPLS, DIA, network modernization, and carrier sourcing in scope. A site count and deployed topology are not specified.',
    challenge:
      'Compare multi-site network modernization options while accounting for MPLS and DIA requirements.',
    considerations:
      'A WAN change needs to address application reachability and site operating needs, not simply replace an access service. Unexamined dependencies can complicate migration and support ownership.',
    approach: [
      {
        gap: 'Current-state dependencies',
        response:
          'Document application connectivity requirements and the role of MPLS and Internet access at each site under review.',
      },
      {
        gap: 'Modernization alternatives',
        response:
          'Compare carrier options and proposed service designs against reachability, service management, and commercial requirements.',
      },
      {
        gap: 'Migration exposure',
        response:
          'Define a phased migration proposal with validation and rollback criteria before implementation approval.',
      },
    ],
    value:
      'A structured comparison of WAN modernization paths with migration dependencies visible. The available scope does not establish an implemented future-state topology or measured resiliency improvement.',
    takeaways: [
      'Understand application dependencies before changing WAN services.',
      'Make validation and rollback part of the proposed migration design.',
    ],
    diagram: {
      title: 'WAN modernization planning',
      stages: ['Current-state discovery', 'MPLS / DIA evaluation', 'Phased migration proposal'],
      annotations: [
        'Site + application dependencies',
        'Service design + carrier fit',
        'Validation + rollback criteria',
      ],
    },
  },
  {
    id: 'specialty-retail',
    industry: 'Specialty retail',
    customer: 'National Specialty Retail Chain',
    title: 'Making distributed connectivity sourcing comparable',
    category: 'Distributed infrastructure & procurement',
    environment:
      'A national specialty retail chain with distributed infrastructure, multi-location connectivity, procurement strategy, carrier evaluation, and contract optimization in scope.',
    challenge:
      'Evaluate connectivity requirements and commercial options across a distributed retail environment.',
    considerations:
      'A distributed sourcing exercise needs consistent evaluation criteria while accommodating location-specific needs. Without normalized scope, supplier proposals can be difficult to compare and service responsibilities can remain ambiguous.',
    approach: [
      {
        gap: 'Location-level variation',
        response:
          'Capture site requirements and qualification evidence in a common evaluation matrix.',
      },
      {
        gap: 'Inconsistent proposal scope',
        response:
          'Normalize carrier proposals by service scope, support responsibility, installation assumptions, and recurring costs.',
      },
      {
        gap: 'Contract alignment',
        response:
          'Review material terms, renewal conditions, and transition requirements against the procurement strategy.',
      },
    ],
    value:
      'A clearer basis for supplier selection and contract review across multiple locations. No financial or operational result is published for this profile.',
    takeaways: [
      'Standardize the comparison method, not the assumptions about every site.',
      'Keep support ownership and material contract terms visible.',
    ],
    diagram: {
      title: 'Distributed sourcing evaluation',
      stages: ['Location requirements', 'Qualification matrix', 'Procurement decision'],
      annotations: [
        'Operating needs + service scope',
        'Carrier evidence + comparable bids',
        'Terms + ownership + transition',
      ],
    },
  },
  {
    id: 'regional-security',
    industry: 'Grocery retail',
    customer: 'Regional Grocery Retail Organization',
    title: 'Defining managed detection and response responsibilities',
    category: 'MDR & managed security sourcing',
    environment:
      'A regional grocery retail organization evaluating managed detection and response (MDR), managed security services, and commercial terms.',
    challenge:
      'Evaluate managed security options against the organization’s detection, response, and service requirements.',
    considerations:
      'Managed security evaluation needs to establish what is monitored, who assesses an alert, and who can act. Unclear responsibilities can leave response handoffs and service expectations unresolved.',
    approach: [
      {
        gap: 'Security service scope',
        response:
          'Gather detection and response requirements and identify the telemetry and integration dependencies to validate.',
      },
      {
        gap: 'Supplier responsibility',
        response:
          'Compare proposed monitoring, triage, escalation, and customer-approval boundaries across managed service options.',
      },
      {
        gap: 'Operational and commercial fit',
        response:
          'Review service responsibilities and commercial obligations before defining an onboarding and acceptance proposal.',
      },
    ],
    value:
      'Explicit evaluation of managed security scope and response responsibilities. Security-posture improvements, incident outcomes, and deployment completion have not been substantiated for this profile.',
    takeaways: [
      'Evaluate response ownership as carefully as detection capability.',
      'Define integration and approval boundaries before onboarding.',
    ],
    diagram: {
      title: 'Managed response responsibility model',
      stages: ['Security requirements', 'MDR service evaluation', 'Response operating model'],
      annotations: [
        'Scope + telemetry needs',
        'Monitoring + triage + escalation',
        'Customer approvals + ownership',
      ],
    },
  },
];

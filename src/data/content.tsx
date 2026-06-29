import {
  BarChart3,
  ShieldCheck,
  Cpu,
  Globe2,
  Briefcase,
  Layers,
  CheckCircle2,
  Cloud,
  Shield,
  Users,
  Building2,
  Banknote,
  FileText,
  DollarSign
} from 'lucide-react';
import type { ReactNode } from 'react';

export type InfoCard = {
  title: string;
  description: string;
  icon: ReactNode;
};

export type ServiceCard = {
  title: string;
  description: string;
  icon: ReactNode;
  bulletPoints: string[];
};

export const trustStats = [
  { label: 'Ecosystem Sourced', value: '250+ Suppliers', icon: <Globe2 className="h-6 w-6 text-accent" aria-hidden /> },
  { label: 'Advisory Posture', value: '100% Unbiased', icon: <ShieldCheck className="h-6 w-6 text-accent" aria-hidden /> },
  { label: 'Strategic Approach', value: 'Business First', icon: <Briefcase className="h-6 w-6 text-accent" aria-hidden /> },
  { label: 'Platform Core', value: 'AI Sourcing Intel', icon: <Cpu className="h-6 w-6 text-accent" aria-hidden /> }
];

export const advisoryServices: ServiceCard[] = [
  {
    title: 'Network & Connectivity Advisory',
    description: 'Design and source resilient, high-bandwidth connectivity solutions for enterprise environments.',
    icon: <Globe2 className="h-6 w-6 text-accent" aria-hidden />,
    bulletPoints: [
      'Dedicated Internet Access (DIA)',
      'Broadband & Private Ethernet',
      'SD-WAN Architecture Design',
      'Carrier Diversification Strategy'
    ]
  },
  {
    title: 'Cloud & Infrastructure Advisory',
    description: 'Navigate public, private, and hybrid cloud migrations, colocation sourcing, and data center services.',
    icon: <Cloud className="h-6 w-6 text-accent" aria-hidden />,
    bulletPoints: [
      'Hybrid Cloud Migrations',
      'Colocation Sourcing & Audits',
      'Disaster Recovery Planning',
      'Lifecycle Management Services'
    ]
  },
  {
    title: 'Cybersecurity Advisory',
    description: 'Audit risk postures, evaluate threats, and source robust cybersecurity and identity platforms.',
    icon: <Shield className="h-6 w-6 text-accent" aria-hidden />,
    bulletPoints: [
      'Identity & Access Sourcing (IAM)',
      'Threat Prevention & ZTNA',
      'MSSP Audits & Sourcing',
      'Compliance Framework Mapping'
    ]
  },
  {
    title: 'UCaaS & CCaaS Advisory',
    description: 'Modernize communications infrastructure and customer experience solutions through detailed provider scoring.',
    icon: <Users className="h-6 w-6 text-accent" aria-hidden />,
    bulletPoints: [
      'UCaaS Sourcing & Evaluation',
      'CCaaS Vendor Comparison',
      'Omnichannel Slicing Support',
      'Communications Cost Control'
    ]
  },
  {
    title: 'Technology Expense Optimization',
    description: 'Audit active services, reconcile telecom invoices, eliminate waste, and optimize recurring costs.',
    icon: <Banknote className="h-6 w-6 text-accent" aria-hidden />,
    bulletPoints: [
      'Invoice Auditing & Cost Control',
      'Contract Waste Elimination',
      'Peer Agreement Benchmarking',
      'Monthly Expense Visibility'
    ]
  },
  {
    title: 'Supplier & Contract Strategy',
    description: 'Ensure commercial alignment, optimal SLAs, and pricing leverage across all supplier agreements.',
    icon: <Briefcase className="h-6 w-6 text-accent" aria-hidden />,
    bulletPoints: [
      'Ecosystem Evaluation Matrices',
      'Commercial SLA Negotiations',
      'Pricing Leverage Strategy',
      'Bid Management & Scoring'
    ]
  }
];

export const technologySolutions: InfoCard[] = [
  {
    title: 'Reduce IT Spend',
    description: 'Audit active cloud, network, and telecom accounts to find billing errors, eliminate waste, and optimize commercial terms.',
    icon: <DollarSign className="h-5 w-5 text-accent" aria-hidden />
  },
  {
    title: 'Cybersecurity & Identity',
    description: 'Protect corporate assets by sourcing threat detection, identity access management, zero-trust network access, and compliance.',
    icon: <Shield className="h-5 w-5 text-accent" aria-hidden />
  },
  {
    title: 'Network Modernization',
    description: 'Redesign connectivity portfolios utilizing SD-WAN architectures, high-bandwidth DIA circuits, and diverse carrier paths.',
    icon: <Globe2 className="h-5 w-5 text-accent" aria-hidden />
  },
  {
    title: 'Cloud Transformation',
    description: 'Evaluate workloads for migration to public cloud, private hosting configurations, colocation facilities, and hybrid architectures.',
    icon: <Cloud className="h-5 w-5 text-accent" aria-hidden />
  },
  {
    title: 'Unified Communications',
    description: 'Modernize collaboration tools by migrating legacy PBX setups to unified communications platforms (UCaaS).',
    icon: <Users className="h-5 w-5 text-accent" aria-hidden />
  },
  {
    title: 'Contact Center Sourcing',
    description: 'Enhance customer engagement workflows by sourcing omnichannel, cloud-native contact center platforms (CCaaS).',
    icon: <Briefcase className="h-5 w-5 text-accent" aria-hidden />
  },
  {
    title: 'AI Enablement',
    description: 'Analyze, qualify, and source AI-driven workflow engines and automation frameworks that integrate with existing applications.',
    icon: <Cpu className="h-5 w-5 text-accent" aria-hidden />
  },
  {
    title: 'Technology Sourcing',
    description: 'Execute structured, independent, and operator-neutral biddings to ensure competitive contract pricing and commercial terms.',
    icon: <Layers className="h-5 w-5 text-accent" aria-hidden />
  }
];

export const technologyAreas: InfoCard[] = [
  {
    title: 'Connectivity & SD-WAN',
    description: 'DIA, enterprise broadband, private Ethernet, and managed SD-WAN architectures.',
    icon: <Globe2 className="h-5 w-5 text-accent" aria-hidden />
  },
  {
    title: 'Cloud Infrastructure',
    description: 'Public cloud deployments, private cloud hosting configurations, colocation, and hybrid solutions.',
    icon: <Cloud className="h-5 w-5 text-accent" aria-hidden />
  },
  {
    title: 'Cybersecurity & Identity',
    description: 'Threat prevention, Zero Trust Network Access (ZTNA), identity management, and MSSP.',
    icon: <Shield className="h-5 w-5 text-accent" aria-hidden />
  },
  {
    title: 'Enterprise UCaaS & CCaaS',
    description: 'Unified telephony, enterprise conferencing, team collaboration, and omnichannel contact centers.',
    icon: <Users className="h-5 w-5 text-accent" aria-hidden />
  },
  {
    title: 'AI & Sourcing Automation',
    description: 'AI-assisted sourcing strategies, automated qualification, and decision intelligence tools.',
    icon: <Cpu className="h-5 w-5 text-accent" aria-hidden />
  },
  {
    title: 'Lifecycle & Data Center Services',
    description: 'Equipment sourcing, migration support, data center audits, and hybrid lifecycle solutions.',
    icon: <Building2 className="h-5 w-5 text-accent" aria-hidden />
  }
];

export const supplierEcosystem: InfoCard[] = [
  {
    title: 'Independent Positioning',
    description: 'Our advisory recommendations are operator-neutral, aligning 100% with your corporate goals, metrics, and budget.',
    icon: <Shield className="h-5 w-5 text-accent" aria-hidden />
  },
  {
    title: 'Supplier Portfolio Access',
    description: 'Access 250+ top-tier and emerging global providers across network, cloud, cybersecurity, and voice architectures.',
    icon: <Globe2 className="h-5 w-5 text-accent" aria-hidden />
  },
  {
    title: 'Pricing & SLA Leverage',
    description: 'We leverage current contract databases and aggregate purchasing volume to secure tier-1 commercial rates and SLA terms.',
    icon: <Banknote className="h-5 w-5 text-accent" aria-hidden />
  },
  {
    title: 'Lifecycle Implementation Support',
    description: 'We coordinate transition schedules, manage vendor escalations, and support your engineering teams through deployment.',
    icon: <CheckCircle2 className="h-5 w-5 text-accent" aria-hidden />
  },
  {
    title: 'AI-Enhanced Sourcing Intel',
    description: 'Analyze telecom spending, compare provider footprints, and check fiber locations using our decision modules.',
    icon: <Cpu className="h-5 w-5 text-accent" aria-hidden />
  },
  {
    title: 'Business-First Recommendations',
    description: 'We ground technical designs in commercial viability, aligning your architecture with optimization targets.',
    icon: <Briefcase className="h-5 w-5 text-accent" aria-hidden />
  }
];

export const platformModules = [
  {
    title: 'Telecom Invoice Analyzer',
    description: 'A Techsonic Platform module that audits telecom invoices, checks for contract compliance, and uncovers billing errors.',
    icon: <FileText className="h-5 w-5 text-accent" aria-hidden />,
    badge: 'Expense Auditing'
  },
  {
    title: 'Network Qualifier Pro',
    description: 'A Techsonic Platform module that checks fiber maps, provider footprints, and bandwidth availability at enterprise sites.',
    icon: <Globe2 className="h-5 w-5 text-accent" aria-hidden />,
    badge: 'Connectivity Sourcing'
  },
  {
    title: 'StrategyIQ',
    description: 'A Techsonic Platform module that calculates deal leverage, benchmarks supplier rates, and evaluates contract parameters.',
    icon: <BarChart3 className="h-5 w-5 text-accent" aria-hidden />,
    badge: 'Sourcing Strategy'
  },
  {
    title: 'RFP Response Pro',
    description: 'A Techsonic Platform module that automates technical proposal comparisons and scores supplier responses.',
    icon: <Layers className="h-5 w-5 text-accent" aria-hidden />,
    badge: 'Bid Management'
  },
  {
    title: 'Compliance Tracker',
    description: 'A Techsonic Platform module that audits provider security frameworks, compliance certifications, and risk indicators.',
    icon: <ShieldCheck className="h-5 w-5 text-accent" aria-hidden />,
    badge: 'Risk Governance'
  },
  {
    title: 'Meeting Wingman',
    description: 'A Techsonic Platform module that records discovery parameters, highlights vendor details, and generates next steps.',
    icon: <Users className="h-5 w-5 text-accent" aria-hidden />,
    badge: 'Discovery Intelligence'
  }
];

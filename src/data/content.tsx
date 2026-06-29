import {
  Activity,
  BarChart3,
  ShieldCheck,
  Cpu,
  Globe2,
  Briefcase,
  Zap,
  Layers,
  CheckCircle2,
  Cloud,
  Shield,
  Users,
  Building2,
  Banknote,
  Search,
  AlertCircle,
  FileText
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
    description: 'Design and source resilient, high-bandwidth enterprise connectivity solutions.',
    icon: <Globe2 className="h-6 w-6 text-accent" aria-hidden />,
    bulletPoints: [
      'Dedicated Internet Access (DIA)',
      'Enterprise Broadband & Ethernet',
      'SD-WAN Architecture Design',
      'Carrier Diversification Strategy'
    ]
  },
  {
    title: 'Cloud & Infrastructure Advisory',
    description: 'Navigate cloud migration, hybrid architectures, and data center consolidation.',
    icon: <Cloud className="h-6 w-6 text-accent" aria-hidden />,
    bulletPoints: [
      'Public, Private & Hybrid Cloud Sourcing',
      'Colocation & Data Center Selection',
      'Disaster Recovery & Backup Planning',
      'Infrastructure Lifecycle Services'
    ]
  },
  {
    title: 'Cybersecurity Advisory',
    description: 'Evaluate security posture, audit risk vectors, and select top-tier security providers.',
    icon: <Shield className="h-6 w-6 text-accent" aria-hidden />,
    bulletPoints: [
      'Identity & Access Management (IAM)',
      'Threat Prevention & SASE Solutions',
      'Compliance & Governance Frameworks',
      'MSSP Sourcing & Integration'
    ]
  },
  {
    title: 'UCaaS & CCaaS Advisory',
    description: 'Modernize communications infrastructure and customer experience solutions.',
    icon: <Users className="h-6 w-6 text-accent" aria-hidden />,
    bulletPoints: [
      'Unified Communications (UCaaS) Sourcing',
      'Contact Center (CCaaS) Evaluation',
      'Omnichannel Integration Support',
      'Provider Comparison Matrices'
    ]
  },
  {
    title: 'Technology Expense Optimization',
    description: 'Conduct audits, eliminate waste, and optimize recurring technology contracts.',
    icon: <Banknote className="h-6 w-6 text-accent" aria-hidden />,
    bulletPoints: [
      'Telecom & Cloud Bill Reconciliation',
      'Contract Waste Elimination',
      'Benchmarking against Peer Contracts',
      'Continuous Spend Visibility'
    ]
  },
  {
    title: 'Supplier & Contract Strategy',
    description: 'Ensure commercial alignment, optimal SLAs, and pricing leverage across agreements.',
    icon: <Briefcase className="h-6 w-6 text-accent" aria-hidden />,
    bulletPoints: [
      'Vendor Ecosystem Evaluation',
      'Commercial SLA Negotiations',
      'Pricing Leverage Optimizations',
      'Direct Bid Management & Scoring'
    ]
  }
];

export const howTechsonicHelps: InfoCard[] = [
  {
    title: 'Assess Current Environment',
    description: 'We audit your active services, configurations, contracts, and spend to establish an accurate technology baseline.',
    icon: <Search className="h-5 w-5 text-accent" aria-hidden />
  },
  {
    title: 'Identify Gaps & Risks',
    description: 'Our advisory framework identifies performance gaps, single points of failure, compliance issues, and billing errors.',
    icon: <AlertCircle className="h-5 w-5 text-accent" aria-hidden />
  },
  {
    title: 'Compare Supplier Options',
    description: 'We generate objective comparison matrices evaluating engineering capability, coverage, financial stability, and SLAs.',
    icon: <Layers className="h-5 w-5 text-accent" aria-hidden />
  },
  {
    title: 'Create Pricing Leverage',
    description: 'Using current market intelligence and purchasing volume, we secure tier-1 supplier pricing and favorable commercial terms.',
    icon: <Zap className="h-5 w-5 text-accent" aria-hidden />
  },
  {
    title: 'Support Selection & Implementation',
    description: 'We provide technical project coordination to manage transitions, coordinate suppliers, and ensure smooth delivery.',
    icon: <CheckCircle2 className="h-5 w-5 text-accent" aria-hidden />
  },
  {
    title: 'Optimize Post-Deployment',
    description: 'We review invoices for compliance, audit service delivery, and continuously identify optimization opportunities.',
    icon: <Activity className="h-5 w-5 text-accent" aria-hidden />
  }
];

export const technologyAreas: InfoCard[] = [
  {
    title: 'Connectivity & SD-WAN',
    description: 'DIA, broadband, Ethernet, and managed SD-WAN architectures.',
    icon: <Globe2 className="h-5 w-5 text-accent" aria-hidden />
  },
  {
    title: 'Cloud Infrastructure',
    description: 'Public cloud, private cloud hosting, colocation, and hybrid solutions.',
    icon: <Cloud className="h-5 w-5 text-accent" aria-hidden />
  },
  {
    title: 'Cybersecurity & Identity',
    description: 'Threat detection, Zero Trust Network Access (ZTNA), IAM, and MSSP.',
    icon: <Shield className="h-5 w-5 text-accent" aria-hidden />
  },
  {
    title: 'Enterprise UCaaS & CCaaS',
    description: 'Unified phone, video conferencing, collaboration, and intelligent contact centers.',
    icon: <Users className="h-5 w-5 text-accent" aria-hidden />
  },
  {
    title: 'AI & Sourcing Automation',
    description: 'AI-assisted sourcing strategies, automated qualification, and decision tools.',
    icon: <Cpu className="h-5 w-5 text-accent" aria-hidden />
  },
  {
    title: 'Lifecycle & Data Center Services',
    description: 'Equipment procurement, migration support, data center audits, and hybrid lifecycle solutions.',
    icon: <Building2 className="h-5 w-5 text-accent" aria-hidden />
  }
];

export const aiAccelerators = [
  {
    title: 'Telecom Invoice Analyzer',
    description: 'Audit monthly telecom invoices, identify billing anomalies, and uncover billing contract violations.',
    icon: <FileText className="h-5 w-5 text-accent" aria-hidden />,
    badge: 'Expense Intel'
  },
  {
    title: 'Network Qualifier Pro',
    description: 'Instantly check provider presence, fiber availability, and service availability at enterprise locations.',
    icon: <Globe2 className="h-5 w-5 text-accent" aria-hidden />,
    badge: 'Connectivity'
  },
  {
    title: 'StrategyIQ',
    description: 'Calculate deal leverage, benchmark supplier pricing, and scoring profiles for enterprise negotiations.',
    icon: <BarChart3 className="h-5 w-5 text-accent" aria-hidden />,
    badge: 'Deal Strategy'
  },
  {
    title: 'RFP Response Pro',
    description: 'Accelerate technology request-for-proposal comparisons using automated supplier response scoring models.',
    icon: <Layers className="h-5 w-5 text-accent" aria-hidden />,
    badge: 'Sourcing'
  },
  {
    title: 'Compliance Tracker',
    description: 'Map required security controls, audit active evidence, and track compliance status across supplier portfolios.',
    icon: <ShieldCheck className="h-5 w-5 text-accent" aria-hidden />,
    badge: 'Governance'
  },
  {
    title: 'Meeting Wingman',
    description: 'Capture critical decision parameters, summarize supplier offerings, and generate structured next steps.',
    icon: <Users className="h-5 w-5 text-accent" aria-hidden />,
    badge: 'Discovery'
  }
];

export const whyTechsonic: InfoCard[] = [
  {
    title: 'Independent Technology Advisor',
    description: 'Our recommendations are aligned entirely with your requirements. We operate independently of specific vendors.',
    icon: <Shield className="h-5 w-5 text-accent" aria-hidden />
  },
  {
    title: 'Broad Supplier Ecosystem',
    description: 'Access 250+ top-tier and emerging global providers across network, cloud, cybersecurity, and voice.',
    icon: <Globe2 className="h-5 w-5 text-accent" aria-hidden />
  },
  {
    title: 'Commercial Pricing & SLA Leverage',
    description: 'We leverage current contract databases and purchasing volume to secure preferred pricing and SLA terms.',
    icon: <Banknote className="h-5 w-5 text-accent" aria-hidden />
  },
  {
    title: 'Practical Implementation Support',
    description: 'We coordinate transition timelines, escalate issues, and support your teams from contract to deployment.',
    icon: <CheckCircle2 className="h-5 w-5 text-accent" aria-hidden />
  },
  {
    title: 'AI-Enhanced Sourcing Analysis',
    description: 'Use our suite of decision automation tools to analyze cost data, compare provider capabilities, and check fiber locations.',
    icon: <Cpu className="h-5 w-5 text-accent" aria-hidden />
  },
  {
    title: 'Business-First Recommendations',
    description: 'We ground technical designs in commercial viability, aligning your architecture with optimization goals.',
    icon: <Briefcase className="h-5 w-5 text-accent" aria-hidden />
  }
];

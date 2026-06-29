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
  CalendarDays,
  Cloud,
  Shield,
  ShoppingCart,
  GraduationCap,
  HeartHandshake,
  Building2,
  Banknote,
  Factory,
  Store,
  Sparkles,
  Users,
  Rocket,
  Terminal
} from 'lucide-react';
import type { ReactNode } from 'react';

export type ProductCard = {
  title: string;
  description: string;
  icon: ReactNode;
  badge: string;
};

export const trustStats = [
  { label: 'Years Experience', value: '16+', icon: <Activity className="h-6 w-6 text-accent" aria-hidden /> },
  { label: 'Technology Suppliers', value: '250+', icon: <Globe2 className="h-6 w-6 text-accent" aria-hidden /> },
  { label: 'AI-Powered Platform', value: 'Decision Intelligence', icon: <Cpu className="h-6 w-6 text-accent" aria-hidden /> },
  { label: 'Enterprise Expertise', value: 'Infrastructure & Security', icon: <ShieldCheck className="h-6 w-6 text-accent" aria-hidden /> }
];

export const products: ProductCard[] = [
  {
    title: 'StrategyIQ',
    description: 'AI-powered competitive deal strategy platform for enterprise procurement and sourcing teams.',
    icon: <BarChart3 className="h-6 w-6 text-accent" aria-hidden />,
    badge: 'Core Platform'
  },
  {
    title: 'Telecom Invoice Analyzer',
    description: 'Analyze telecom invoices, identify savings, and reduce recurring spend with intelligent reconciliation.',
    icon: <ShieldCheck className="h-6 w-6 text-accent" aria-hidden />,
    badge: 'Visibility'
  },
  {
    title: 'Network Qualifier Pro',
    description: 'Validate service availability and compare provider options across enterprise sites with precision.',
    icon: <Globe2 className="h-6 w-6 text-accent" aria-hidden />,
    badge: 'Connectivity'
  },
  {
    title: 'RFP Response Pro',
    description: 'Accelerate proposal creation using AI, templates, and competitive supplier scoring models.',
    icon: <Layers className="h-6 w-6 text-accent" aria-hidden />,
    badge: 'Automation'
  },
  {
    title: 'Compliance Tracker',
    description: 'Track security and compliance initiatives, evidence, and remediation across technology programs.',
    icon: <ShieldCheck className="h-6 w-6 text-accent" aria-hidden />,
    badge: 'Governance'
  },
  {
    title: 'Meeting Wingman',
    description: 'Capture action items, summarize customer meetings, and turn discovery into execution-ready tasks.',
    icon: <Users className="h-6 w-6 text-accent" aria-hidden />,
    badge: 'Insights'
  },
  {
    title: 'Public Company Opportunity Tracker',
    description: 'Identify enterprise sales opportunities and monitor service provider announcements for deal intelligence.',
    icon: <Rocket className="h-6 w-6 text-accent" aria-hidden />,
    badge: 'Pipeline'
  }
];

export const solutionCards = [
  { title: 'Reduce IT Spend', icon: <Banknote className="h-5 w-5 text-accent" aria-hidden /> },
  { title: 'Cybersecurity', icon: <Shield className="h-5 w-5 text-accent" aria-hidden /> },
  { title: 'Network Modernization', icon: <Globe2 className="h-5 w-5 text-accent" aria-hidden /> },
  { title: 'Cloud Transformation', icon: <Cloud className="h-5 w-5 text-accent" aria-hidden /> },
  { title: 'Unified Communications', icon: <Users className="h-5 w-5 text-accent" aria-hidden /> },
  { title: 'Contact Center', icon: <ShoppingCart className="h-5 w-5 text-accent" aria-hidden /> },
  { title: 'AI Enablement', icon: <Zap className="h-5 w-5 text-accent" aria-hidden /> },
  { title: 'Technology Procurement', icon: <Briefcase className="h-5 w-5 text-accent" aria-hidden /> }
];

export const industries = [
  { title: 'Education', icon: <GraduationCap className="h-5 w-5 text-accent" aria-hidden /> },
  { title: 'Healthcare', icon: <HeartHandshake className="h-5 w-5 text-accent" aria-hidden /> },
  { title: 'Financial Services', icon: <Banknote className="h-5 w-5 text-accent" aria-hidden /> },
  { title: 'Manufacturing', icon: <Factory className="h-5 w-5 text-accent" aria-hidden /> },
  { title: 'Retail', icon: <Store className="h-5 w-5 text-accent" aria-hidden /> },
  { title: 'Government', icon: <Building2 className="h-5 w-5 text-accent" aria-hidden /> },
  { title: 'Professional Services', icon: <Briefcase className="h-5 w-5 text-accent" aria-hidden /> },
  { title: 'Hospitality', icon: <Sparkles className="h-5 w-5 text-accent" aria-hidden /> }
];

export const whyCards = [
  {
    title: 'AI-Powered Insights',
    description: 'Leverage artificial intelligence to uncover hidden opportunities and risks in your technology landscape.',
    icon: <Sparkles className="h-5 w-5 text-accent" aria-hidden />
  },
  {
    title: 'Strategic Advisory',
    description: 'Receive unbiased, expert guidance from seasoned technology leaders to inform your critical decisions.',
    icon: <Briefcase className="h-5 w-5 text-accent" aria-hidden />
  },
  {
    title: 'Vendor-Neutral Sourcing',
    description: 'Optimize your technology procurement with transparent, competitive, and fair negotiations.',
    icon: <ShoppingCart className="h-5 w-5 text-accent" aria-hidden />
  }
];

export const workflowSteps = [
  {
    title: 'Assess',
    description: 'Understand your current technology state and identify pain points.',
    icon: <CalendarDays className="h-5 w-5 text-accent" aria-hidden />
  },
  {
    title: 'Strategize',
    description: 'Develop a tailored roadmap to achieve your technology and business objectives.',
    icon: <Layers className="h-5 w-5 text-accent" aria-hidden />
  },
  {
    title: 'Execute',
    description: 'Implement solutions with precision, minimizing disruption and maximizing impact.',
    icon: <CheckCircle2 className="h-5 w-5 text-accent" aria-hidden />
  },
  {
    title: 'Optimize',
    description: 'Continuously monitor, refine, and evolve your technology stack for sustained performance.',
    icon: <Terminal className="h-5 w-5 text-accent" aria-hidden />
  }
];

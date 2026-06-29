import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import {
  trustStats,
  advisoryServices,
  technologySolutions,
  technologyAreas,
  supplierEcosystem,
  platformModules
} from '../data/content';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';

const stagger = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 }
};

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pb-24 pt-14 sm:px-10 lg:px-16">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-gradient-to-br from-brand-primary to-accent blur-3xl" />
          <div className="absolute right-0 top-32 h-72 w-72 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-brand-primary blur-3xl" />
        </div>

        <div className="relative mx-auto flex max-w-[1220px] flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm uppercase tracking-[0.26em] text-accent shadow-soft">
              Technology Advisory. Smarter IT Decisions.
            </span>
            <h1 className="text-5xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
              Technology Advisory.
              <br /> Smarter IT Decisions.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              Techsonic helps organizations evaluate, source, and optimize technology solutions across network, cloud, cybersecurity, communications, and AI. We combine independent advisory with supplier intelligence, pricing leverage, and purpose-built automation.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild>
                <a href="/contact">Schedule Advisory Consultation</a>
              </Button>
              <Button variant="secondary" asChild>
                <a href="#advisory">Explore Capabilities</a>
              </Button>
            </div>
          </motion.div>

          {/* Advisory Engagement Tracker Mockup */}
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9 }} className="relative w-full max-w-xl rounded-[2rem] border border-white/10 bg-surface-secondary/80 p-8 shadow-soft backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 px-6 py-5">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Advisory Framework</p>
                <p className="mt-2 text-xl font-semibold text-white">Engagement Milestones</p>
              </div>
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-primary/10 text-accent">
                <Sparkles className="h-5 w-5" />
              </span>
            </div>
            <div className="mt-8 space-y-4">
              {[
                { label: 'Technology Assessment', status: 'completed' },
                { label: 'Supplier Comparison', status: 'completed' },
                { label: 'Pricing Validation', status: 'completed' },
                { label: 'Risk Review', status: 'active' },
                { label: 'Implementation Roadmap', status: 'planned' }
              ].map((step, idx) => (
                <div key={idx} className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/5 p-4 transition hover:bg-white/10">
                  <span className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
                    step.status === 'completed' && "bg-success/20 text-success border border-success/30",
                    step.status === 'active' && "bg-accent/20 text-accent border border-accent/30 animate-pulse",
                    step.status === 'planned' && "bg-white/5 text-slate-500 border border-white/10"
                  )}>
                    {step.status === 'completed' ? '✓' : idx + 1}
                  </span>
                  <span className={cn(
                    "text-sm font-medium",
                    step.status === 'completed' && "text-slate-300",
                    step.status === 'active' && "text-white font-semibold",
                    step.status === 'planned' && "text-slate-500"
                  )}>
                    {step.label}
                  </span>
                  {step.status === 'active' && (
                    <span className="ml-auto text-[10px] uppercase tracking-wider text-accent bg-accent/10 px-2 py-0.5 rounded">Active</span>
                  )}
                </div>
              ))}
            </div>
            <div className="absolute -right-16 top-10 h-20 w-20 rounded-full bg-accent/20 blur-3xl" />
          </motion.div>
        </div>
      </section>

      {/* 1. Technology Advisory Section */}
      <section id="advisory" className="scroll-mt-offset-nav px-6 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1220px]">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm uppercase tracking-[0.26em] text-accent shadow-soft">
              Technology Advisory
            </span>
            <h2 className="mt-6 text-4xl font-semibold text-white sm:text-5xl">Independent strategic advisory.</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              Unbiased, advisor-led technology consulting that aligns IT strategies, network routing capabilities, cybersecurity controls, and commercial terms directly with corporate goals.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {advisoryServices.map((service) => (
              <motion.div
                key={service.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                variants={stagger}
                className="rounded-[2rem] border border-white/10 bg-surface p-8 shadow-soft flex flex-col h-full"
              >
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-accent mb-6">
                  {service.icon}
                </span>
                <h3 className="text-xl font-semibold text-white">{service.title}</h3>
                <p className="mt-4 text-base leading-7 text-slate-300 flex-grow">{service.description}</p>
                <ul className="mt-6 space-y-2 border-t border-white/10 pt-6">
                  {service.bulletPoints.map((point) => (
                    <li key={point} className="flex items-center gap-2 text-sm text-slate-400">
                      <CheckCircle2 className="h-4 w-4 text-accent/75 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Technology Solutions Section */}
      <section id="solutions" className="scroll-mt-offset-nav bg-surface-secondary px-6 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1220px]">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm uppercase tracking-[0.26em] text-accent shadow-soft">
              Technology Solutions
            </span>
            <h2 className="mt-6 text-4xl font-semibold text-white sm:text-5xl">Outcome-driven solutions.</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              We guide business leaders through strategic procurement cycles to address critical technology challenges and optimize commercial arrangements.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {technologySolutions.map((solution, index) => (
              <motion.div
                key={solution.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.05 * index }}
                variants={stagger}
                className="flex flex-col items-start space-y-4 rounded-[2rem] border border-white/10 bg-surface p-8 shadow-soft h-full"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-accent flex-shrink-0">
                  {solution.icon}
                </span>
                <h3 className="text-lg font-semibold text-white">{solution.title}</h3>
                <p className="text-sm leading-6 text-slate-400">{solution.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Technology Areas Section */}
      <section id="tech-areas" className="scroll-mt-offset-nav px-6 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1220px]">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm uppercase tracking-[0.26em] text-accent shadow-soft">
              Technology Areas
            </span>
            <h2 className="mt-6 text-4xl font-semibold text-white sm:text-5xl">Ecosystem sourcing categories.</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              We source, audit, and negotiate agreements across all critical elements of modern enterprise technology portfolios.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {technologyAreas.map((area) => (
              <motion.div
                key={area.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                variants={stagger}
                className="flex items-start gap-5 rounded-[2rem] border border-white/10 bg-surface p-8 shadow-soft h-full"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-accent flex-shrink-0">
                  {area.icon}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-white">{area.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{area.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Supplier Ecosystem Section */}
      <section id="ecosystem" className="scroll-mt-offset-nav bg-surface-secondary px-6 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1220px]">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm uppercase tracking-[0.26em] text-accent shadow-soft">
              Supplier Ecosystem
            </span>
            <h2 className="mt-6 text-4xl font-semibold text-white sm:text-5xl">Leveraging vendor relations.</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              Access over 250 global providers and benefit from combined contracting experience, benchmarked pricing, and commercial SLA leverage.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {supplierEcosystem.map((card) => (
              <motion.div
                key={card.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                variants={stagger}
                className="rounded-[2rem] border border-white/10 bg-surface p-8 shadow-soft h-full"
              >
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-accent">
                  {card.icon}
                </span>
                <h3 className="mt-6 text-xl font-semibold text-white">{card.title}</h3>
                <p className="mt-4 text-sm leading-6 text-slate-400">{card.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Techsonic Platform Section */}
      <section id="ai-tools" className="scroll-mt-offset-nav px-6 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1220px]">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm uppercase tracking-[0.26em] text-accent shadow-soft">
              Techsonic Platform
            </span>
            <h2 className="mt-6 text-4xl font-semibold text-white sm:text-5xl">Accelerating decision intelligence.</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              Techsonic builds AI-powered platform modules that act as supporting accelerators to our primary advisory services, delivering quick analysis, qualification, and decision intelligence.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {platformModules.map((module) => (
              <motion.div
                key={module.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                variants={stagger}
                className="rounded-[2rem] border border-white/10 bg-surface p-8 shadow-soft h-full"
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-400 mb-6">
                  {module.badge}
                </span>
                <h3 className="text-xl font-semibold text-white">{module.title}</h3>
                <p className="mt-4 text-sm leading-6 text-slate-400">{module.description}</p>
                <div className="mt-6 inline-flex items-center gap-2 text-accent text-sm font-semibold">
                  {module.icon}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Sourcing optimization Section */}
      <section className="scroll-mt-offset-nav bg-gradient-to-br from-brand-primary to-accent px-6 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1220px] text-center">
          <h2 className="text-4xl font-semibold text-white sm:text-5xl">Ready to optimize your technology?</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-brand-subtext sm:text-xl">
            Connect with our technology advisory team today for a comprehensive evaluation of your contracts, pricing, and infrastructure.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button asChild>
              <a href="/contact">Schedule Advisory Consultation</a>
            </Button>
            <Button variant="secondary" asChild>
              <a href="https://www.linkedin.com/company/gotechsonic">Learn More</a>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="scroll-mt-offset-nav bg-surface-secondary px-6 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-[1220px] gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <div className="rounded-[2rem] border border-white/10 bg-surface p-10 shadow-soft">
              <p className="text-sm uppercase tracking-[0.3em] text-accent">About Techsonic</p>
              <h2 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Independent advisors, client-aligned recommendations.</h2>
              <p className="mt-5 text-lg leading-8 text-slate-300">
                Techsonic is an independent technology advisory firm. We help enterprise IT leaders, security executives, and finance directors design, evaluate, and source infrastructure, network connectivity, cloud, cybersecurity, and voice agreements with maximum commercial leverage.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-surface p-10 shadow-soft">
              <p className="text-sm uppercase tracking-[0.3em] text-accent">Our Mission</p>
              <p className="mt-4 text-lg leading-8 text-slate-300">
                To deliver complete clarity and commercial advantage through unbiased, market-aligned advisory and pricing validation tools, enabling organizations to make smarter IT decisions that improve performance and reduce cost.
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-surface p-10 shadow-soft flex flex-col justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-accent">Core Values</p>
              <ul className="mt-8 space-y-5 text-lg text-slate-300">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent" /> Independence: Always operator-neutral, aligning 100% with client goals.
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent" /> Accountability: Rooted in data-backed optimization and SLA diligence.
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent" /> Excellence: Setting high standards for contract auditing and commercial scoring.
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent" /> Collaboration: Working as a seamless extension of corporate IT and sourcing teams.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Stats Section */}
      <section className="scroll-mt-offset-nav px-6 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1220px] text-center">
          <h2 className="text-4xl font-semibold text-white sm:text-5xl">Objective intelligence. Business-first advice.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
            Our advisory frameworks and provider networks align with the highest industry standards to maximize enterprise value.
          </p>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {trustStats.map((stat) => (
              <motion.div
                key={stat.label}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                variants={stagger}
                className="rounded-[2rem] border border-white/10 bg-surface p-8 shadow-soft"
              >
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-accent">
                  {stat.icon}
                </span>
                <p className="mt-6 text-sm uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {stat.value}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

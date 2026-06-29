import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { products, solutionCards, industries, trustStats, whyCards, workflowSteps } from '../data/content';
import { Button } from '../components/ui/button';
import { useEffect, useState } from 'react';

const stagger = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 }
};

function Counter({ value }: { value: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const target = Number(value.replace('+', '')) || 0;
    const duration = 900;
    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.round(progress * target));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [value]);

  return <span>{count}{value.includes('+') ? '+' : ''}</span>;
}

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      <section className="relative overflow-hidden px-6 pb-24 pt-14 sm:px-10 lg:px-16">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-gradient-to-br from-brand-primary to-accent blur-3xl" />
          <div className="absolute right-0 top-32 h-72 w-72 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-brand-primary blur-3xl" />
        </div>

        <div className="relative mx-auto flex max-w-[1220px] flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm uppercase tracking-[0.26em] text-accent shadow-soft">
              Technology Intelligence. Delivered.
            </span>
            <h1 className="text-5xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
              Technology Intelligence.
              <br /> Delivered.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              Helping organizations modernize infrastructure, reduce technology costs, strengthen cybersecurity, and accelerate digital transformation through AI-powered software
              and strategic advisory.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild>
                <a href="/#products">Explore Products</a>
              </Button>
              <Button variant="secondary" asChild>
                <a href="/contact">Schedule Consultation</a>
              </Button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9 }} className="relative w-full max-w-xl rounded-[2rem] border border-white/10 bg-surface-secondary/80 p-8 shadow-soft backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 px-6 py-5">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Platform pulse</p>
                <p className="mt-2 text-xl font-semibold text-white">AI decision intelligence</p>
              </div>
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-primary/10 text-accent">
                <Sparkles className="h-5 w-5" />
              </span>
            </div>
            <div className="mt-8 grid gap-5">
              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Projected savings</p>
                    <p className="mt-2 text-3xl font-semibold text-white">$9.6M+</p>
                  </div>
                  <span className="text-sm text-success">+18%</span>
                </div>
                <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-accent to-primary" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-slate-400">Security posture</p>
                  <p className="mt-3 text-2xl font-semibold text-white">7 risk vectors</p>
                </div>
                <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-slate-400">Platform adoption</p>
                  <p className="mt-3 text-2xl font-semibold text-white">94%</p>
                </div>
              </div>
            </div>
            <div className="absolute -right-16 top-10 h-20 w-20 rounded-full bg-accent/20 blur-3xl" />
          </motion.div>
        </div>
      </section>

      <section id="products" className="scroll-mt-offset-nav px-6 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1220px]">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm uppercase tracking-[0.26em] text-accent shadow-soft">
              Our products
            </span>
            <h2 className="mt-6 text-4xl font-semibold text-white sm:text-5xl">Technology decision intelligence.</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              Our AI-powered software delivers actionable intelligence for enterprise leaders, enabling smarter decisions across infrastructure, cybersecurity, cloud, and procurement.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <motion.div
                key={product.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                variants={stagger}
                className="rounded-[2rem] border border-white/10 bg-surface p-8 shadow-soft"
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-400">
                  {product.badge}
                </span>
                <h3 className="mt-6 text-xl font-semibold text-white">{product.title}</h3>
                <p className="mt-4 text-base leading-7 text-slate-300">{product.description}</p>
                <div className="mt-6 inline-flex items-center gap-2 text-accent transition hover:text-white">
                  {product.icon} <ArrowRight className="h-4 w-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="solutions" className="scroll-mt-offset-nav bg-surface-secondary px-6 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1220px]">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm uppercase tracking-[0.26em] text-accent shadow-soft">
              Solutions
            </span>
            <h2 className="mt-6 text-4xl font-semibold text-white sm:text-5xl">Unlock your full potential.</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              Our strategic solutions empower your organization to overcome complex technology challenges and achieve measurable business outcomes.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {solutionCards.map((solution) => (
              <motion.div
                key={solution.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                variants={stagger}
                className="flex flex-col items-center justify-center space-y-4 rounded-[2rem] border border-white/10 bg-surface p-8 text-center shadow-soft"
              >
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-accent">
                  {solution.icon}
                </span>
                <h3 className="text-lg font-semibold text-white">{solution.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="industries" className="scroll-mt-offset-nav px-6 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1220px]">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm uppercase tracking-[0.26em] text-accent shadow-soft">
              Industries
            </span>
            <h2 className="mt-6 text-4xl font-semibold text-white sm:text-5xl">Delivering value across sectors.</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              Techsonic’s AI-powered intelligence and strategic advisory services drive innovation and efficiency across diverse enterprise industries.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((industry) => (
              <motion.div
                key={industry.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                variants={stagger}
                className="rounded-[2rem] border border-white/10 bg-surface p-8 shadow-soft"
              >
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-accent">
                  {industry.icon}
                </span>
                <h3 className="mt-6 text-xl font-semibold text-white">{industry.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="why-techsonic" className="scroll-mt-offset-nav bg-surface-secondary px-6 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1220px]">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm uppercase tracking-[0.26em] text-accent shadow-soft">
              Why Techsonic
            </span>
            <h2 className="mt-6 text-4xl font-semibold text-white sm:text-5xl">The Techsonic advantage.</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              We combine cutting-edge AI with deep industry expertise to deliver unparalleled value and results.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyCards.map((card) => (
              <motion.div
                key={card.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                variants={stagger}
                className="rounded-[2rem] border border-white/10 bg-surface p-8 shadow-soft"
              >
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-accent">
                  {card.icon}
                </span>
                <h3 className="mt-6 text-xl font-semibold text-white">{card.title}</h3>
                <p className="mt-4 text-base leading-7 text-slate-300">{card.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="workflow" className="scroll-mt-offset-nav px-6 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1220px]">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm uppercase tracking-[0.26em] text-accent shadow-soft">
              Our workflow
            </span>
            <h2 className="mt-6 text-4xl font-semibold text-white sm:text-5xl">A structured approach to success.</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              Our proven methodology ensures seamless execution and exceptional outcomes for every engagement.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {workflowSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                variants={stagger}
                className="rounded-[2rem] border border-white/10 bg-surface p-8 shadow-soft"
              >
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-accent">
                  {step.icon}
                </span>
                <h3 className="mt-6 text-xl font-semibold text-white">{step.title}</h3>
                <p className="mt-4 text-base leading-7 text-slate-300">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="scroll-mt-offset-nav bg-gradient-to-br from-brand-primary to-accent px-6 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1220px] text-center">
          <h2 className="text-4xl font-semibold text-white sm:text-5xl">Ready to transform your technology?</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-brand-subtext sm:text-xl">
            Connect with Techsonic today for a tailored consultation and discover how AI-powered intelligence can drive your enterprise forward.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button asChild>
              <a href="/contact">Schedule Consultation</a>
            </Button>
            <Button variant="secondary" asChild>
              <a href="https://www.linkedin.com/company/gotechsonic">Learn More</a>
            </Button>
          </div>
        </div>
      </section>

      <section id="about" className="scroll-mt-offset-nav bg-surface-secondary px-6 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-[1220px] gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <div className="rounded-[2rem] border border-white/10 bg-surface p-10 shadow-soft">
              <p className="text-sm uppercase tracking-[0.3em] text-accent">About Techsonic</p>
              <h2 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Your trusted technology intelligence partner.</h2>
              <p className="mt-5 text-lg leading-8 text-slate-300">
                Techsonic is a leading provider of AI-powered technology intelligence and strategic advisory services. We empower enterprises to navigate complex technology landscapes, optimize IT investments, and accelerate digital transformation.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-surface p-10 shadow-soft">
              <p className="text-sm uppercase tracking-[0.3em] text-accent">Our Mission</p>
              <p className="mt-4 text-lg leading-8 text-slate-300">
                To deliver unparalleled clarity and competitive advantage through AI-driven insights, enabling our clients to make informed technology decisions that drive growth and innovation.
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-surface p-10 shadow-soft">
            <p className="text-sm uppercase tracking-[0.3em] text-accent">Our Values</p>
            <ul className="mt-8 space-y-5 text-lg text-slate-300">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-accent" /> Innovation: Continuously pushing the boundaries of technology.
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-accent" /> Integrity: Operating with transparency and honesty.
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-accent" /> Excellence: Delivering superior quality and results.
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-accent" /> Collaboration: Fostering strong partnerships with clients.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="scroll-mt-offset-nav px-6 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1220px] text-center">
          <h2 className="text-4xl font-semibold text-white sm:text-5xl">Our impact by the numbers.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
            Trusted by industry leaders to deliver tangible results and measurable value.
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
                <p className="mt-2 text-3xl font-semibold text-white">
                  {stat.value.includes('+') ? <Counter value={stat.value} /> : stat.value}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

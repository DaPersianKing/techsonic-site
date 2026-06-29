import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Link } from 'react-router-dom';

const contactSchema = z.object({
  name: z.string().min(2, 'Please provide your name.'),
  company: z.string().optional(),
  email: z.string().email('Provide a valid email address.'),
  phone: z.string().min(8, 'Enter a phone number.'),
  industry: z.string().min(1, 'Select an industry.'),
  interest: z.string().min(2, 'Select a technology interest.'),
  budget: z.string().optional(),
  timeline: z.string().min(2, 'Select a timeline.'),
  message: z.string().min(15, 'Tell us more about the challenge.')
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful }
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = (_data: ContactFormValues) => {
    // Submitted successfully
  };

  return (
    <div className="px-6 py-16 sm:px-10 lg:px-16">
      <div className="mx-auto grid max-w-[1220px] gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-8">
          <div className="rounded-[2rem] border border-white/10 bg-surface p-10 shadow-soft">
            <p className="text-sm uppercase tracking-[0.3em] text-accent">Contact</p>
            <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Start a conversation with Techsonic.</h1>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              Share your technology priorities, procurement timeline, and expected outcomes. We’ll respond with a tailored plan for software, sourcing, and advisory support.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-surface p-10 shadow-soft">
            <p className="text-sm uppercase tracking-[0.3em] text-accent">Contact details</p>
            <div className="mt-8 space-y-5 text-slate-300">
              <div>
                <p className="font-semibold text-white">Email</p>
                <p>hello@gotechsonic.com</p>
              </div>
              <div>
                <p className="font-semibold text-white">Phone</p>
                <p>+1 424 279 3586</p>
              </div>
              <div>
                <p className="font-semibold text-white">Office</p>
                <p>Remote-first. Enterprise technology teams worldwide.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-surface p-10 shadow-soft">
          {isSubmitSuccessful ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="space-y-6"
            >
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center text-white">
                <p className="text-sm uppercase tracking-[0.3em] text-accent">Thank you</p>
                <h2 className="mt-4 text-3xl font-semibold">Your message is on its way.</h2>
                <p className="mt-4 text-slate-300">We’ll review your request and follow up with a tailored technology next step within one business day.</p>
              </div>
              <div className="flex flex-col gap-4 text-sm text-slate-400">
                <Link to="/" className="text-accent transition hover:text-white">
                  Return to homepage
                </Link>
                <p>Prefer an immediate response? Send a note to hello@gotechsonic.com.</p>
              </div>
            </motion.div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="mb-2 block text-sm font-medium text-slate-200">Name</label>
                  <Input id="contact-name" placeholder="Your name" {...register('name')} aria-invalid={Boolean(errors.name)} />
                  {errors.name && <p className="mt-2 text-sm text-text-error">{errors.name.message}</p>}
                </div>
                <div>
                  <label htmlFor="contact-company" className="mb-2 block text-sm font-medium text-slate-200">Company</label>
                  <Input id="contact-company" placeholder="Your company" {...register('company')} />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-email" className="mb-2 block text-sm font-medium text-slate-200">Email</label>
                  <Input id="contact-email" type="email" placeholder="hello@company.com" {...register('email')} aria-invalid={Boolean(errors.email)} />
                  {errors.email && <p className="mt-2 text-sm text-rose-400">{errors.email.message}</p>}
                </div>
                <div>
                  <label htmlFor="contact-phone" className="mb-2 block text-sm font-medium text-slate-200">Phone</label>
                  <Input id="contact-phone" placeholder="(123) 456-7890" {...register('phone')} aria-invalid={Boolean(errors.phone)} />
                  {errors.phone && <p className="mt-2 text-sm text-rose-400">{errors.phone.message}</p>}
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-industry" className="mb-2 block text-sm font-medium text-slate-200">Industry</label>
                  <Select id="contact-industry" defaultValue="" {...register('industry')} aria-invalid={Boolean(errors.industry)}>
                    <option value="" disabled>
                      Select industry
                    </option>
                    <option value="Education">Education</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Financial Services">Financial Services</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Retail">Retail</option>
                    <option value="Government">Government</option>
                    <option value="Professional Services">Professional Services</option>
                    <option value="Hospitality">Hospitality</option>
                  </Select>
                  {errors.industry && <p className="mt-2 text-sm text-rose-400">{errors.industry.message}</p>}
                </div>
                <div>
                  <label htmlFor="contact-interest" className="mb-2 block text-sm font-medium text-slate-200">Technology Interest</label>
                  <Select id="contact-interest" defaultValue="" {...register('interest')} aria-invalid={Boolean(errors.interest)}>
                    <option value="" disabled>
                      Select interest
                    </option>
                    <option value="AI Software">AI Software</option>
                    <option value="Strategic Advisory">Strategic Advisory</option>
                    <option value="Technology Sourcing">Technology Sourcing</option>
                    <option value="Cloud Transformation">Cloud Transformation</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                  </Select>
                  {errors.interest && <p className="mt-2 text-sm text-rose-400">{errors.interest.message}</p>}
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-budget" className="mb-2 block text-sm font-medium text-slate-200">Budget</label>
                  <Input id="contact-budget" placeholder="Estimated budget" {...register('budget')} />
                </div>
                <div>
                  <label htmlFor="contact-timeline" className="mb-2 block text-sm font-medium text-slate-200">Timeline</label>
                  <Select id="contact-timeline" defaultValue="" {...register('timeline')} aria-invalid={Boolean(errors.timeline)}>
                    <option value="" disabled>
                      Select timeline
                    </option>
                    <option value="0-3 months">0-3 months</option>
                    <option value="3-6 months">3-6 months</option>
                    <option value="6-12 months">6-12 months</option>
                    <option value="12+ months">12+ months</option>
                  </Select>
                  {errors.timeline && <p className="mt-2 text-sm text-rose-400">{errors.timeline.message}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="contact-message" className="mb-2 block text-sm font-medium text-slate-200">Message</label>
                <Textarea id="contact-message" placeholder="Describe the challenge and your desired outcomes." {...register('message')} aria-invalid={Boolean(errors.message)} />
                {errors.message && <p className="mt-2 text-sm text-rose-400">{errors.message.message}</p>}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-400">All submissions are reviewed within one business day.</p>
                <Button type="submit">Send Request</Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

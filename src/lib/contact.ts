import { z } from 'zod';
export const categories = [
  'Technology Advisory',
  'Website Development',
  'Custom Engineering',
  'Other',
] as const;
export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Enter your name.').max(100),
  email: z.string().trim().email('Enter a valid email address.').max(254),
  company: z.string().trim().max(150).default(''),
  category: z.enum(categories),
  message: z
    .string()
    .trim()
    .min(15, 'Please add at least 15 characters about your project.')
    .max(5000),
  consent: z.literal(true, { error: 'Please agree to be contacted about this inquiry.' }),
  website: z.string().max(200).default(''),
  token: z.string().min(1, 'Complete the spam check.').max(2048),
});
export type ContactValues = z.infer<typeof contactSchema>;
export async function sendContact(values: ContactValues): Promise<void> {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
    signal: AbortSignal.timeout(15000),
  });
  const data = (await response.json().catch(() => null)) as {
    accepted?: boolean;
    error?: string;
  } | null;
  if (!response.ok || data?.accepted !== true)
    throw new Error(
      data?.error ||
        'We could not submit your request. Please try again or email hello@gotechsonic.com.'
    );
}

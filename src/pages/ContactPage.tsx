import { useCallback, useState, useSyncExternalStore } from 'react';
import { useSearchParams } from 'react-router-dom';
import { categories, contactSchema, sendContact } from '../lib/contact';
import { SpamCheck } from '../components/SpamCheck';
import { Button } from '../components/ui/button';
import { trackAnalytics } from '../lib/analytics';
const subscribeToQuery = () => () => {};
export default function ContactPage() {
  const [searchParams] = useSearchParams();
  // Static HTML has no query context. Hydration starts with that same snapshot,
  // then applies approved inquiry prefills without changing the canonical URL.
  const query = useSyncExternalStore(
    subscribeToQuery,
    () => searchParams.toString(),
    () => ''
  );
  const params = new URLSearchParams(query);
  const category = categories.find((c) => c === params.get('category')) ?? 'Technology Advisory';
  const [token, setToken] = useState('');
  const onToken = useCallback((value: string) => setToken(value), []);
  const [resetKey, setResetKey] = useState(0);
  const [state, setState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const context = [
    params.get('application') && `Application: ${params.get('application')?.slice(0, 80)}.`,
    params.get('workflow') && `Workflow: ${params.get('workflow')?.slice(0, 80)}.`,
    params.get('demo') && `Interested in the ${params.get('demo')?.slice(0, 40)} website demo.`,
    params.get('package') && `Package: ${params.get('package')?.slice(0, 40)}.`,
    params.get('intent') && `Request: ${params.get('intent')?.slice(0, 60)}.`,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <section className="container section contact-layout">
      <div>
        <p className="eyebrow">Start with a conversation</p>
        <h1>
          What are you
          <br />
          <span className="blue-text">working toward?</span>
        </h1>
        <p>
          Tell us about the decision, project, or operational challenge. We’ll help identify a
          useful next step.
        </p>
        <p>
          <a className="text-link" href="mailto:hello@gotechsonic.com">
            hello@gotechsonic.com
          </a>
          <br />
          <a className="text-link" href="tel:+14242793586">
            +1 424 279 3586
          </a>
        </p>
        <p className="fine-print">
          Please do not include passwords, API keys, confidential contracts, or personal customer
          data. We can arrange a suitable way to exchange sensitive project materials.
        </p>
      </div>
      <div className="contact-form">
        {state === 'success' ? (
          <div role="status">
            <p className="eyebrow">Request accepted</p>
            <h2>
              Thank you.
              <br />
              Let’s move it forward.
            </h2>
            <p style={{ marginTop: 20 }}>
              Our email service accepted your inquiry for delivery to Techsonic. This confirms
              submission; it does not guarantee inbox delivery. You can also reach us by email or
              phone.
            </p>
            <Button
              variant="secondary"
              onClick={() => {
                setState('idle');
                setToken('');
                setResetKey((k) => k + 1);
              }}
            >
              Send another inquiry
            </Button>
          </div>
        ) : (
          <form
            className="stack"
            onChangeCapture={() => trackAnalytics({ name: 'contact_form_start' })}
            onSubmit={async (e) => {
              e.preventDefault();
              if (state === 'sending') return;
              const form = new FormData(e.currentTarget);
              const parsed = contactSchema.safeParse({
                name: form.get('name'),
                email: form.get('email'),
                company: form.get('company'),
                category: form.get('category'),
                message: form.get('message'),
                consent: form.get('consent') === 'on',
                website: form.get('website'),
                token,
              });
              if (!parsed.success) {
                setError(parsed.error.issues[0].message);
                setState('error');
                return;
              }
              setError('');
              setState('sending');
              try {
                await sendContact(parsed.data);
                trackAnalytics({ name: 'generate_lead' });
                setState('success');
              } catch (failure) {
                setError(
                  (failure as Error).name === 'TimeoutError'
                    ? 'The request timed out. Delivery is uncertain; please contact us directly before resubmitting.'
                    : (failure as Error).message
                );
                setState('error');
                setToken('');
                setResetKey((k) => k + 1);
              }
            }}
          >
            <div className="field-grid">
              <label>
                Name
                <input name="name" autoComplete="name" required minLength={2} maxLength={100} />
              </label>
              <label>
                Email
                <input type="email" name="email" autoComplete="email" required maxLength={254} />
              </label>
            </div>
            <label>
              Company{' '}
              <span className="fine-print" style={{ margin: 0 }}>
                Optional
              </span>
              <input name="company" autoComplete="organization" maxLength={150} />
            </label>
            <label>
              Inquiry category
              <select key={category} name="category" defaultValue={category}>
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label>
              What would you like to accomplish?
              <textarea
                name="message"
                required
                minLength={15}
                maxLength={5000}
                defaultValue={context}
                aria-describedby="message-help"
              />
            </label>
            <p id="message-help" className="fine-print" style={{ margin: 0 }}>
              15–5,000 characters. Include goals and timing; keep confidential information out.
            </p>
            <div className="honeypot" aria-hidden="true">
              <label>
                Leave this field empty
                <input name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
            <label className="consent">
              <input type="checkbox" name="consent" required />I agree that Techsonic may use these
              details to respond to this inquiry.
            </label>
            <p className="fine-print" style={{ margin: 0 }}>
              Your inquiry is processed through Cloudflare and Brevo for delivery to Techsonic. It
              is not added to a marketing list by this form.
            </p>
            <SpamCheck onToken={onToken} resetKey={resetKey} />
            {error && (
              <p role="alert" className="error-message">
                {error}
              </p>
            )}
            <Button type="submit" disabled={state === 'sending' || !token}>
              {state === 'sending' ? 'Sending inquiry…' : 'Send inquiry ↗'}
            </Button>
            <p className="fine-print" role="status" style={{ margin: 0 }}>
              {!token && 'Complete the spam check to enable submission.'}
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

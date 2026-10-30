import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, Send, X } from 'lucide-react';
import { trackAnalytics } from '../lib/analytics';
import {
  MAX_ADVISOR_CONTEXT_CHARS,
  MAX_ADVISOR_TURNS,
  sendAdvisorMessage,
  type AdvisorMessage,
} from '../lib/advisor';

const starters = [
  'Evaluate network or cloud solutions',
  'Explore cybersecurity options',
  'Build a website or application',
  'Automate a business process',
  'Compare technology providers',
  'Request a consultation',
];
const greeting =
  'Welcome to Techsonic. I can help you explore technology solutions, discuss an operational challenge, or find the right service for your business. What are you working on?';

function contactCategory(messages: AdvisorMessage[]): string {
  const topic = messages
    .filter((message) => message.role === 'user')
    .map((message) => message.content)
    .join(' ')
    .toLowerCase();
  if (/website|web site|portfolio/.test(topic)) return 'Website Development';
  if (/application|app build|automation|workflow|api integration|software/.test(topic))
    return 'Custom Engineering';
  return 'Technology Advisory';
}

export default function AiAdvisor() {
  const [open, setOpen] = useState(true);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [statusAttempt, setStatusAttempt] = useState(0);
  const [messages, setMessages] = useState<AdvisorMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const launcher = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const end = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const previousPath = useRef(location.pathname);
  const conversationVersion = useRef(0);
  const recordedOpen = useRef(false);

  useEffect(() => {
    if (open && !recordedOpen.current) trackAnalytics({ name: 'ai_advisor_open' });
    recordedOpen.current = open;
  }, [open]);

  function close() {
    setOpen(false);
    requestAnimationFrame(() => launcher.current?.focus());
  }

  useEffect(() => {
    if (!open) return;
    input.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const controller = new AbortController();
    void fetch('/api/chat', { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error();
        return (await response.json()) as { available?: boolean };
      })
      .then((data) => setAvailable(data.available === true))
      .catch(() => {
        if (!controller.signal.aborted) setAvailable(false);
      });
    return () => {
      controller.abort();
      document.body.style.overflow = previousOverflow;
    };
  }, [open, statusAttempt]);

  useEffect(() => {
    end.current?.scrollIntoView?.({ block: 'nearest' });
  }, [messages, sending]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
      }
      if (event.key !== 'Tab' || !panel.current) return;
      const elements = Array.from(
        panel.current.querySelectorAll<HTMLElement>(
          'button:not(:disabled), a[href], textarea:not(:disabled)'
        )
      );
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  useEffect(() => {
    if (previousPath.current !== location.pathname) close();
    previousPath.current = location.pathname;
    // The path is the only state relevant to this effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  async function submit(content: string) {
    const text = content.trim();
    if (
      !text ||
      sending ||
      available !== true ||
      messages[messages.length - 1]?.role === 'user' ||
      messages.filter((m) => m.role === 'user').length >= MAX_ADVISOR_TURNS
    )
      return;
    if (text.length > 1200) {
      setError('Please keep your message under 1,200 characters.');
      return;
    }
    const next: AdvisorMessage[] = [...messages, { role: 'user', content: text }];
    if (
      next.reduce((size, message) => size + message.content.length, 0) > MAX_ADVISOR_CONTEXT_CHARS
    ) {
      setError('This conversation has reached its context limit. Start a new conversation.');
      return;
    }
    setMessages(next);
    setDraft('');
    setError('');
    setSending(true);
    const version = conversationVersion.current;
    try {
      const answer = await sendAdvisorMessage(next);
      if (version === conversationVersion.current)
        setMessages([...next, { role: 'assistant', content: answer }]);
    } catch (failure) {
      if (version === conversationVersion.current)
        setError(
          (failure as Error).name === 'TimeoutError'
            ? 'The advisor timed out. Your message was not confirmed. Retry when ready.'
            : (failure as Error).message
        );
    } finally {
      if (version === conversationVersion.current) {
        setSending(false);
        input.current?.focus();
      }
    }
  }

  function retry() {
    const last = messages[messages.length - 1];
    if (last?.role !== 'user') return;
    setMessages(messages.slice(0, -1));
    setDraft(last.content);
    setError('');
    input.current?.focus();
  }

  const atLimit = messages.filter((message) => message.role === 'user').length >= MAX_ADVISOR_TURNS;
  const handoff = `/contact?category=${encodeURIComponent(contactCategory(messages))}&intent=ai-advisor-consultation`;
  return (
    <>
      <button
        ref={launcher}
        className={open ? 'advisor-launcher open' : 'advisor-launcher'}
        type="button"
        aria-label={open ? 'Close Techsonic AI Advisor' : 'Open Techsonic AI Advisor'}
        aria-expanded={open}
        aria-controls="advisor-panel"
        onClick={() => {
          if (open) close();
          else {
            setAvailable(null);
            setOpen(true);
          }
        }}
      >
        {open ? <X size={21} aria-hidden /> : <MessageCircle size={21} aria-hidden />}
        <span>AI Advisor</span>
      </button>
      {open && (
        <button
          className="advisor-backdrop"
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          onClick={close}
        />
      )}
      {open && (
        <section
          ref={panel}
          id="advisor-panel"
          className="advisor-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="advisor-title"
          aria-describedby="advisor-description"
        >
          <header className="advisor-header">
            <div>
              <h2 id="advisor-title">Techsonic AI Advisor</h2>
              <p id="advisor-description">
                Explore technology options, discuss your requirements, and find the right next step.
              </p>
            </div>
            <div className="advisor-header-actions">
              <button
                type="button"
                onClick={() => {
                  conversationVersion.current += 1;
                  setMessages([]);
                  setDraft('');
                  setError('');
                  setSending(false);
                  input.current?.focus();
                }}
                aria-label="New conversation"
              >
                New
              </button>
              <button type="button" onClick={close} aria-label="Close advisor">
                <X size={18} aria-hidden />
              </button>
            </div>
          </header>
          <div
            className="advisor-messages"
            role="log"
            aria-label="Advisor conversation"
            aria-live="polite"
            aria-relevant="additions text"
          >
            <p className="advisor-disclosure">
              AI assistant · answers may be incomplete. Verify decisions with a Techsonic advisor.
              Avoid sensitive information. Chat stays in this tab; messages are sent to the model
              provider for a response.
            </p>
            <div className="advisor-message assistant">
              <span>AI Advisor</span>
              <p>{greeting}</p>
            </div>
            {available === false && (
              <div role="alert" className="advisor-notice">
                AI Advisor is not configured or is temporarily unavailable. You can still contact
                Techsonic directly.{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAvailable(null);
                    setStatusAttempt((value) => value + 1);
                  }}
                >
                  Check again
                </button>
              </div>
            )}
            {available === null && (
              <p role="status" className="advisor-notice">
                Checking advisor availability…
              </p>
            )}
            {messages.map((message, index) => (
              <div key={index} className={`advisor-message ${message.role}`}>
                <span>{message.role === 'user' ? 'You' : 'AI Advisor'}</span>
                <p>{message.content}</p>
              </div>
            ))}
            {sending && (
              <p role="status" className="advisor-processing">
                AI Advisor is thinking…
              </p>
            )}
            <div ref={end} />
          </div>
          {messages.length === 0 && available === true && (
            <div className="advisor-starters" aria-label="Conversation starters">
              {starters.map((starter) => (
                <button type="button" key={starter} onClick={() => void submit(starter)}>
                  {starter}
                </button>
              ))}
            </div>
          )}
          <div className="advisor-compose">
            {error && (
              <div role="alert" className="advisor-error">
                {error}
                {messages[messages.length - 1]?.role === 'user' && (
                  <button type="button" onClick={retry}>
                    Edit and retry
                  </button>
                )}
              </div>
            )}
            {atLimit && (
              <p role="status" className="advisor-notice">
                Conversation limit reached. Start a new conversation to continue.
              </p>
            )}
            <form
              onSubmit={(event) => {
                event.preventDefault();
                void submit(draft);
              }}
            >
              <label htmlFor="advisor-input" className="sr-only">
                Message Techsonic AI Advisor
              </label>
              <textarea
                id="advisor-input"
                ref={input}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    void submit(draft);
                  }
                }}
                placeholder="Describe your challenge or ask a question…"
                maxLength={1200}
                rows={2}
                disabled={
                  available !== true ||
                  sending ||
                  atLimit ||
                  messages[messages.length - 1]?.role === 'user'
                }
              />
              <button
                type="submit"
                aria-label="Send message"
                disabled={
                  available !== true ||
                  sending ||
                  atLimit ||
                  messages[messages.length - 1]?.role === 'user' ||
                  !draft.trim()
                }
              >
                <Send size={18} aria-hidden />
              </button>
            </form>
            <p className="advisor-privacy">
              To send an inquiry, the contact form asks for your details, consent, and a spam check.
              Chat messages are not submitted with it.
            </p>
            <Link className="advisor-contact" to={handoff}>
              Request a consultation ↗
            </Link>
          </div>
        </section>
      )}
    </>
  );
}

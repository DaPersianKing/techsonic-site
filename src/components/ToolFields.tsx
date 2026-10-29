import { useId, useState } from 'react';
import { Button } from './ui/button';
export function NumberField({
  label,
  value,
  onChange,
  min = 0,
  max = 1e9,
  step = 'any',
  hint,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number | 'any';
  hint?: string;
}) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="number"
        value={Number.isNaN(value) ? '' : value}
        min={min}
        max={max}
        step={step}
        required
        onChange={(e) => onChange(e.target.value === '' ? NaN : Number(e.target.value))}
        aria-describedby={hint ? `${id}-hint` : undefined}
      />
      {hint && <small id={`${id}-hint`}>{hint}</small>}
    </div>
  );
}
export function ExportSummary({ summary }: { summary: string }) {
  const [status, setStatus] = useState('');
  return (
    <>
      <div className="actions">
        <Button
          variant="secondary"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(summary);
              setStatus('Summary copied.');
            } catch {
              setStatus(
                'Clipboard is unavailable. Use Print or select and copy the summary below.'
              );
            }
          }}
        >
          Copy summary
        </Button>
        <Button variant="ghost" onClick={() => window.print()}>
          Print assessment
        </Button>
      </div>
      <p role="status" className="fine-print">
        {status}
      </p>
      <details>
        <summary>View export text</summary>
        <pre style={{ whiteSpace: 'pre-wrap', fontSize: '.75rem', marginTop: 16 }}>{summary}</pre>
      </details>
    </>
  );
}
export const money = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

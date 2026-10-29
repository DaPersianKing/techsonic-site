import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { processSteps } from '../data/content';
export function AdvisoryProcess() {
  const [selected, setSelected] = useState(0);
  const step = processSteps[selected];
  return (
    <div className="process">
      <div className="process-caption">
        <span className="eyebrow">The advisory method</span>
        <span>01 — 05</span>
      </div>
      <div className="process-steps" aria-label="Explore the advisory process">
        {processSteps.map((item, index) => (
          <button
            key={item.name}
            aria-pressed={selected === index}
            aria-controls="process-detail"
            onClick={() => setSelected(index)}
          >
            <span>0{index + 1}</span>
            {item.name}
            <ArrowUpRight size={17} aria-hidden />
          </button>
        ))}
      </div>
      <div id="process-detail" className="process-detail" aria-live="polite">
        <h3>{step.purpose}</h3>
        <p>{step.deliverable}</p>
        <div>
          <span className="eyebrow">Business value</span>
          <p>{step.value}</p>
        </div>
      </div>
      <p className="fine-print">
        Explore our approach. This is a framework, not a live project status.
      </p>
    </div>
  );
}

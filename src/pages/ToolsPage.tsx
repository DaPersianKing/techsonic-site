import CarrierSlaCalculator from '../components/CarrierSlaCalculator';
import SlaCreditCalculator from '../components/SlaCreditCalculator';
import BandwidthPlanner from '../components/BandwidthPlanner';
import CostComparison from '../components/CostComparison';
import { useEffect, type SyntheticEvent } from 'react';
import { useLocation } from 'react-router-dom';
import { trackAnalytics } from '../lib/analytics';
import { type ToolId } from '../lib/analytics-policy';

const toolSections: Record<string, ToolId> = {
  risk: 'contract-controls',
  sla: 'sla-credit',
  bandwidth: 'bandwidth',
  cost: 'cost-comparison',
};
function trackTool(event: SyntheticEvent) {
  if (!(event.target instanceof Element)) return;
  const section = event.target.closest('.tool-section');
  const tool = section && toolSections[section.id];
  if (tool) trackAnalytics({ name: 'tool_use', tool });
}
export default function ToolsPage() {
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
  }, [hash]);
  return (
    <>
      <section className="page-hero container">
        <p className="eyebrow">The technical & commercial workbench</p>
        <h1>
          Make the assumptions
          <br />
          <span>part of the conversation.</span>
        </h1>
        <p className="lede">
          Four practical tools. Transparent inputs and calculations. Results stay in your browser
          unless you choose to copy, print, or share them.
        </p>
        <div className="actions">
          {[
            ['risk', 'Contract controls'],
            ['sla', 'SLA credits'],
            ['bandwidth', 'Bandwidth'],
            ['cost', 'Cost comparison'],
          ].map(([id, name]) => (
            <a className="text-link" href={`#${id}`} key={id}>
              {name} ↓
            </a>
          ))}
        </div>
      </section>
      <div
        className="container section"
        onChangeCapture={trackTool}
        onClickCapture={(event) => {
          if (event.target instanceof Element && event.target.closest('button')) trackTool(event);
        }}
      >
        <CarrierSlaCalculator />
        <SlaCreditCalculator />
        <BandwidthPlanner />
        <CostComparison />
      </div>
    </>
  );
}

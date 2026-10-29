import CarrierSlaCalculator from '../components/CarrierSlaCalculator';
import SlaCreditCalculator from '../components/SlaCreditCalculator';
import BandwidthPlanner from '../components/BandwidthPlanner';
import CostComparison from '../components/CostComparison';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
      <div className="container section">
        <CarrierSlaCalculator />
        <SlaCreditCalculator />
        <BandwidthPlanner />
        <CostComparison />
      </div>
    </>
  );
}

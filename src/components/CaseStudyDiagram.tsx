import type { SuccessProfile } from '../data/successProfiles';
export function CaseStudyDiagram({ profile }: { profile: SuccessProfile }) {
  return (
    <figure className="case-diagram">
      <div className="case-diagram-frame image-zoom-container image-zoom-container--technical">
        <picture>
          <source
            media="(max-width: 600px)"
            srcSet={`/assets/success-profiles/${profile.id}-mobile.svg`}
            width="360"
            height="560"
          />
          <img
            src={`/assets/success-profiles/${profile.id}.svg`}
            alt={`Conceptual ${profile.diagram.title.toLowerCase()}: ${profile.diagram.stages.join(' → ')}. Not an as-built deployment.`}
            width={900}
            height={320}
            loading="lazy"
          />
        </picture>
      </div>
      <figcaption>
        <span>Conceptual evaluation path · not an as-built deployment</span>
        <a
          className="text-link"
          href={`/assets/success-profiles/${profile.id}.svg`}
          target="_blank"
          rel="noreferrer"
        >
          Enlarge diagram ↗
          <span className="sr-only"> — {profile.customer}, opens in a new tab</span>
        </a>
      </figcaption>
    </figure>
  );
}

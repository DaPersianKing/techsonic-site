export function ShowcaseImage({
  directory,
  id,
  title,
}: {
  directory: 'applications' | 'workflows';
  id: string;
  title: string;
}) {
  return (
    <figure className={`showcase-image ${directory}`}>
      <a
        href={`/assets/${directory}/${id}.png`}
        target="_blank"
        rel="noreferrer"
        aria-label={`View full-resolution ${title} graphic (opens in a new tab)`}
      >
        <picture>
          <source srcSet={`/assets/${directory}/${id}.webp`} type="image/webp" />
          <img
            src={`/assets/${directory}/${id}.png`}
            alt={
              directory === 'applications'
                ? `${title} approved product logo`
                : `${title} architecture illustration; detailed steps follow in the text`
            }
            width={
              directory === 'applications'
                ? 1254
                : id === 'ai-customer-support-chatbot'
                  ? 1024
                  : 1086
            }
            height={
              directory === 'applications'
                ? 1254
                : id === 'ai-customer-support-chatbot'
                  ? 1536
                  : 1448
            }
            loading="lazy"
          />
        </picture>
      </a>
      <figcaption>View full-resolution graphic ↗</figcaption>
    </figure>
  );
}

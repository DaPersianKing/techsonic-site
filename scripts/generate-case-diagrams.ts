import { mkdir, writeFile } from 'node:fs/promises';
import { successProfiles } from '../src/data/successProfiles.ts';
const escape = (text: string) =>
  text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
await mkdir('public/assets/success-profiles', { recursive: true });
for (const profile of successProfiles) {
  const mobileNodes = profile.diagram.stages
    .map((stage, i) => {
      const y = 84 + i * 146;
      return `<rect x="20" y="${y}" width="320" height="110" rx="4" fill="#fff" stroke="#a8bbc7"/><text x="38" y="${y + 28}" font-size="12" fill="#005daa">0${i + 1}</text><text x="38" y="${y + 57}" font-size="16" font-weight="600">${escape(stage)}</text><text x="38" y="${y + 84}" font-size="12" fill="#52616b">${escape(profile.diagram.annotations[i])}</text>${i < 2 ? `<path d="M180 ${y + 116}v24m-5-5 5 5 5-5" fill="none" stroke="#168078" stroke-width="2"/>` : ''}`;
    })
    .join('');
  await writeFile(
    `public/assets/success-profiles/${profile.id}-mobile.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 560" role="img" aria-labelledby="title desc"><title id="title">${escape(profile.diagram.title)}</title><desc id="desc">Conceptual evaluation path. ${escape(profile.diagram.stages.join(' to '))}. Not an as-built deployment.</desc><rect width="360" height="560" fill="#edf2f1"/><g font-family="Arial,sans-serif" fill="#101820"><text x="20" y="34" font-size="12" fill="#005daa">CONCEPTUAL EVALUATION PATH</text><text x="20" y="57" font-size="12" fill="#52616b">Requirements · evaluation · decision</text>${mobileNodes}<text x="20" y="526" font-size="12" fill="#52616b">Not an as-built deployment.</text></g></svg>\n`
  );
  const nodes = profile.diagram.stages
    .map((stage, i) => {
      const x = 28 + i * 294;
      return `<rect x="${x}" y="116" width="256" height="106" rx="4" fill="#fff" stroke="#a8bbc7"/><text x="${x + 16}" y="143" font-size="11" fill="#005daa">0${i + 1}</text><text x="${x + 16}" y="170" font-size="15" font-weight="600">${escape(stage)}</text><text x="${x + 16}" y="198" font-size="11" fill="#52616b">${escape(profile.diagram.annotations[i])}</text>${i < 2 ? `<path d="M${x + 260} 169h26" stroke="#168078" stroke-width="2" marker-end="url(#arrow)"/>` : ''}`;
    })
    .join('');
  await writeFile(
    `public/assets/success-profiles/${profile.id}.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 320" role="img" aria-labelledby="title desc"><title id="title">${escape(profile.diagram.title)}</title><desc id="desc">Conceptual evaluation path based on supplied engagement scope. ${escape(profile.diagram.stages.join(' to '))}. Not an as-built deployment.</desc><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10" fill="none" stroke="#168078" stroke-width="2"/></marker></defs><rect width="900" height="320" fill="#edf2f1"/><g font-family="Arial,sans-serif" fill="#101820"><text x="28" y="42" font-size="11" fill="#005daa" letter-spacing="2">CONCEPTUAL EVALUATION PATH</text><text x="28" y="78" font-size="23">${escape(profile.diagram.title)}</text>${nodes}<text x="28" y="276" font-size="12" fill="#52616b">Requirements → evaluation → decision. Implementation is not asserted.</text></g></svg>\n`
  );
}

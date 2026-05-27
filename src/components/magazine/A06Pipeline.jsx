import React from 'react';
import { KickerTitle, MagazineChrome, MagazineFoot, MagazineSlide } from './primitives.jsx';
import { Pipeline } from '../timelines/index.jsx';

export function A06Pipeline({
  page = 'A06',
  title,
  kicker,
  sections,
  footerLeft = 'A06 · PIPELINE',
  footerRight = 'WORKFLOW',
}) {
  return (
    <MagazineSlide layout="A06" tone="light" animate="pipeline">
      <MagazineChrome left={`${page} · PIPELINE`} right="A06" />
      <div className="frame">
        <KickerTitle kicker={kicker} title={title} />
        <Pipeline sections={sections} />
      </div>
      <MagazineFoot left={footerLeft} right={footerRight} />
    </MagazineSlide>
  );
}

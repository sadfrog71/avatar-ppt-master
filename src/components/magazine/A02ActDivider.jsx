import React from 'react';
import { MagazineChrome, MagazineFoot, MagazineSlide } from './primitives.jsx';

export function A02ActDivider({
  page = 'A02',
  title,
  kicker,
  lead,
  tone = 'light',
  footerLeft = 'A02 · ACT DIVIDER',
  footerRight = 'ACT',
}) {
  return (
    <MagazineSlide layout="A02" tone={tone} hero animate="hero">
      <MagazineChrome left={`${page} · ACT DIVIDER`} right="A02" />
      <div className="frame" style={{ display: 'grid', gap: '6vh', alignContent: 'center', minHeight: '80vh' }}>
        <div className="kicker" data-anim>{kicker}</div>
        <h1 className="h-hero" style={{ fontSize: '8.5vw' }} data-anim>{title}</h1>
        <p className="lead" style={{ maxWidth: '55vw' }} data-anim>{lead}</p>
      </div>
      <MagazineFoot left={footerLeft} right={footerRight} />
    </MagazineSlide>
  );
}

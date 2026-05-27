import React from 'react';
import { MagazineChrome, MagazineFoot, MagazineSlide } from './primitives.jsx';

export function A07HeroQuestion({
  page = 'A07',
  kicker,
  lines,
  lead,
  footerLeft = 'A07 · HERO QUESTION',
  footerRight = 'QUESTION',
}) {
  return (
    <MagazineSlide layout="A07" tone="dark" hero animate="hero">
      <MagazineChrome left={`${page} · HERO QUESTION`} right="A07" />
      <div className="frame" style={{ display: 'grid', gap: '8vh', alignContent: 'center', minHeight: '80vh' }}>
        <div className="kicker" data-anim>{kicker}</div>
        <h1 className="h-hero" style={{ fontSize: '7vw', lineHeight: 1.15 }}>
          {lines.map((line) => <span key={line} data-anim style={{ display: 'block' }}>{line}</span>)}
        </h1>
        <p className="lead" style={{ maxWidth: '50vw' }} data-anim>{lead}</p>
      </div>
      <MagazineFoot left={footerLeft} right={footerRight} />
    </MagazineSlide>
  );
}

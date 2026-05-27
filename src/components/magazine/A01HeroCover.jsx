import React from 'react';
import { MagazineChrome, MagazineFoot, MagazineSlide, MetaRow } from './primitives.jsx';

export function A01HeroCover({
  page = 'A01',
  title,
  subtitle,
  kicker,
  lead,
  meta = [],
  issue = 'VOL.01',
  footerLeft = 'A01 · HERO COVER',
  footerRight = 'EDITORIAL',
}) {
  return (
    <MagazineSlide layout="A01" tone="dark" hero animate="hero">
      <MagazineChrome left={`${page} · HERO COVER`} right={issue} />
      <div className="frame" style={{ display: 'grid', gap: '4vh', alignContent: 'center', minHeight: '80vh' }}>
        <div className="kicker" data-anim>{kicker}</div>
        <h1 className="h-hero" data-anim>{title}</h1>
        {subtitle ? <h2 className="h-sub" data-anim>{subtitle}</h2> : null}
        <p className="lead" style={{ maxWidth: '60vw' }} data-anim>{lead}</p>
        <MetaRow items={meta} />
      </div>
      <MagazineFoot left={footerLeft} right={footerRight} />
    </MagazineSlide>
  );
}

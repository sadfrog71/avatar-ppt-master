import React from 'react';
import { MagazineChrome, MagazineFoot, MagazineSlide, MetaRow } from './primitives.jsx';
import { QuoteBlock } from '../text/index.jsx';

export function A08BigQuote({
  page = 'A08',
  kicker,
  lines,
  lead,
  source = [],
  tone = 'light',
  footerLeft = 'A08 · BIG QUOTE',
  footerRight = 'QUOTE',
}) {
  return (
    <MagazineSlide layout="A08" tone={tone} animate="quote">
      <MagazineChrome left={`${page} · BIG QUOTE`} right="A08" />
      <div className="frame" style={{ display: 'grid', gap: '5vh', alignContent: 'center', minHeight: '80vh' }}>
        <div className="kicker" data-anim>{kicker}</div>
        <QuoteBlock lines={lines} className="quote-display" style={{ maxWidth: '72vw' }} />
        <p className="lead" style={{ maxWidth: '55vw', opacity: .65 }} data-anim>{lead}</p>
        <MetaRow items={source} />
      </div>
      <MagazineFoot left={footerLeft} right={footerRight} />
    </MagazineSlide>
  );
}

import React from 'react';
import {
  CanvasCard,
  Chrome,
  ON_ACCENT,
  ON_ACCENT_22,
  ON_ACCENT_60,
  ON_ACCENT_78,
  ON_ACCENT_86,
  SwissSlide,
} from './primitives.jsx';

export function SwissCover({ title, kicker, lead, meta = '', issue = '01 / NN' }) {
  return (
    <SwissSlide layout="SWISS-COVER-ASCII" animate="hero" className="accent">
      <CanvasCard>
        <canvas className="ascii-bg" aria-hidden="true" />
        <Chrome left={meta || title} right={issue} />
        <div style={{ flex: 1, padding: 0, display: 'grid', gridTemplateRows: 'auto 1fr auto', gap: '2.6vh' }}>
          <div data-anim="kicker" className="t-meta" style={{ color: ON_ACCENT_78, letterSpacing: '.22em' }}>{kicker}</div>
          <h1 data-anim="title" style={{ alignSelf: 'center', fontFamily: 'var(--sans),var(--sans-zh)', fontWeight: 200, fontSize: 'min(10.6vw,18vh)', lineHeight: .94, letterSpacing: '-.025em', color: ON_ACCENT }}>{title}</h1>
          <div data-anim="bottom" style={{ display: 'grid', gridTemplateRows: 'auto auto', gap: '1.6vh', borderTop: `1px solid ${ON_ACCENT_22}`, paddingTop: '2vh' }}>
            <div className="lead" style={{ maxWidth: '52ch', color: ON_ACCENT_86 }}>{lead}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
              <div className="t-meta" style={{ color: ON_ACCENT_60 }}>{meta}</div>
              <div className="t-meta" style={{ color: ON_ACCENT_60 }}>→ swipe / arrow keys</div>
            </div>
          </div>
        </div>
      </CanvasCard>
    </SwissSlide>
  );
}

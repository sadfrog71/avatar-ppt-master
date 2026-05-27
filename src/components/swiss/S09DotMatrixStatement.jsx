import React from 'react';
import { CanvasCard, Chrome, SwissSlide } from './primitives.jsx';

export function SwissS09DotMatrixStatement({ page = '09', title, kicker, body, label }) {
  return (
    <SwissSlide layout="S09" animate="statement">
      <CanvasCard>
        <Chrome left={`${page} · DOT MATRIX`} right="S09" />
        <div style={{ flex: 1, position: 'relative', display: 'grid', gridTemplateRows: 'auto 1fr auto', gap: '3vh' }}>
          <div data-anim="line" style={{ display: 'flex', flexDirection: 'column', gap: '1.2vh', maxWidth: '72vw' }}>
            <div className="t-meta">{kicker}</div>
            <h2 className="h-xl-zh" style={{ fontSize: 'min(7.2vw,12.5vh)' }}>{title}</h2>
          </div>
          <div data-anim="up" style={{ position: 'absolute', right: 0, top: '10vh', width: '28vw', height: '44vh', color: 'var(--focus-mark)' }} className="dot-mat xl" />
          <p data-anim="up" className="t-body" style={{ alignSelf: 'end', maxWidth: '38ch', fontSize: 'max(18px,1.35vw)' }}>{body}</p>
          <div data-anim="up" className="t-meta" style={{ borderTop: '2px solid var(--focus-mark)', paddingTop: '2vh' }}>{label}</div>
        </div>
      </CanvasCard>
    </SwissSlide>
  );
}

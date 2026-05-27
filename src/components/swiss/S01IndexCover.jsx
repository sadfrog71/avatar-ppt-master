import React from 'react';
import { CanvasCard, Chrome, SwissSlide } from './primitives.jsx';

export function SwissS01IndexCover({ page = '01', title, kicker, rows, footer }) {
  return (
    <SwissSlide layout="S01" animate="hero">
      <CanvasCard>
        <Chrome left={`${page} · INDEX COVER`} right="S01" />
        <div style={{ flex: 1, display: 'grid', gridTemplateRows: 'auto 1fr auto', gap: '4vh' }}>
          <div data-anim="line" style={{ display: 'flex', flexDirection: 'column', gap: '1.2vh' }}>
            <div className="t-meta">{kicker}</div>
            <h2 className="h-xl-zh" style={{ fontSize: 'min(6vw,10.5vh)' }}>{title}</h2>
          </div>
          <div style={{ display: 'grid', alignContent: 'center', gap: '1.2vh' }}>
            {rows.map((row, index) => (
              <div key={row.label} className="cover-row" style={{ display: 'grid', gridTemplateColumns: '14vw 1fr', gap: '3vw', alignItems: 'baseline', borderTop: '1px solid var(--grey-2)', padding: '2.2vh 0' }}>
                <div className="num-mega" style={{ color: row.accent ? 'var(--focus-mark)' : 'var(--ink)' }}>{String(index + 1).padStart(2, '0')}</div>
                <div className="name-mega" style={{ color: row.accent ? 'var(--focus-mark)' : 'var(--ink)' }}>{row.label}</div>
              </div>
            ))}
          </div>
          <div className="t-meta" style={{ borderTop: '1px solid var(--grey-2)', paddingTop: '2vh' }}>{footer}</div>
        </div>
      </CanvasCard>
    </SwissSlide>
  );
}

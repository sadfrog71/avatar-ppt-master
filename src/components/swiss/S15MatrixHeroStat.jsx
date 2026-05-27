import React from 'react';
import { CanvasCard, Chrome, SwissSlide } from './primitives.jsx';

export function SwissS15MatrixHeroStat({ page = '15', title, kicker, cells, stat }) {
  return (
    <SwissSlide layout="S15" animate="matrix-fill">
      <CanvasCard>
        <Chrome left={`${page} · MATRIX`} right="S15" />
        <div style={{ flex: 1, display: 'grid', gridTemplateRows: 'auto 1fr auto', gap: '3vh' }}>
          <div data-anim="line" style={{ display: 'flex', flexDirection: 'column', gap: '1.2vh' }}>
            <div className="t-meta">{kicker}</div>
            <h2 className="h-xl-zh" style={{ fontSize: 'min(5.6vw,9.8vh)' }}>{title}</h2>
          </div>
          <div data-anim="up" style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '1vh 1vw' }}>
            {cells.map((cell, index) => (
              <div key={cell} className={index === cells.length - 1 ? 'card-accent' : 'card-fill'} style={{ minHeight: '10vh', padding: '1.4vh 1vw', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div className="t-meta">{String(index + 1).padStart(2, '0')}</div>
                <div className="t-body-sm">{cell}</div>
              </div>
            ))}
          </div>
          <div data-anim="up" style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'end', borderTop: '2px solid var(--focus-mark)', paddingTop: '2vh' }}>
            <div>
              <div className="t-meta">{stat.kicker}</div>
              <div className="kpi-thin accent">{stat.value}</div>
            </div>
            <p className="t-body" style={{ maxWidth: '34ch' }}>{stat.body}</p>
          </div>
        </div>
      </CanvasCard>
    </SwissSlide>
  );
}

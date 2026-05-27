import React from 'react';
import { CanvasCard, Chrome, Icon, SwissSlide } from './primitives.jsx';

export function SwissSixCellsSlide({ page = '02', title, kicker, cells }) {
  return (
    <SwissSlide layout="S04" animate="grid-reveal">
      <CanvasCard>
        <Chrome left={`${page} · SIX CELLS`} right="S04" />
        <div style={{ flex: 1, display: 'grid', gridTemplateRows: 'auto 1fr', gap: '5vh' }}>
          <div data-anim="line" style={{ display: 'flex', flexDirection: 'column', gap: '1.4vh' }}>
            <div className="t-meta">{kicker}</div>
            <h2 className="h-xl-zh" style={{ fontSize: 'min(6.2vw,11vh)' }}>{title}</h2>
          </div>
          <div className="grid-12">
            {cells.map((cell, index) => (
              <div key={cell.title} className={`span-4 ${cell.accent ? 'card-accent' : 'card-fill'}`} data-anim="card" style={{ minHeight: '21vh', padding: '2.2vh 1.5vw', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div className="t-meta">{String(index + 1).padStart(2, '0')}</div>
                <div>
                  {cell.icon ? <Icon name={cell.icon} /> : null}
                  <h3 style={{ fontFamily: 'var(--sans),var(--sans-zh)', fontWeight: 400, fontSize: 'max(18px,1.8vw)', lineHeight: 1.15, marginTop: '1vh' }}>{cell.title}</h3>
                  <p className="body-sm" style={{ marginTop: '1.2vh' }}>{cell.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CanvasCard>
    </SwissSlide>
  );
}

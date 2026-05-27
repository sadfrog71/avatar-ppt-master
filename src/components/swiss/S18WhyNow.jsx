import React from 'react';
import { CanvasCard, Chrome, SwissSlide } from './primitives.jsx';

export function SwissS18WhyNow({ page = '18', title, kicker, columns }) {
  return (
    <SwissSlide layout="S18" animate="why-now">
      <CanvasCard>
        <Chrome left={`${page} · WHY NOW`} right="S18" />
        <div style={{ flex: 1, display: 'grid', gridTemplateRows: 'auto 1fr', gap: '5vh' }}>
          <div data-anim="line" style={{ display: 'flex', flexDirection: 'column', gap: '1.2vh' }}>
            <div className="t-meta">{kicker}</div>
            <h2 className="h-xl-zh" style={{ fontSize: 'min(6.4vw,11.2vh)' }}>{title}</h2>
          </div>
          <div data-anim="up" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '2vw' }}>
            {columns.map((column, index) => (
              <div key={column.title} style={{ borderTop: '2px solid var(--ink)', paddingTop: '2vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div className="t-meta">{column.kicker}</div>
                  <h3 className="t-h-prod" style={{ marginTop: '1.4vh' }}>{column.title}</h3>
                  <p className="t-body-sm" style={{ marginTop: '1vh' }}>{column.body}</p>
                </div>
                <div className="kpi-thin" style={{ color: index === 1 ? 'var(--focus-mark)' : 'var(--ink)' }}>{String(index + 1).padStart(2, '0')}</div>
              </div>
            ))}
          </div>
        </div>
      </CanvasCard>
    </SwissSlide>
  );
}

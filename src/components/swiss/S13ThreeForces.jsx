import React from 'react';
import { CanvasCard, Chrome, SwissSlide } from './primitives.jsx';

export function SwissS13ThreeForces({ page = '13', title, kicker, hero, forces }) {
  return (
    <SwissSlide layout="S13" animate="three-forces">
      <CanvasCard>
        <Chrome left={`${page} · THREE FORCES`} right="S13" />
        <div style={{ flex: 1, display: 'grid', gridTemplateRows: 'auto 1fr', gap: '4vh' }}>
          <div data-anim="line" style={{ display: 'flex', flexDirection: 'column', gap: '1.2vh' }}>
            <div className="t-meta">{kicker}</div>
            <h2 className="h-xl-zh" style={{ fontSize: 'min(5.8vw,10.2vh)' }}>{title}</h2>
          </div>
          <div data-anim="up" style={{ display: 'grid', gridTemplateColumns: '41.666% 58.333%', gap: '2vw', minHeight: 0 }}>
            <div className="card-ink" style={{ padding: '3vh 2vw', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div className="t-meta">{hero.kicker}</div>
              <div>
                <div className="kpi-thin" style={{ color: 'var(--paper)' }}>{hero.value}</div>
                <p className="t-body-sm" style={{ color: 'rgba(255,255,255,.78)' }}>{hero.body}</p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateRows: 'repeat(3,1fr)', gap: '1.4vh' }}>
              {forces.map((force, index) => (
                <div key={force.title} className="card-fill" style={{ padding: '2.2vh 1.6vw', display: 'grid', gridTemplateColumns: '5em 1fr', gap: '1.2vw', alignItems: 'center' }}>
                  <div className="kpi-thin-sm" style={{ color: force.accent ? 'var(--focus-mark)' : 'var(--ink)' }}>{String(index + 1).padStart(2, '0')}</div>
                  <div>
                    <h3 className="t-h-prod">{force.title}</h3>
                    <p className="t-body-sm" style={{ marginTop: '.6vh' }}>{force.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CanvasCard>
    </SwissSlide>
  );
}

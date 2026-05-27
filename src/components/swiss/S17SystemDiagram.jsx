import React from 'react';
import { CanvasCard, Chrome, SwissSlide } from './primitives.jsx';

export function SwissS17SystemDiagram({ page = '17', title, kicker, systems }) {
  return (
    <SwissSlide layout="S17" animate="system-diagram">
      <CanvasCard>
        <Chrome left={`${page} · SYSTEM DIAGRAM`} right="S17" />
        <div style={{ flex: 1, display: 'grid', gridTemplateRows: 'auto 1fr', gap: '4vh' }}>
          <div data-anim="line" style={{ display: 'flex', flexDirection: 'column', gap: '1.2vh' }}>
            <div className="t-meta">{kicker}</div>
            <h2 className="h-xl-zh" style={{ fontSize: 'min(5.6vw,9.8vh)' }}>{title}</h2>
          </div>
          <div data-anim="up" style={{ display: 'grid', gridTemplateRows: '1fr auto', gap: '3vh' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '2vw', alignItems: 'center' }}>
              {systems.map((system, index) => (
                <div key={system.title} style={{ display: 'grid', placeItems: 'center', gap: '2vh' }}>
                  <svg viewBox="0 0 220 220" width="100%" height="34vh" aria-hidden="true">
                    <circle cx="110" cy="110" r={70 + index * 6} fill="none" stroke={system.accent ? 'var(--focus-mark)' : 'var(--ink)'} strokeWidth="2" opacity=".9" />
                    <circle cx="110" cy="110" r={38 + index * 4} fill="none" stroke={system.accent ? 'var(--focus-mark)' : 'var(--ink)'} strokeWidth="1" opacity=".38" />
                    <circle cx="110" cy="110" r="12" fill={system.accent ? 'var(--focus-mark)' : 'var(--ink)'} />
                  </svg>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '2vw' }}>
              {systems.map((system, index) => (
                <div key={system.title} className={system.accent ? 'card-accent' : 'card-fill'} style={{ padding: '2vh 1.5vw' }}>
                  <div className="t-meta">{String(index + 1).padStart(2, '0')}</div>
                  <h3 className="t-h-prod" style={{ marginTop: '1vh' }}>{system.title}</h3>
                  <p className="t-body-sm" style={{ marginTop: '.8vh' }}>{system.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CanvasCard>
    </SwissSlide>
  );
}

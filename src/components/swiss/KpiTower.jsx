import React from 'react';
import { CanvasCard, Chrome, Icon, SwissSlide } from './primitives.jsx';

export function SwissKpiTowerSlide({ page = '04', title, kicker, lead, towers }) {
  return (
    <SwissSlide layout="S06" animate="measure-up">
      <CanvasCard>
        <Chrome left={`${page} · OPERATING SCORECARD`} right="S06" />
        <div style={{ flex: 1, display: 'grid', gridTemplateRows: 'auto 1fr', gap: '6vh' }}>
          <div data-anim="line" style={{ display: 'grid', gridTemplateColumns: '1fr 34ch', gap: '4vw', alignItems: 'end' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4vh' }}>
              <div className="t-meta">{kicker}</div>
              <h2 className="h-xl-zh" style={{ fontSize: 'min(6.2vw,11vh)' }}>{title}</h2>
            </div>
            <p className="lead" style={{ fontSize: 'max(18px,1.45vw)', lineHeight: 1.55, color: 'var(--text-secondary)', fontWeight: 400 }}>{lead}</p>
          </div>
          <div className="bar-towers">
            {towers.map((tower) => (
              <div key={tower.label} className="bar-tower">
                <div className="cap">{tower.icon ? <Icon name={tower.icon} /> : null}</div>
                <div className={`body-block h-${tower.height ?? 2} ${tower.accent ? 'b-accent' : ''}`}>
                  <div className="lbl">{tower.label}</div>
                  <div className="nb">{tower.value}</div>
                  <p className="sub">{tower.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CanvasCard>
    </SwissSlide>
  );
}

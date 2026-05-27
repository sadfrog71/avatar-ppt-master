import React from 'react';
import { CanvasCard, Chrome, SwissSlide } from './primitives.jsx';

export function SwissS21TechSpec({ page = '21', title, kicker, note, specs, hero }) {
  return (
    <SwissSlide layout="S21" animate="tech-spec">
      <CanvasCard>
        <Chrome left={`${page} · TECH SPEC`} right="S21" />
        <div style={{ flex: 1, display: 'grid', gridTemplateRows: 'auto 1fr auto', gap: '3vh' }}>
          <div data-anim="line">
            <div className="t-meta">{kicker}</div>
          </div>
          <div data-anim="up" style={{ display: 'grid', gridTemplateColumns: '4fr repeat(3,2fr)', gap: '2vw', alignItems: 'start' }}>
            <div>
              <div className="h-xl-zh" style={{ fontSize: 'min(5.2vw,9vh)', lineHeight: .98 }}>{title}</div>
              <p className="t-body-sm" style={{ marginTop: '2vh', maxWidth: '30ch' }}>{note}</p>
            </div>
            {specs.map((spec) => (
              <div key={spec.label}>
                <div style={{ height: 1, background: 'var(--ink)', marginBottom: '2vh' }} />
                <div className="kpi-num kpi-thin-sm" style={{ color: spec.accent ? 'var(--focus-mark)' : 'var(--ink)' }}>{spec.value}</div>
                <div className="t-meta" style={{ marginTop: '1vh' }}>{spec.label}</div>
                <p className="t-body-sm" style={{ marginTop: '.8vh' }}>{spec.body}</p>
              </div>
            ))}
          </div>
          <div data-anim="hero" style={{ display: 'grid', gridTemplateColumns: '3fr 5fr 3fr', gap: '2vw', alignItems: 'end', borderTop: '2px solid var(--focus-mark)', paddingTop: '2vh' }}>
            <div className="bottom-hero kpi-thin accent">{hero.value}</div>
            <div>
              <div style={{ height: 1, background: 'var(--ink)', marginBottom: '1.2vh' }} />
              <div className="t-h-prod">{hero.title}</div>
              <p className="t-body-sm" style={{ marginTop: '.8vh' }}>{hero.body}</p>
            </div>
            <div>
              <div data-anim="bars" style={{ display: 'grid', gridTemplateColumns: 'repeat(9,1fr)', gap: '.3vw', height: '11vh', alignItems: 'end' }}>
                {[24, 38, 52, 74, 56, 84, 68, 92, 78].map((height, index) => (
                  <div key={index} className="vbar" style={{ height: `${height}%`, background: index === 7 ? 'var(--focus-mark)' : 'var(--ink)' }} />
                ))}
              </div>
              <div className="t-meta" style={{ marginTop: '1vh', textAlign: 'right' }}>{hero.label}</div>
            </div>
          </div>
        </div>
      </CanvasCard>
    </SwissSlide>
  );
}

import React from 'react';
import { CanvasCard, Chrome, SwissSlide } from './primitives.jsx';

export function SwissS14LoopForm({ page = '14', title, kicker, steps, center }) {
  return (
    <SwissSlide layout="S14" animate="loop-form">
      <CanvasCard>
        <Chrome left={`${page} · LOOP FORM`} right="S14" />
        <div style={{ flex: 1, display: 'grid', gridTemplateRows: 'auto 1fr', gap: '4vh' }}>
          <div data-anim="line" style={{ display: 'flex', flexDirection: 'column', gap: '1.2vh' }}>
            <div className="t-meta">{kicker}</div>
            <h2 className="h-xl-zh" style={{ fontSize: 'min(5.8vw,10.2vh)' }}>{title}</h2>
          </div>
          <div data-anim="up" style={{ display: 'grid', gridTemplateColumns: '33.333% 66.667%', gap: '4vw', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2vh' }}>
              {steps.map((step, index) => (
                <div key={step.title} className={index === steps.length - 1 ? 'card-accent' : 'card-fill'} style={{ padding: '2vh 1.4vw', display: 'grid', gridTemplateColumns: '3.4em 1fr', gap: '1vw', alignItems: 'start' }}>
                  <div className="t-meta">{String(index + 1).padStart(2, '0')}</div>
                  <div>
                    <h3 className="t-h-prod">{step.title}</h3>
                    <p className="t-body-sm" style={{ marginTop: '.6vh' }}>{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ position: 'relative', minHeight: '56vh', display: 'grid', placeItems: 'center' }}>
              <svg viewBox="0 0 520 360" width="100%" height="100%" aria-hidden="true">
                <defs>
                  <marker id="arrow-s14" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                    <path d="M0,0 L6,3 L0,6 Z" fill="var(--focus-mark)" />
                  </marker>
                </defs>
                <circle cx="260" cy="180" r="118" fill="none" stroke="var(--ink)" strokeWidth="1" opacity=".25" />
                <circle cx="260" cy="62" r="12" fill="var(--focus-mark)" />
                <circle cx="378" cy="180" r="12" fill="var(--ink)" />
                <circle cx="260" cy="298" r="12" fill="var(--ink)" />
                <circle cx="142" cy="180" r="12" fill="var(--ink)" />
                <path d="M282 69 C340 90 371 124 378 158" fill="none" stroke="var(--focus-mark)" strokeWidth="2" markerEnd="url(#arrow-s14)" />
                <path d="M371 202 C348 254 314 287 282 294" fill="none" stroke="var(--focus-mark)" strokeWidth="2" markerEnd="url(#arrow-s14)" />
                <path d="M238 291 C184 268 150 226 143 202" fill="none" stroke="var(--focus-mark)" strokeWidth="2" markerEnd="url(#arrow-s14)" />
                <path d="M149 158 C170 108 212 70 238 65" fill="none" stroke="var(--focus-mark)" strokeWidth="2" markerEnd="url(#arrow-s14)" />
              </svg>
              <div style={{ position: 'absolute', width: '16vw', textAlign: 'left' }}>
                <div className="t-cat accent">{center.kicker}</div>
                <div className="kpi-thin-sm" style={{ color: 'var(--focus-mark)', marginTop: '1vh' }}>{center.title}</div>
              </div>
            </div>
          </div>
        </div>
      </CanvasCard>
    </SwissSlide>
  );
}

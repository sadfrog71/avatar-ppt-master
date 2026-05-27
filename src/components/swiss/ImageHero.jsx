import React from 'react';
import { SwissSlide } from './primitives.jsx';

export function SwissImageHeroSlide({
  page = '06',
  title,
  kicker,
  body = '主视觉用于承载案例、产品或现场证据;下方用指标解释这张图为什么重要。',
  image = 'images/placeholder-21x9.svg',
  stats = [],
}) {
  return (
    <SwissSlide layout="S22" animate="image-hero">
      <div className="canvas-card" style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div data-anim="img" style={{ position: 'relative', flex: '0 0 60%', overflow: 'hidden', background: 'var(--grey-1)' }}>
          <img src={image} data-image-slot="s22-hero-21x9" alt="" loading="eager" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 35%' }} />
          <div className="chrome-min" style={{ position: 'absolute', top: 0, left: 0, right: 0, color: 'rgba(255,255,255,.9)', padding: '5.6vh 5vw 0' }}>
            <div className="l">{`${page} · IMAGE HERO`}</div>
            <div className="r">S22</div>
          </div>
          <div data-anim="title-block" style={{ position: 'absolute', left: '5vw', top: '11vh', background: 'var(--paper)', padding: '3.2vh 3.2vw', maxWidth: '48vw' }}>
            <div className="t-meta">{kicker}</div>
            <div style={{ fontFamily: 'var(--sans),var(--sans-zh)', fontWeight: 200, fontSize: 'min(5.2vw,9vh)', lineHeight: 1, letterSpacing: '-.035em', color: 'var(--text-primary)', marginTop: '1vh' }}>{title}</div>
          </div>
        </div>
        <div data-anim="kpi" className="image-hero-body">
          <div style={{ maxWidth: '48ch', fontFamily: 'var(--sans),var(--sans-zh)', fontSize: 'max(15px,1.3vw)', lineHeight: 1.55, fontWeight: 300, color: 'var(--text-primary)', letterSpacing: '-.005em' }}>{body}</div>
          <div className="image-hero-stats" style={{ gap: '4vw' }}>
            {stats.slice(0, 3).map((stat, index) => (
              <div key={stat.label} style={{ display: 'flex', flexDirection: 'column', gap: '.6vh' }}>
                <div style={{ height: 1, background: 'var(--ink)' }} />
                <div className="t-meta">{stat.label}</div>
                <div style={{ fontFamily: 'var(--sans)', fontWeight: 200, fontSize: 'min(4.6vw,7.6vh)', lineHeight: .95, letterSpacing: '-.04em', color: index === 2 ? 'var(--focus-mark)' : 'var(--text-primary)' }}>{stat.value}</div>
                <div style={{ height: 1, background: 'var(--border-subtle)', marginTop: 'auto' }} />
                <p className="t-body-sm">{stat.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SwissSlide>
  );
}

import React from 'react';
import { CanvasCard, Chrome, MetricRow, SwissSlide } from './primitives.jsx';

export function SwissImageHeroSlide({ page = '06', title, kicker, image = 'images/placeholder-21x9.svg', stats = [] }) {
  return (
    <SwissSlide layout="S22" animate="image-hero">
      <CanvasCard>
        <Chrome left={`${page} · IMAGE HERO`} right="S22" />
        <div style={{ flex: 1, display: 'grid', gridTemplateRows: 'auto auto 1fr', gap: '3vh' }}>
          <div data-anim="line" style={{ display: 'flex', flexDirection: 'column', gap: '1.2vh' }}>
            <div className="t-meta">{kicker}</div>
            <h2 className="h-xl-zh" style={{ fontSize: 'min(5.8vw,10.2vh)' }}>{title}</h2>
          </div>
          <div className="frame-img r-21x9 pos-face" data-anim="image">
            <img src={image} data-image-slot="s22-hero-21x9" alt="" />
          </div>
          <MetricRow metrics={stats.slice(0, 4)} />
        </div>
      </CanvasCard>
    </SwissSlide>
  );
}

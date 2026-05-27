import React from 'react';
import { CanvasCard, Chrome, SwissSlide } from './primitives.jsx';

export function SwissS19FourCards({ page = '19', title, kicker, cards }) {
  return (
    <SwissSlide layout="S19" animate="four-cards">
      <CanvasCard>
        <Chrome left={`${page} · FOUR CARDS`} right="S19" />
        <div style={{ flex: 1, display: 'grid', gridTemplateRows: 'auto 1fr', gap: '5vh' }}>
          <div data-anim="line">
            <div style={{ height: 2, background: 'var(--focus-mark)', marginBottom: '2vh' }} />
            <div>
              <div className="t-meta">{kicker}</div>
              <h2 className="h-xl-zh" style={{ fontSize: 'min(5.8vw,10.2vh)', marginTop: '1vh' }}>{title}</h2>
            </div>
          </div>
          <div data-anim="up" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.4vw' }}>
            {cards.map((card, index) => (
              <div key={card.title} className={card.accent ? 'card-accent' : 'card-fill'} style={{ padding: '2.4vh 1.4vw', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div className="t-meta">{String(index + 1).padStart(2, '0')}</div>
                <div>
                  <h3 className="t-h-prod">{card.title}</h3>
                  <p className="t-body-sm" style={{ marginTop: '1vh' }}>{card.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CanvasCard>
    </SwissSlide>
  );
}

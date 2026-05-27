import React from 'react';
import {
  CanvasCard,
  Chrome,
  ON_ACCENT,
  ON_ACCENT_22,
  ON_ACCENT_62,
  ON_ACCENT_78,
  ON_ACCENT_82,
  SwissSlide,
} from './primitives.jsx';

export function SwissClosing({ title, note, takeaways, author = '', date = '' }) {
  return (
    <SwissSlide layout="SWISS-CLOSING-ASCII" animate="split-statement" className="split">
      <CanvasCard>
        <div className="split-half">
          <div className="half b-accent" style={{ padding: '5.6vh 3.6vw 4.4vh', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
            <canvas className="ascii-bg" aria-hidden="true" />
            <Chrome left="NN / NN" right="CLOSING" />
            <div data-anim="manifesto" style={{ display: 'flex', flexDirection: 'column', gap: '2vh', position: 'relative', zIndex: 1 }}>
              <div className="t-meta" style={{ color: ON_ACCENT_78, letterSpacing: '.22em', marginBottom: '1.6vh' }}>MANIFESTO</div>
              <h2 style={{ fontFamily: 'var(--sans),var(--sans-zh)', fontSize: 'min(8vw,14vh)', lineHeight: .94, letterSpacing: '-.025em', fontWeight: 200, color: ON_ACCENT }}>{title}</h2>
              <div style={{ fontFamily: 'var(--sans),var(--sans-zh)', fontSize: 'max(14px,1vw)', lineHeight: 1.6, color: ON_ACCENT_82, fontWeight: 400, maxWidth: '36ch', marginTop: '1.4vh' }}>{note}</div>
            </div>
            <div data-anim="signature" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', borderTop: `1px solid ${ON_ACCENT_22}`, paddingTop: '2vh', position: 'relative', zIndex: 1 }}>
              <div className="t-meta" style={{ color: ON_ACCENT_62 }}>{author}</div>
              <div className="t-meta" style={{ color: ON_ACCENT_62 }}>{date}</div>
            </div>
          </div>
          <div className="half" style={{ padding: '5.6vh 3.6vw 4.4vh', justifyContent: 'space-between' }}>
            <Chrome left="TAKEAWAYS" right={`${takeaways.length} RULES`} />
            <div data-anim="rules" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {takeaways.map((item, index) => (
                <div key={item.title} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '2vw', alignItems: 'start', padding: '2.6vh 0', borderTop: '1px solid var(--border-subtle)', borderBottom: index === takeaways.length - 1 ? '2px solid var(--focus-mark)' : undefined }}>
                  <div style={{ fontFamily: 'var(--sans)', fontWeight: 200, fontSize: 'min(4.4vw,7.8vh)', lineHeight: .9, color: index === takeaways.length - 1 ? 'var(--focus-mark)' : 'var(--text-primary)' }}>{String(index + 1).padStart(2, '0')}</div>
                  <div>
                    <h3 style={{ fontFamily: 'var(--sans),var(--sans-zh)', fontWeight: 400, fontSize: 'max(18px,1.8vw)', lineHeight: 1.2, letterSpacing: '-.015em', color: index === takeaways.length - 1 ? 'var(--focus-mark)' : 'var(--text-primary)', marginBottom: '1vh' }}>{item.title}</h3>
                    <p style={{ fontFamily: 'var(--sans),var(--sans-zh)', fontSize: 'max(16px,.94vw)', lineHeight: 1.6, color: 'var(--text-secondary)', fontWeight: 400 }}>{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <div data-anim="foot" className="t-meta" style={{ color: 'var(--text-helper)', textAlign: 'right' }}>→ END</div>
          </div>
        </div>
      </CanvasCard>
    </SwissSlide>
  );
}

import React from 'react';
import { KickerTitle, MagazineChrome, MagazineFoot, MagazineSlide } from './primitives.jsx';

export function A09BeforeAfter({
  page = 'A09',
  title,
  kicker,
  left,
  right,
  footerLeft = 'A09 · BEFORE AFTER',
  footerRight = 'COMPARE',
}) {
  return (
    <MagazineSlide layout="A09" tone="light" animate="directional">
      <MagazineChrome left={`${page} · BEFORE / AFTER`} right="A09" />
      <div className="frame" style={{ paddingTop: '5vh' }}>
        <KickerTitle kicker={kicker} title={title} style={{ marginBottom: '4vh' }} />
        <div className="grid-2-6-6" style={{ gap: '5vw 4vh' }}>
          <CompareColumn item={left} anim="left" muted />
          <CompareColumn item={right} anim="right" />
        </div>
      </div>
      <MagazineFoot left={footerLeft} right={footerRight} />
    </MagazineSlide>
  );
}

function CompareColumn({ item, anim, muted = false }) {
  return (
    <div data-anim={anim} style={{ padding: '3vh 2vw', borderLeft: '3px solid currentColor', opacity: muted ? .55 : 1 }}>
      <div className="kicker" style={{ opacity: .9 }}>{item.kicker}</div>
      <h3 className="h-md" style={{ marginTop: '2vh' }}>{item.title}</h3>
      <ul className="body-sm" style={{ marginTop: '3vh', paddingLeft: '1.2em', display: 'flex', flexDirection: 'column', gap: '1.4vh' }}>
        {item.points.map((point) => <li key={point}>{point}</li>)}
      </ul>
    </div>
  );
}

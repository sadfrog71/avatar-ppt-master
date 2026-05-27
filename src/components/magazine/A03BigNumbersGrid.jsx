import React from 'react';
import { KickerTitle, MagazineChrome, MagazineFoot, MagazineSlide } from './primitives.jsx';
import { StatGrid } from '../metrics/index.jsx';

export function A03BigNumbersGrid({
  page = 'A03',
  title,
  kicker,
  lead,
  stats,
  footerLeft = 'A03 · BIG NUMBERS',
  footerRight = 'DATA',
}) {
  return (
    <MagazineSlide layout="A03" tone="light">
      <MagazineChrome left={`${page} · BIG NUMBERS GRID`} right="A03" />
      <div className="frame" style={{ paddingTop: '6vh' }}>
        <KickerTitle kicker={kicker} title={title} />
        <p className="lead" style={{ marginBottom: '5vh' }} data-anim>{lead}</p>
        <StatGrid stats={stats} />
      </div>
      <MagazineFoot left={footerLeft} right={footerRight} />
    </MagazineSlide>
  );
}

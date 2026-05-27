import React from 'react';
import { KickerTitle, MagazineChrome, MagazineFoot, MagazineImage, MagazineSlide } from './primitives.jsx';

export function A05ImageGrid({
  page = 'A05',
  title,
  kicker,
  images,
  footerLeft = 'A05 · IMAGE GRID',
  footerRight = 'PROOF',
}) {
  return (
    <MagazineSlide layout="A05" tone="light">
      <MagazineChrome left={`${page} · IMAGE GRID`} right="A05" />
      <div className="frame" style={{ paddingTop: '5vh' }}>
        <KickerTitle kicker={kicker} title={title} />
        <div className="grid-3-3" style={{ marginTop: '4vh' }}>
          {images.map((image, index) => (
            <MagazineImage
              key={`${image.caption}-${index}`}
              image={image}
              slot={`a05-grid-${index + 1}-16x10`}
              caption={image.caption}
              className="h-26"
              style={{ height: '26vh' }}
            />
          ))}
        </div>
      </div>
      <MagazineFoot left={footerLeft} right={footerRight} />
    </MagazineSlide>
  );
}

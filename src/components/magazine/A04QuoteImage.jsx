import React from 'react';
import { MagazineChrome, MagazineFoot, MagazineImage, MagazineSlide } from './primitives.jsx';

export function A04QuoteImage({
  page = 'A04',
  title,
  kicker,
  lead,
  callout,
  calloutSource,
  image,
  tone = 'light',
  footerLeft = 'A04 · QUOTE IMAGE',
  footerRight = 'STORY',
}) {
  return (
    <MagazineSlide layout="A04" tone={tone}>
      <MagazineChrome left={`${page} · QUOTE + IMAGE`} right="A04" />
      <div className="frame grid-2-7-5" style={{ paddingTop: '6vh' }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '3vh' }}>
          <div>
            <div className="kicker" data-anim>{kicker}</div>
            <h2 className="h-xl" style={{ whiteSpace: 'nowrap', fontSize: '7.2vw' }} data-anim>{title}</h2>
            <p className="lead" style={{ marginTop: '3vh' }} data-anim>{lead}</p>
          </div>
          <div className="callout" data-anim>
            {callout}
            {calloutSource ? <div className="callout-src">{calloutSource}</div> : null}
          </div>
        </div>
        <MagazineImage image={image} ratio="r-16x10" slot="a04-main-16x10" caption={image?.caption || 'Main image'} />
      </div>
      <MagazineFoot left={footerLeft} right={footerRight} />
    </MagazineSlide>
  );
}

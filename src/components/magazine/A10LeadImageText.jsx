import React from 'react';
import { MagazineChrome, MagazineFoot, MagazineImage, MagazineSlide } from './primitives.jsx';

export function A10LeadImageText({
  page = 'A10',
  title,
  kicker,
  lead,
  body,
  callout,
  calloutSource,
  image,
  tone = 'light',
  footerLeft = 'A10 · LEAD IMAGE TEXT',
  footerRight = 'FEATURE',
}) {
  return (
    <MagazineSlide layout="A10" tone={tone}>
      <MagazineChrome left={`${page} · LEAD IMAGE + TEXT`} right="A10" />
      <div className="frame grid-2-8-4" style={{ paddingTop: '6vh' }}>
        <div>
          <div className="kicker" data-anim>{kicker}</div>
          <h2 className="h-xl" style={{ marginTop: '1vh', marginBottom: '3vh' }} data-anim>{title}</h2>
          <p className="lead" style={{ marginBottom: '3vh' }} data-anim>{lead}</p>
          <p className="body" style={{ marginBottom: '2.4vh' }} data-anim>{body}</p>
          <div className="callout" style={{ marginTop: '3vh' }} data-anim>
            {callout}
            {calloutSource ? <div className="callout-src">{calloutSource}</div> : null}
          </div>
        </div>
        <MagazineImage image={image} ratio="r-3x4" slot="a10-side-3x4" caption={image?.caption || 'Side image'} />
      </div>
      <MagazineFoot left={footerLeft} right={footerRight} />
    </MagazineSlide>
  );
}

import React from 'react';
import { Chrome, Footer, SlideShell } from '../shell/index.jsx';
import { MediaFrame } from '../media/index.jsx';
import { KickerTitle, MetaRow } from '../text/index.jsx';

export function MagazineSlide({ layout, tone = 'light', hero = false, animate = 'cascade', className = '', children }) {
  return <SlideShell layout={layout} tone={tone} hero={hero} animate={animate} className={className}>{children}</SlideShell>;
}

export function MagazineChrome({ left, right }) {
  return <Chrome left={left} right={right} />;
}

export function MagazineFoot({ left, right }) {
  return <Footer left={left} right={right} />;
}

export function MagazineImage({ image = {}, ratio = 'r-16x10', slot, caption, className = '', style }) {
  return <MediaFrame image={image} ratio={ratio} slot={slot} caption={caption} className={className} style={style} />;
}

export { KickerTitle, MetaRow };

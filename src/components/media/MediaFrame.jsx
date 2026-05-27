import React from 'react';

const placeholderImage = 'images/placeholder-21x9.svg';

export function MediaFrame({ image = {}, ratio = 'r-16x10', slot, caption, className = '', style }) {
  const src = image.src || placeholderImage;
  const alt = image.alt || caption || 'Layout image';
  return (
    <figure className={`frame-img ${ratio} ${image.position || ''} ${className}`.trim()} style={style} data-anim>
      <img src={src} alt={alt} data-image-slot={slot} />
      {caption || image.caption ? <figcaption className="img-cap">{caption || image.caption}</figcaption> : null}
    </figure>
  );
}

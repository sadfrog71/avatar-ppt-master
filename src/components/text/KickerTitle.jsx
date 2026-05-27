import React from 'react';

export function KickerTitle({ kicker, title, titleClass = 'h-xl', style }) {
  return (
    <div data-anim>
      <div className="kicker">{kicker}</div>
      <h2 className={titleClass} style={style}>{title}</h2>
    </div>
  );
}

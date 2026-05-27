import React from 'react';

export function AsciiBackground() {
  return <canvas className="ascii-bg" aria-hidden="true" />;
}

export function DotMatrix({ size = 'xl', className = '', style }) {
  return <div aria-hidden="true" className={`dot-mat ${size} ${className}`.trim()} style={style} />;
}

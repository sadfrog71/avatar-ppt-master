import React from 'react';

export function Chrome({ left, right, variant = 'default' }) {
  const className = variant === 'min' ? 'chrome-min' : 'chrome';
  return (
    <div className={className}>
      <div className="l">{left}</div>
      <div className="r">{right}</div>
    </div>
  );
}

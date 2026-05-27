import React from 'react';

export function Canvas({ variant = 'default', children }) {
  if (variant === 'card') return <div className="canvas-card">{children}</div>;
  return <div className="frame">{children}</div>;
}

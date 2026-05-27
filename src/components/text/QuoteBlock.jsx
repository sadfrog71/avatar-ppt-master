import React from 'react';

export function QuoteBlock({ lines, className = '', style }) {
  return (
    <blockquote className={className} style={style}>
      {lines.map((line) => <span key={line} data-anim="line" style={{ display: 'block' }}>{line}</span>)}
    </blockquote>
  );
}

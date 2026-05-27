import React from 'react';

export function Card({ title, body, number, tone = 'fill', children }) {
  const className = tone === 'accent' ? 'card-accent' : tone === 'ink' ? 'card-ink' : 'card-fill';
  return (
    <div className={className}>
      {number ? <div className="t-meta">{number}</div> : null}
      {title ? <h3 className="t-h-prod">{title}</h3> : null}
      {body ? <p className="t-body-sm">{body}</p> : null}
      {children}
    </div>
  );
}

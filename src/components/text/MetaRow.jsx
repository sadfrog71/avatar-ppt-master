import React from 'react';

export function MetaRow({ items = [] }) {
  return (
    <div className="meta-row" data-anim>
      {items.map((item, index) => (
        <React.Fragment key={`${item}-${index}`}>
          {index > 0 ? <span className="dot" /> : null}
          <span>{item}</span>
        </React.Fragment>
      ))}
    </div>
  );
}

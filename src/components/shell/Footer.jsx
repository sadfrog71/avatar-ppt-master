import React from 'react';

export function Footer({ left, right }) {
  return (
    <div className="foot">
      <div>{left}</div>
      <div>{right}</div>
    </div>
  );
}

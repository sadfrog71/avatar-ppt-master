import React from 'react';

export function Rule({ variant = '', vertical = false }) {
  return <div className={`rule ${vertical ? 'v' : ''} ${variant}`.trim()} />;
}

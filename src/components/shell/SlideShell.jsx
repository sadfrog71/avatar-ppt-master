import React from 'react';

export function SlideShell({ layout, tone = 'light', hero = false, animate = 'cascade', className = '', children }) {
  const classes = ['slide', hero ? 'hero' : '', tone, className].filter(Boolean).join(' ');
  return (
    <section className={classes} data-layout={layout} data-animate={animate}>
      {children}
    </section>
  );
}

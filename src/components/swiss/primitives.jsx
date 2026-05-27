import React from 'react';
import { Icon as SharedIcon } from '../decorations/index.jsx';
import { MetricRow as SharedMetricRow } from '../metrics/index.jsx';

export const ON_ACCENT = 'var(--focus-fg)';
export const ON_ACCENT_22 = 'color-mix(in srgb, var(--focus-fg) 22%, transparent)';
export const ON_ACCENT_60 = 'color-mix(in srgb, var(--focus-fg) 60%, transparent)';
export const ON_ACCENT_62 = 'color-mix(in srgb, var(--focus-fg) 62%, transparent)';
export const ON_ACCENT_78 = 'color-mix(in srgb, var(--focus-fg) 78%, transparent)';
export const ON_ACCENT_82 = 'color-mix(in srgb, var(--focus-fg) 82%, transparent)';
export const ON_ACCENT_86 = 'color-mix(in srgb, var(--focus-fg) 86%, transparent)';

export function Icon({ name }) {
  return <SharedIcon name={name} />;
}

export function SwissSlide({ layout, animate = 'cascade', className = '', children }) {
  return (
    <section className={`slide canvas-slide ${className}`.trim()} data-layout={layout} data-animate={animate}>
      {children}
    </section>
  );
}

export function CanvasCard({ children }) {
  return <div className="canvas-card">{children}</div>;
}

export function Chrome({ left, right }) {
  return (
    <div className="chrome-min">
      <div className="l">{left}</div>
      <div className="r">{right}</div>
    </div>
  );
}

export function MetricRow({ metrics }) {
  return <SharedMetricRow metrics={metrics} />;
}

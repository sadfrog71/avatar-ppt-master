import React from 'react';

export const ON_ACCENT = 'var(--accent-on)';
export const ON_ACCENT_22 = 'color-mix(in srgb, var(--accent-on) 22%, transparent)';
export const ON_ACCENT_60 = 'color-mix(in srgb, var(--accent-on) 60%, transparent)';
export const ON_ACCENT_62 = 'color-mix(in srgb, var(--accent-on) 62%, transparent)';
export const ON_ACCENT_78 = 'color-mix(in srgb, var(--accent-on) 78%, transparent)';
export const ON_ACCENT_82 = 'color-mix(in srgb, var(--accent-on) 82%, transparent)';
export const ON_ACCENT_86 = 'color-mix(in srgb, var(--accent-on) 86%, transparent)';

export function Icon({ name }) {
  return <i data-lucide={name} />;
}

export function SwissSlide({ layout, animate = 'cascade', className = '', children }) {
  return (
    <section className={`slide ${className}`.trim()} data-layout={layout} data-animate={animate}>
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
  return (
    <div className="kpi-row-4">
      {metrics.map((metric) => (
        <div key={metric.label} className="kpi-cell">
          <div className="lbl">{metric.label}</div>
          <div className="nb">{metric.value}</div>
          <p className="note">{metric.note}</p>
        </div>
      ))}
    </div>
  );
}

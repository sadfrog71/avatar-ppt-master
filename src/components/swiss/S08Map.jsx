import React from 'react';
import { CanvasCard, Chrome, SwissSlide } from './primitives.jsx';

const defaultPoints = [
  { id: 'north', name: '北站', meta: '入口', x: 62, y: 28, accent: true },
  { id: 'west', name: '西街', meta: '旧区', x: 30, y: 45 },
  { id: 'center', name: '中庭', meta: '枢纽', x: 51, y: 55, accent: true },
  { id: 'east', name: '东岸', meta: '新区', x: 70, y: 50 },
  { id: 'south', name: '南仓', meta: '补给', x: 44, y: 76 },
];

const defaultRelations = [
  ['north', 'center'],
  ['west', 'center'],
  ['center', 'east'],
  ['center', 'south'],
];

export function SwissS08MapSlide({
  page = '08B',
  title,
  kicker,
  summary,
  cards,
  mapTitle,
  points = defaultPoints,
  relations = defaultRelations,
}) {
  return (
    <SwissSlide layout="S08" animate="duo-mirror">
      <CanvasCard>
        <Chrome left={`${page} · S08 MAP COMPONENT`} right="S08 EXT" />
        <div data-anim="line" style={{ display: 'flex', flexDirection: 'column', gap: '1.2vh' }}>
          <div className="t-meta">{kicker}</div>
          <h2 className="h-xl-zh" style={{ fontSize: 'min(5.4vw,9.4vh)' }}>{title}</h2>
        </div>
        <div className="duo-compare" style={{ marginTop: '4vh', gridTemplateColumns: '4.2fr 1px 7.8fr', gap: '0 2vw' }}>
          <aside className="col" style={{ gap: '1vh' }}>
            <div className="card-accent" style={{ padding: '2.2vh 1.4vw', minHeight: '13vh' }}>
              <div className="t-meta">{summary.kicker}</div>
              <div style={{ fontFamily: 'var(--sans),var(--sans-zh)', fontSize: 'max(22px,2vw)', lineHeight: 1.1, letterSpacing: '-.02em', marginTop: '1vh' }}>{summary.title}</div>
              <p className="t-body-sm" style={{ marginTop: '1vh' }}>{summary.body}</p>
            </div>
            {cards.map((card, index) => (
              <div key={card.title} className="card-fill" style={{ padding: '1.5vh 1.1vw', display: 'grid', gridTemplateColumns: '3em 1fr', gap: '.8vw', alignItems: 'start' }}>
                <div className="t-meta" style={{ color: 'var(--focus-mark)' }}>{String(index + 1).padStart(2, '0')}</div>
                <div>
                  <div className="t-h-prod" style={{ fontSize: 'max(16px,1vw)' }}>{card.title}</div>
                  <div className="t-body-sm" style={{ marginTop: '.4vh', fontSize: 'max(14px,.82vw)' }}>{card.body}</div>
                </div>
              </div>
            ))}
          </aside>
          <div className="vrule" />
          <div className="col accent" style={{ minHeight: 0 }}>
            <div style={{ position: 'relative', flex: 1, background: 'var(--grey-1)', overflow: 'hidden', minHeight: '48vh' }}>
              <MapGrid title={mapTitle} points={points} relations={relations} />
            </div>
          </div>
        </div>
      </CanvasCard>
    </SwissSlide>
  );
}

function MapGrid({ title, points, relations }) {
  const byId = new Map(points.map((point) => [point.id, point]));

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(18deg,transparent 0 44%,rgba(var(--ink-rgb),.11) 44% 44.2%,transparent 44.2%),linear-gradient(-8deg,transparent 0 54%,rgba(var(--ink-rgb),.09) 54% 54.16%,transparent 54.16%),linear-gradient(0deg,transparent 0 61%,rgba(var(--ink-rgb),.08) 61% 61.15%,transparent 61.15%),var(--grey-1)' }}>
      <div style={{ position: 'absolute', top: '1.4vh', left: '1.2vw', zIndex: 2, background: 'rgba(var(--paper-rgb),.92)', padding: '1.2vh 1vw', maxWidth: '28vw' }}>
        <div className="t-meta">RELATION MAP</div>
        <div className="t-h-prod" style={{ marginTop: '.4vh' }}>{title}</div>
      </div>
      <div style={{ position: 'absolute', top: '1.4vh', right: '1.2vw', zIndex: 2, display: 'flex', gap: 6, background: 'rgba(var(--paper-rgb),.9)', padding: 6 }}>
        <button type="button" style={ctrlStyle}>+</button>
        <button type="button" style={ctrlStyle}>-</button>
        <button type="button" style={{ ...ctrlStyle, minWidth: 58 }}>DRAG</button>
      </div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        {relations.map(([fromId, toId]) => {
          const from = byId.get(fromId);
          const to = byId.get(toId);
          if (!from || !to) return null;
          return <line key={`${fromId}-${toId}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="var(--focus-mark)" strokeWidth=".24" strokeDasharray="1.4 1.2" opacity=".68" />;
        })}
      </svg>
      {points.map((point) => (
        <div key={point.id} style={{ position: 'absolute', left: `${point.x}%`, top: `${point.y}%`, transform: 'translate(-50%,-50%)' }}>
          <span style={{ position: 'absolute', left: -6, top: -6, width: 12, height: 12, borderRadius: '50%', background: point.accent ? 'var(--focus-mark)' : 'var(--ink)', border: '2px solid var(--paper)', boxShadow: '0 0 0 1px rgba(var(--ink-rgb),.22)' }} />
          <span style={{ position: 'absolute', left: point.side === 'left' ? 'auto' : 7, right: point.side === 'left' ? 7 : 'auto', top: 0, width: 24, height: 1, background: point.accent ? 'var(--focus-mark)' : 'var(--ink)', opacity: point.accent ? .75 : .45 }} />
          <span style={{ position: 'absolute', left: point.side === 'left' ? 'auto' : 31, right: point.side === 'left' ? 31 : 'auto', top: -18, minWidth: 76, background: 'rgba(var(--paper-rgb),.9)', padding: '6px 7px', whiteSpace: 'nowrap' }}>
            <span style={{ display: 'block', fontFamily: 'var(--sans),var(--sans-zh)', fontSize: 12, lineHeight: 1.05, color: point.accent ? 'var(--focus-mark)' : 'var(--ink)' }}>{point.name}</span>
            <span style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: 9, lineHeight: 1, letterSpacing: '.12em', color: 'var(--text-helper)', marginTop: 4, textTransform: 'uppercase' }}>{point.meta}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

const ctrlStyle = {
  minWidth: 32,
  height: 32,
  border: '1px solid var(--ink)',
  background: 'transparent',
  color: 'var(--ink)',
  fontFamily: 'var(--mono)',
  fontSize: 12,
  letterSpacing: '.08em',
  textTransform: 'uppercase',
};

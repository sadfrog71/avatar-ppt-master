import React from 'react';
import { CanvasCard, Chrome, Icon, SwissSlide } from './primitives.jsx';

export function SwissS20StackedLedger({ page = '20', title, kicker, rows }) {
  return (
    <SwissSlide layout="S20" animate="stacked-ledger">
      <CanvasCard>
        <Chrome left={`${page} · STACKED KPI LEDGER`} right="S20" />
        <div data-anim="ledger" style={{ flex: 1, display: 'grid', gridTemplateRows: 'auto 1fr', gap: '4vh' }}>
          <div>
            <div className="t-meta">{kicker}</div>
            <h2 className="h-xl-zh" style={{ fontSize: 'min(5.8vw,10.2vh)', marginTop: '1vh' }}>{title}</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'stretch' }}>
            {rows.map((row, index) => (
              <div key={row.label} className="ledger-row" style={{ flex: 1, display: 'grid', gridTemplateColumns: '24vw 1fr 6vw', gap: '2vw', alignItems: 'center', borderTop: '1px solid var(--grey-2)', borderBottom: index === rows.length - 1 ? '2px solid var(--focus-mark)' : undefined }}>
                <div className="ledger-num kpi-thin-sm" style={{ color: row.accent ? 'var(--focus-mark)' : 'var(--ink)' }}>{row.value}</div>
                <div className="ledger-label">
                  <div className="t-h-prod">{row.label}</div>
                  <p className="t-body-sm" style={{ marginTop: '.6vh' }}>{row.body}</p>
                </div>
                <div className="ledger-icon" style={{ color: row.accent ? 'var(--focus-mark)' : 'var(--ink)' }}>{row.icon ? <Icon name={row.icon} /> : null}</div>
              </div>
            ))}
          </div>
        </div>
      </CanvasCard>
    </SwissSlide>
  );
}

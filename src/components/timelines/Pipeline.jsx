import React from 'react';

export function Pipeline({ sections }) {
  return (
    <>
      {sections.map((section) => (
        <div key={section.label} className="pipeline-section">
          <div className="pipeline-label">{section.label}</div>
          <div className="pipeline" data-cols={String(section.steps.length)}>
            {section.steps.map((step) => (
              <div key={step.number} className={`step ${step.accent ? 'accent-top' : ''}`} data-anim="step">
                <div className="step-nb">{step.number}</div>
                <div className="step-title">{step.title}</div>
                <div className="step-desc">{step.body}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

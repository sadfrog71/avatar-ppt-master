const serifVars = {
  '--serif-en': 'Georgia,"Times New Roman",serif',
  '--serif-body-en': 'Georgia,"Times New Roman",serif',
  '--serif-zh': '"Songti SC","Noto Serif SC","Source Han Serif SC",serif',
};

const sansDisplayVars = {
  '--font-display': 'var(--sans),var(--sans-zh)',
  '--font-heading': 'var(--sans),var(--sans-zh)',
  '--font-body': 'var(--sans),var(--sans-zh)',
  '--weight-display': '200',
  '--weight-heading': '300',
  '--weight-strong': '600',
  '--weight-body': '400',
  '--ls-display': '-.04em',
  '--ls-heading': '-.025em',
};

export const FONT_OPTIONS = {
  inter: {
    label: 'Inter / Noto Sans SC / JetBrains Mono',
    vars: {
      '--sans': '"Inter","Helvetica Neue","Helvetica","Arial","Segoe UI Variable","Segoe UI",system-ui,-apple-system,sans-serif',
      '--sans-zh': '"PingFang SC","Hiragino Sans GB","Source Han Sans SC","Noto Sans SC","Microsoft YaHei UI","Microsoft YaHei","微软雅黑",sans-serif',
      '--mono': '"JetBrains Mono","IBM Plex Mono","SF Mono","Cascadia Code","Consolas","Courier New",ui-monospace,monospace',
      ...serifVars,
      ...sansDisplayVars,
    },
  },
  system: {
    label: 'System UI / Microsoft YaHei / Consolas',
    vars: {
      '--sans': '"Helvetica Neue","Arial","Segoe UI Variable","Segoe UI",system-ui,-apple-system,sans-serif',
      '--sans-zh': '"Microsoft YaHei UI","Microsoft YaHei","Noto Sans SC","PingFang SC",sans-serif',
      '--mono': '"Consolas","SF Mono","Cascadia Code","Courier New",ui-monospace,monospace',
      ...serifVars,
      ...sansDisplayVars,
    },
  },
  compact: {
    label: 'Helvetica Bold / Noto Sans SC / JetBrains Mono',
    vars: {
      '--sans': '"Helvetica Neue","Helvetica","Arial Narrow","Arial",system-ui,-apple-system,sans-serif',
      '--sans-zh': '"Noto Sans SC","PingFang SC","Microsoft YaHei UI","Microsoft YaHei",sans-serif',
      '--mono': '"JetBrains Mono","SF Mono","Consolas","Courier New",ui-monospace,monospace',
      ...serifVars,
      '--font-display': 'var(--sans),var(--sans-zh)',
      '--font-heading': 'var(--sans),var(--sans-zh)',
      '--font-body': 'var(--sans),var(--sans-zh)',
      '--weight-display': '700',
      '--weight-heading': '650',
      '--weight-strong': '800',
      '--weight-body': '450',
      '--ls-display': '-.035em',
      '--ls-heading': '-.02em',
    },
  },
  editorial: {
    label: 'Editorial Serif / Noto Serif SC / IBM Plex Mono',
    vars: {
      '--sans': '"Noto Sans SC","Helvetica Neue","Arial",system-ui,-apple-system,sans-serif',
      '--sans-zh': '"Noto Sans SC","PingFang SC","Microsoft YaHei UI","Microsoft YaHei",sans-serif',
      '--mono': '"IBM Plex Mono","JetBrains Mono","SF Mono","Consolas",ui-monospace,monospace',
      '--serif-en': '"Playfair Display","Source Serif 4",Georgia,serif',
      '--serif-body-en': '"Source Serif 4",Georgia,serif',
      '--serif-zh': '"Noto Serif SC","Songti SC","Source Han Serif SC",serif',
      '--font-display': 'var(--serif-zh),var(--serif-en)',
      '--font-heading': 'var(--serif-zh),var(--serif-en)',
      '--font-body': 'var(--serif-body-en),var(--serif-zh)',
      '--weight-display': '800',
      '--weight-heading': '650',
      '--weight-strong': '800',
      '--weight-body': '400',
      '--ls-display': '-.01em',
      '--ls-heading': '0',
    },
  },
};

export const DEFAULT_FONT = 'inter';

import React from 'react';
import {
  SwissClosing,
  SwissCover,
  SwissHBarSlide,
  SwissImageHeroSlide,
  SwissKpiTowerSlide,
  SwissS01IndexCover,
  SwissS03SplitStatement,
  SwissS05ThreeLayers,
  SwissS08DuoCompare,
  SwissS08MapSlide,
  SwissS09DotMatrixStatement,
  SwissS10SplitClosing,
  SwissS11HorizontalTimeline,
  SwissS12ManifestoBanner,
  SwissS13ThreeForces,
  SwissS14LoopForm,
  SwissS15MatrixHeroStat,
  SwissS16MultiCardBrief,
  SwissS17SystemDiagram,
  SwissS18WhyNow,
  SwissS19FourCards,
  SwissS20StackedLedger,
  SwissS21TechSpec,
  SwissSixCellsSlide,
  SwissTimelineSlide,
} from './components/swiss/index.jsx';

export const THEME_OPTIONS = {
  ikb: {
    label: '克莱因蓝 IKB',
    vars: {
      '--paper': '#fafaf8',
      '--paper-rgb': '250,250,248',
      '--ink': '#0a0a0a',
      '--ink-rgb': '10,10,10',
      '--grey-1': '#f0f0ee',
      '--grey-2': '#d4d4d2',
      '--grey-3': '#737373',
      '--accent': '#002FA7',
      '--accent-rgb': '0,47,167',
      '--accent-on': '#ffffff',
      '--accent-bright': '#5B7BFF',
    },
  },
  lemon: {
    label: '柠檬黄',
    vars: {
      '--paper': '#fafaf8',
      '--paper-rgb': '250,250,248',
      '--ink': '#0a0a0a',
      '--ink-rgb': '10,10,10',
      '--grey-1': '#f0f0ee',
      '--grey-2': '#d4d4d2',
      '--grey-3': '#737373',
      '--accent': '#FFD500',
      '--accent-rgb': '255,213,0',
      '--accent-on': '#0a0a0a',
      '--accent-bright': '#FFD500',
    },
  },
  green: {
    label: '柠檬绿',
    vars: {
      '--paper': '#fafaf8',
      '--paper-rgb': '250,250,248',
      '--ink': '#0a0a0a',
      '--ink-rgb': '10,10,10',
      '--grey-1': '#f0f0ee',
      '--grey-2': '#d4d4d2',
      '--grey-3': '#737373',
      '--accent': '#C5E803',
      '--accent-rgb': '197,232,3',
      '--accent-on': '#0a0a0a',
      '--accent-bright': '#C5E803',
    },
  },
  orange: {
    label: '安全橙',
    vars: {
      '--paper': '#fafaf8',
      '--paper-rgb': '250,250,248',
      '--ink': '#0a0a0a',
      '--ink-rgb': '10,10,10',
      '--grey-1': '#f0f0ee',
      '--grey-2': '#d4d4d2',
      '--grey-3': '#737373',
      '--accent': '#FF6B35',
      '--accent-rgb': '255,107,53',
      '--accent-on': '#ffffff',
      '--accent-bright': '#FF6B35',
    },
  },
};

export const FONT_OPTIONS = {
  inter: {
    label: 'Inter / Noto Sans SC / JetBrains Mono',
    vars: {
      '--sans': '"Inter","Helvetica Neue","Helvetica","Arial","Segoe UI Variable","Segoe UI",system-ui,-apple-system,sans-serif',
      '--sans-zh': '"PingFang SC","Hiragino Sans GB","Source Han Sans SC","Noto Sans SC","Microsoft YaHei UI","Microsoft YaHei","微软雅黑",sans-serif',
      '--mono': '"JetBrains Mono","IBM Plex Mono","SF Mono","Cascadia Code","Consolas","Courier New",ui-monospace,monospace',
    },
  },
  system: {
    label: 'System UI / Microsoft YaHei / Consolas',
    vars: {
      '--sans': '"Helvetica Neue","Arial","Segoe UI Variable","Segoe UI",system-ui,-apple-system,sans-serif',
      '--sans-zh': '"Microsoft YaHei UI","Microsoft YaHei","Noto Sans SC","PingFang SC",sans-serif',
      '--mono': '"Consolas","SF Mono","Cascadia Code","Courier New",ui-monospace,monospace',
    },
  },
  compact: {
    label: 'Helvetica Compact / Noto Sans SC / JetBrains Mono',
    vars: {
      '--sans': '"Helvetica Neue","Helvetica","Arial Narrow","Arial",system-ui,-apple-system,sans-serif',
      '--sans-zh': '"Noto Sans SC","PingFang SC","Microsoft YaHei UI","Microsoft YaHei",sans-serif',
      '--mono': '"JetBrains Mono","SF Mono","Consolas","Courier New",ui-monospace,monospace',
    },
  },
};

export const LAYOUT_OPTIONS = {
  s01: {
    label: 'S01 Index Cover',
    dataLayout: 'S01',
    component: SwissS01IndexCover,
  },
  s02: {
    label: 'S02 Vertical Timeline + KPI',
    dataLayout: 'S02',
    component: SwissTimelineSlide,
  },
  s03: {
    label: 'S03 Split Statement',
    dataLayout: 'S03',
    component: SwissS03SplitStatement,
  },
  s04: {
    label: 'S04 Six Cells',
    dataLayout: 'S04',
    component: SwissSixCellsSlide,
  },
  s05: {
    label: 'S05 Three Layers',
    dataLayout: 'S05',
    component: SwissS05ThreeLayers,
  },
  s06: {
    label: 'S06 KPI Tower',
    dataLayout: 'S06',
    component: SwissKpiTowerSlide,
  },
  s07: {
    label: 'S07 Horizontal Bar Chart',
    dataLayout: 'S07',
    component: SwissHBarSlide,
  },
  s08: {
    label: 'S08 Duo Compare',
    dataLayout: 'S08',
    component: SwissS08DuoCompare,
  },
  s08Map: {
    label: 'S08 + Swiss Map Component',
    dataLayout: 'S08',
    component: SwissS08MapSlide,
  },
  s09: {
    label: 'S09 Dot Matrix Statement',
    dataLayout: 'S09',
    component: SwissS09DotMatrixStatement,
  },
  s10: {
    label: 'S10 Split Closing',
    dataLayout: 'S10',
    component: SwissS10SplitClosing,
  },
  s11: {
    label: 'S11 Horizontal Timeline',
    dataLayout: 'S11',
    component: SwissS11HorizontalTimeline,
  },
  s12: {
    label: 'S12 Manifesto + Ink Banner',
    dataLayout: 'S12',
    component: SwissS12ManifestoBanner,
  },
  s13: {
    label: 'S13 Three Forces',
    dataLayout: 'S13',
    component: SwissS13ThreeForces,
  },
  s14: {
    label: 'S14 Loop Form',
    dataLayout: 'S14',
    component: SwissS14LoopForm,
  },
  s15: {
    label: 'S15 Matrix + Hero Stat',
    dataLayout: 'S15',
    component: SwissS15MatrixHeroStat,
  },
  s16: {
    label: 'S16 Multi-card Brief',
    dataLayout: 'S16',
    component: SwissS16MultiCardBrief,
  },
  s17: {
    label: 'S17 System Diagram',
    dataLayout: 'S17',
    component: SwissS17SystemDiagram,
  },
  s18: {
    label: 'S18 Why Now',
    dataLayout: 'S18',
    component: SwissS18WhyNow,
  },
  s19: {
    label: 'S19 Four Cards',
    dataLayout: 'S19',
    component: SwissS19FourCards,
  },
  s20: {
    label: 'S20 Stacked KPI Ledger',
    dataLayout: 'S20',
    component: SwissS20StackedLedger,
  },
  s21: {
    label: 'S21 Tech Spec Sheet',
    dataLayout: 'S21',
    component: SwissS21TechSpec,
  },
  s22: {
    label: 'S22 Image Hero',
    dataLayout: 'S22',
    component: SwissImageHeroSlide,
  },
  cover: {
    label: 'Cover',
    dataLayout: 'SWISS-COVER-ASCII',
    component: SwissCover,
  },
  timeline: {
    label: 'Vertical Timeline + KPI',
    dataLayout: 'S02',
    component: SwissTimelineSlide,
  },
  sixCells: {
    label: 'Six Cells',
    dataLayout: 'S04',
    component: SwissSixCellsSlide,
  },
  kpiTower: {
    label: 'KPI Tower',
    dataLayout: 'S06',
    component: SwissKpiTowerSlide,
  },
  hBar: {
    label: 'Horizontal Bar Chart',
    dataLayout: 'S07',
    component: SwissHBarSlide,
  },
  imageHero: {
    label: 'Image Hero',
    dataLayout: 'S22',
    component: SwissImageHeroSlide,
  },
  closing: {
    label: 'Closing Manifesto',
    dataLayout: 'SWISS-CLOSING-ASCII',
    component: SwissClosing,
  },
};

export const DEFAULT_THEME = 'ikb';
export const DEFAULT_FONT = 'inter';

export function slide(layoutName, props) {
  const option = LAYOUT_OPTIONS[layoutName];
  if (!option) {
    throw new Error(`Unknown layout "${layoutName}". Choose one of: ${Object.keys(LAYOUT_OPTIONS).join(', ')}`);
  }
  const Component = option.component;
  return <Component {...props} />;
}

export function resolveOption(registry, name, fallback, label) {
  const key = name ?? fallback;
  const option = registry[key];
  if (!option) {
    throw new Error(`Unknown ${label} "${key}". Choose one of: ${Object.keys(registry).join(', ')}`);
  }
  return { key, option };
}

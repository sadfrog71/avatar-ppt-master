import React from 'react';
import SwImageSlot from './SwImageSlot.jsx';

export const SW_UNICORN_BACKGROUND_CONTROL = {
  key: 'backgroundMode',
  label: '背景替换',
  type: 'segment',
  def: 'unicorn',
  options: [
    { value: 'unicorn', label: '动态' },
    { value: 'media', label: '上传' },
  ],
  desc: '动态 shader 或自定义背景媒体',
};

export function SwBackgroundLayer({ mode = 'unicorn', media = [], onMediaChange = () => {}, fit = 'cover', accent, placeholder, tone = 'dark' }) {
  const value = Array.isArray(media) ? media[0] : media;
  if (!value && mode === 'unicorn') return <SwUnicornBackground accent={accent} />;
  return (
    <SwImageSlot value={value || null} onChange={(s) => onMediaChange(0, s)}
      fit={fit} accent={accent} radius={0} tone={tone} placeholder={placeholder} />
  );
}

export default function SwUnicornBackground({ accent = '#f15a29' }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    let frame = 0;
    let raf = 0;
    canvas.dataset.unicornLoading = 'true';
    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const draw = (time) => {
      frame += 1;
      const w = canvas.clientWidth || 1920;
      const h = canvas.clientHeight || 1080;
      const t = time * 0.00022;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#120a12';
      ctx.fillRect(0, 0, w, h);
      drawGlow(ctx, w, h, w * (0.22 + Math.sin(t) * 0.08), h * (0.34 + Math.cos(t * 1.4) * 0.1), accent, 0.95);
      drawGlow(ctx, w, h, w * (0.78 + Math.sin(t * 1.2) * 0.07), h * (0.58 + Math.cos(t * 0.9) * 0.12), '#36d6ff', 0.58);
      drawGlow(ctx, w, h, w * (0.54 + Math.cos(t * 0.8) * 0.08), h * (0.25 + Math.sin(t * 1.1) * 0.08), '#baf04f', 0.36);
      ctx.globalCompositeOperation = 'screen';
      for (let i = 0; i < 8; i++) {
        const y = h * (0.15 + i * 0.1) + Math.sin(t * 4 + i) * 16;
        const grad = ctx.createLinearGradient(0, y, w, y + 80);
        grad.addColorStop(0, 'rgba(255,255,255,0)');
        grad.addColorStop(0.5, 'rgba(255,255,255,0.05)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, y, w, 70);
      }
      ctx.globalCompositeOperation = 'source-over';
      if (frame > 2) canvas.dataset.unicornLoading = 'false';
      raf = requestAnimationFrame(draw);
    };
    resize();
    addEventListener('resize', resize);
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('resize', resize);
    };
  }, [accent]);

  return (
    <canvas ref={ref} data-unicorn-scene="true" aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', background: '#120a12' }} />
  );
}

function drawGlow(ctx, w, h, x, y, color, alpha) {
  const r = Math.max(w, h) * 0.62;
  const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
  grad.addColorStop(0, hexAlpha(color, alpha));
  grad.addColorStop(0.34, hexAlpha(color, alpha * 0.38));
  grad.addColorStop(1, hexAlpha(color, 0));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
}

function hexAlpha(hex, alpha) {
  const raw = String(hex || '#ffffff').replace('#', '');
  const full = raw.length === 3 ? raw.split('').map(c => c + c).join('') : raw;
  const r = parseInt(full.slice(0, 2), 16) || 255;
  const g = parseInt(full.slice(2, 4), 16) || 255;
  const b = parseInt(full.slice(4, 6), 16) || 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

import React from "react";

/* ============================================================================
   Decor — an optional "stuck-on" 3D sticker emblem.
   Pure presentational: absolutely positioned inside a slide's `.rd-slide`
   (which is position:relative). Renders nothing unless `show && src`.
   Portable — no globals, no runtime deps. Position/size are passed in so each
   slide can anchor it to its own whitespace.
   ========================================================================== */

export default function Decor({ show, src, scale = 1, base = 280, rotate = 0, pos = {} }) {
  if (!show || !src) return null;
  return (
    <img
      className="rd-anim rd-anim-4"
      src={src}
      alt=""
      aria-hidden="true"
      style={{
        position: "absolute",
        width: Math.round(base * (scale || 1)),
        height: "auto",
        transform: `rotate(${rotate}deg)`,
        filter: "drop-shadow(0 24px 28px rgba(22,21,19,0.26))",
        pointerEvents: "none",
        zIndex: 4,
        ...pos,
      }}
    />
  );
}

export const decorControls = [];

export const decorDefaults = {};

/* ----------------------------------------------------------------------------
   Hero3D — a 3D element INTERLEAVED with a headline (punches through / sits
   between the big title text). Only a drop-shadow is kept (no light halo/mask)
   so it reads as a sticker pressed onto the composition. Same prop semantics as
   Decor but anchored larger and higher z.
   Position is passed per slide so it can land in the title gap / over a figure.
   -------------------------------------------------------------------------- */
export function Hero3D({ show, src, scale = 1, base = 420, rotate = 0, pos = {}, z = 3 }) {
  if (!show || !src) return null;
  const size = Math.round(base * (scale || 1));
  return (
    <div className="rd-anim rd-anim-2" style={{ position: "absolute", zIndex: z, pointerEvents: "none", ...pos }}>
      <img src={src} alt="" aria-hidden="true" style={{
        position: "relative", display: "block",
        width: size, height: "auto",
        transform: `rotate(${rotate}deg)`,
        filter: "drop-shadow(0 26px 30px rgba(22,21,19,0.34)) drop-shadow(0 9px 14px rgba(22,21,19,0.24))",
      }} />
    </div>
  );
}

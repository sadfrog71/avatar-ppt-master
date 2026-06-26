#!/usr/bin/env python3
"""Validate spec_lock.md ## palette_roles + ## page_groups + typography lockdown
and (in full stage) the rendered SVG output for palette / group / font conformance.

Batch C visual-consistency gate. Two stages:

    --stage=lock-only       Validate spec_lock schema only (Step 6 entry gate).
    --stage=all (default)   Validate spec_lock schema + scan svg_output/*.svg
                            for font / palette / group anchor conformance
                            (Step 6 exit gate alongside svg_quality_checker.py).

Grammar enforced under ``## palette_roles``::

    - <role>: #RRGGBB
    - <role>: #RRGGBBAA

Required roles: bg_canvas, text_primary, text_secondary, border_subtle,
accent_primary. Role names use [a-z0-9_]+ and must be unique.

Grammar enforced under ``## page_groups`` (one row per page in ## page_focal)::

    P<NN>: <group>=[<slot>, <slot>, ...] | <group>=[<slot>, ...] | ...

Slot tokens are L1, L2_<N>, L3_<N> referring to items in the matching
``## page_focal`` row. All L1/L2/L3 items must be covered exactly once by
the union of slots on that page (no cross-group duplicates).

Exit codes (match scripts/batch_validate.py and validate_focal_hierarchy.py):

    0 - all checks pass
    1 - one or more hard errors
    2 - no errors, warnings only
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Iterable
from xml.etree import ElementTree as ET

# ---------------------------------------------------------------------------
# Sibling imports: reuse parse_lock + the font-stack normalizer.
# ---------------------------------------------------------------------------
_SCRIPT_DIR = Path(__file__).resolve().parent
if str(_SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(_SCRIPT_DIR))

try:
    from update_spec import parse_lock  # type: ignore
except ImportError as exc:  # pragma: no cover
    print(f"[FATAL] Cannot import parse_lock from update_spec: {exc}")
    raise SystemExit(1)

# Optional: reuse svg_quality_checker._normalize_font_stack when available so we
# stay consistent with that tool's font-comparison semantics. Fall back to a
# local copy if the import path is unavailable in legacy installs.
try:
    from svg_quality_checker import SvgQualityChecker as _SQC  # type: ignore
    _normalize_font_stack = _SQC._normalize_font_stack  # type: ignore[attr-defined]
except Exception:  # pragma: no cover
    def _normalize_font_stack(stack: str) -> str:
        parts = [p.strip().strip('"\'').lower() for p in stack.split(',')]
        return ','.join(p for p in parts if p)


# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------
REQUIRED_ROLES = (
    "bg_canvas",
    "text_primary",
    "text_secondary",
    "border_subtle",
    "accent_primary",
)

GROUP_COUNT_OK = (2, 4)   # outside [2, 4] -> warning

PAGE_KEY_RE = re.compile(r"^P\d{2}$")
ROLE_NAME_RE = re.compile(r"^[a-z0-9_]+$")
HEX_VALUE_RE = re.compile(r"^#(?:[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$")
ANY_HEX_IN_TEXT_RE = re.compile(r"#[0-9A-Fa-f]{6,8}")

GROUP_NAME_RE = re.compile(r"^[a-z0-9_]+$")
SLOT_RE = re.compile(r"^L([123])(?:_([0-9]+))?$")
PAGE_GROUP_ROW_RE = re.compile(
    r"^\s*([a-z0-9_]+)\s*=\s*\[([^\]]*)\]\s*$"
)

# Focal row shape (we only need to count L1/L2/L3 lengths to validate slot
# references; we do not re-validate focal grammar here -- that is
# validate_focal_hierarchy.py's job).
FOCAL_ROW_RE = re.compile(
    r'^\s*L1\s*=\s*"(?P<l1>[^"]*)"\s*'
    r'\|\s*L2\s*=\s*\[(?P<l2>[^\]]*)\]\s*'
    r'\|\s*L3\s*=\s*\[(?P<l3>[^\]]*)\]\s*$'
)

_DESIGN_SPEC_PAGE_RE = re.compile(r"\bP(\d{2})\b")
_DESIGN_SPEC_IX_HEADER_RE = re.compile(
    r"^\s*(?:#{1,6}\s*)?(?:IX|\u7b2c\u4e5d|\u4e5d)[\.\u3001 ]", re.IGNORECASE
)
_DESIGN_SPEC_X_HEADER_RE = re.compile(
    r"^\s*(?:#{1,6}\s*)?(?:X|\u7b2c\u5341|\u5341)[\.\u3001 ]", re.IGNORECASE
)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def _split_list(raw: str) -> list[str]:
    if not raw.strip():
        return []
    return [part.strip() for part in raw.split(",") if part.strip()]


def _split_groups(raw: str) -> list[str]:
    """Split a page_groups value on the pipe (|) separator.

    The pipe is the group separator. Inside a group, the value is
    `<name>=[<slot>, <slot>, ...]`; commas only appear inside the brackets.
    """
    return [part.strip() for part in raw.split("|") if part.strip()]


def _parse_design_spec_pages(design_spec_path: Path | None) -> list[str]:
    if design_spec_path is None or not design_spec_path.exists():
        return []
    text = design_spec_path.read_text(encoding="utf-8", errors="replace")
    in_ix = False
    seen: set[str] = set()
    ordered: list[str] = []
    for raw in text.splitlines():
        if _DESIGN_SPEC_IX_HEADER_RE.search(raw):
            in_ix = True
            continue
        if in_ix and _DESIGN_SPEC_X_HEADER_RE.search(raw):
            break
        if in_ix:
            for m in _DESIGN_SPEC_PAGE_RE.finditer(raw):
                key = f"P{m.group(1)}"
                if key not in seen:
                    seen.add(key)
                    ordered.append(key)
    if not ordered:
        for m in _DESIGN_SPEC_PAGE_RE.finditer(text):
            key = f"P{m.group(1)}"
            if key not in seen:
                seen.add(key)
                ordered.append(key)
    return ordered


def _focal_lengths(focal_rows: dict[str, str]) -> dict[str, dict[str, int]]:
    """Return {page: {'L1': n, 'L2': n, 'L3': n}} parsed from focal rows.

    Pages whose focal grammar is broken are dropped (the focal validator will
    flag them); we only need lengths to validate slot indices.
    """
    out: dict[str, dict[str, int]] = {}
    for page, raw in focal_rows.items():
        m = FOCAL_ROW_RE.match(raw)
        if not m:
            continue
        out[page] = {
            "L1": 1 if m.group("l1").strip() else 0,
            "L2": len(_split_list(m.group("l2"))),
            "L3": len(_split_list(m.group("l3"))),
        }
    return out


# ---------------------------------------------------------------------------
# Validator
# ---------------------------------------------------------------------------
class VisualConsistencyValidator:
    """Enforce palette / group / font lockdown invariants."""

    DESIGN_SPEC_CANDIDATES = (
        "design_spec.md",
        "\u8bbe\u8ba1\u89c4\u8303\u4e0e\u5185\u5bb9\u5927\u7eb2.md",
        "design_specification.md",
        "\u8bbe\u8ba1\u89c4\u8303.md",
    )

    def __init__(self, project_path: Path, stage: str = "all") -> None:
        self.project_path = Path(project_path).resolve()
        self.lock_path = self.project_path / "spec_lock.md"
        self.svg_dir = self.project_path / "svg_output"
        self.stage = stage
        self.design_spec_path: Path | None = None
        for candidate in self.DESIGN_SPEC_CANDIDATES:
            p = self.project_path / candidate
            if p.exists():
                self.design_spec_path = p
                break

        self.results: list[dict] = []
        self.summary: dict = {
            "pages_total": 0,
            "ok": 0,
            "warnings": 0,
            "errors": 0,
            "svg_files_scanned": 0,
            "stage": stage,
        }
        # Populated by lock-stage checks; consumed by SVG-stage checks.
        self._palette_hex: set[str] = set()
        self._allowed_fonts: set[str] = set()
        self._page_groups: dict[str, list[tuple[str, list[str]]]] = {}

    # ------------------------------------------------------------------ run
    def run(self) -> int:
        if not self._check_lock_present():
            return 1

        sections = parse_lock(self.lock_path)
        # Always run lock-stage checks.
        self._check_palette_roles_section(sections)
        self._check_typography_section(sections)
        self._check_page_groups_section(sections)

        if self.stage != "lock-only":
            self._scan_svgs()

        return self._exit_code()

    # --------------------------------------------------------------- output
    def print_summary(self) -> None:
        print(f"[SCAN] Project: {self.project_path}")
        print("=" * 80)
        for entry in self.results:
            tag = {
                "ok": "[OK]   ",
                "warn": "[WARN] ",
                "error": "[ERROR]",
                "info": "[INFO] ",
            }.get(entry["severity"], "[?]")
            page = entry.get("page") or "-"
            print(f"{tag} {page:<5} {entry['message']}")
        print()
        s = self.summary
        print("[Summary] visual_consistency validation")
        print(
            f"  pages_total: {s['pages_total']}  ok: {s['ok']}  "
            f"warnings: {s['warnings']}  errors: {s['errors']}"
        )
        if self.stage != "lock-only":
            print(f"  svg_files_scanned: {s['svg_files_scanned']}")
        if s["errors"]:
            print()
            print("[TIP] Fix the errors above; re-run before Step 6 quality gate.")

    def to_json(self) -> dict:
        return {
            "project_path": str(self.project_path),
            "stage": self.stage,
            "summary": self.summary,
            "results": self.results,
        }

    # ---------------------------------------------------- lock-stage checks
    def _check_lock_present(self) -> bool:
        if not self.lock_path.exists():
            self._record("-", "V0", "error",
                         f"spec_lock.md not found at {self.lock_path}")
            return False
        return True

    def _check_palette_roles_section(
        self, sections: dict[str, dict[str, str]]
    ) -> None:
        if "palette_roles" not in sections:
            self._record(
                "-", "V1", "error",
                "## palette_roles section missing - "
                "Strategist must declare role -> HEX mapping (see "
                "templates/spec_lock_reference.md)"
            )
            return

        roles = sections["palette_roles"]
        if not roles:
            self._record("-", "V1", "error",
                         "## palette_roles section is empty")
            return

        # V2: required roles present
        missing = [r for r in REQUIRED_ROLES if r not in roles]
        if missing:
            self._record(
                "-", "V2", "error",
                f"palette_roles missing required role(s): {sorted(missing)} "
                f"(must include {list(REQUIRED_ROLES)})"
            )

        # V3 + V4: each entry valid
        seen_names: dict[str, int] = {}
        for role, value in roles.items():
            seen_names[role] = seen_names.get(role, 0) + 1
            if not ROLE_NAME_RE.match(role):
                self._record(
                    "-", "V4", "error",
                    f"palette_roles role name {role!r} invalid - "
                    "must match [a-z0-9_]+"
                )
            value = value.strip()
            if not HEX_VALUE_RE.match(value):
                self._record(
                    "-", "V3", "error",
                    f"palette_roles.{role}={value!r} is not a valid HEX "
                    "(#RRGGBB or #RRGGBBAA)"
                )
            else:
                self._palette_hex.add(value.upper())

        # V4 dup detection (parse_lock would only keep the last, but we can
        # detect duplicate keys by re-reading the raw text).
        self._check_palette_role_duplicates()

        if not self._has_severity("V1", "V2", "V3", "V4"):
            self._record_ok(
                "-",
                f"palette_roles {len(roles)} roles declared, "
                f"{len(REQUIRED_ROLES)} required present"
            )

    def _check_palette_role_duplicates(self) -> None:
        in_section = False
        seen: dict[str, int] = {}
        for raw in self.lock_path.read_text(encoding="utf-8").splitlines():
            stripped = raw.rstrip()
            if stripped.startswith("## "):
                in_section = stripped[3:].strip() == "palette_roles"
                continue
            if not in_section:
                continue
            m = re.match(r"^-\s+([A-Za-z0-9_]+)\s*:", stripped)
            if m:
                role = m.group(1)
                seen[role] = seen.get(role, 0) + 1
        for role, count in seen.items():
            if count > 1:
                self._record(
                    "-", "V4", "error",
                    f"palette_roles role {role!r} declared {count} times "
                    "(duplicate role names not allowed)"
                )

    def _check_typography_section(
        self, sections: dict[str, dict[str, str]]
    ) -> None:
        typo = sections.get("typography", {})
        if not typo:
            self._record("-", "V10", "error",
                         "## typography section missing or empty")
            return
        required_keys = ("font_family", "title_family", "body_family")
        missing = [k for k in required_keys if not typo.get(k, "").strip()]
        if missing:
            self._record(
                "-", "V10", "error",
                f"typography missing required key(s): {missing} "
                f"(must declare {list(required_keys)})"
            )
        # Build the allowed-font whitelist for the SVG stage regardless.
        for key, value in typo.items():
            if not key.endswith("_family") and key != "font_family":
                continue
            v_clean = value.strip()
            if not v_clean or v_clean.lower().startswith("same as"):
                continue
            self._allowed_fonts.add(_normalize_font_stack(v_clean))

    def _check_page_groups_section(
        self, sections: dict[str, dict[str, str]]
    ) -> None:
        if "page_groups" not in sections:
            self._record(
                "-", "V5", "error",
                "## page_groups section missing - Strategist must declare "
                "per-page group -> slot mapping"
            )
            return

        page_groups_raw = sections.get("page_groups", {})
        focal_rows = sections.get("page_focal", {})
        focal_lengths = _focal_lengths(focal_rows)
        expected_pages = _parse_design_spec_pages(self.design_spec_path)

        # V5: every design_spec page has a row
        for page in expected_pages:
            if page not in page_groups_raw:
                self._record(
                    page, "V5", "error",
                    f"page_groups row missing for {page} "
                    "(declared in design_spec section IX)"
                )

        for page, raw in sorted(page_groups_raw.items()):
            if not PAGE_KEY_RE.match(page):
                self._record(page, "V6", "error",
                             f"page_groups key {page!r} not in P<NN> form")
                continue

            self.summary["pages_total"] += 1
            groups = self._parse_page_groups_row(page, raw)
            if groups is None:
                continue

            self._page_groups[page] = groups
            self._check_group_count(page, groups)
            self._check_group_slots(page, groups, focal_lengths.get(page))

            if not self._has_page_error(page):
                self._record_ok(
                    page,
                    "page_groups " + " | ".join(
                        f"{name}=[{','.join(slots)}]"
                        for name, slots in groups
                    ) + f" ({len(groups)} group(s))"
                )

    def _parse_page_groups_row(
        self, page: str, raw: str
    ) -> list[tuple[str, list[str]]] | None:
        parts = _split_groups(raw)
        if not parts:
            self._record(page, "V6", "error",
                         "page_groups row is empty")
            return None
        groups: list[tuple[str, list[str]]] = []
        seen_names: set[str] = set()
        for part in parts:
            m = PAGE_GROUP_ROW_RE.match(part)
            if not m:
                self._record(
                    page, "V6", "error",
                    f"page_groups group entry {part!r} grammar invalid - "
                    "expected <name>=[<slot>, <slot>, ...]"
                )
                return None
            name = m.group(1)
            if not GROUP_NAME_RE.match(name):
                self._record(
                    page, "V6", "error",
                    f"page_groups group name {name!r} invalid - "
                    "must match [a-z0-9_]+"
                )
                return None
            if name in seen_names:
                self._record(
                    page, "V6", "error",
                    f"page_groups group name {name!r} repeated on {page}"
                )
                return None
            seen_names.add(name)
            slots = _split_list(m.group(2))
            groups.append((name, slots))
        return groups

    def _check_group_count(
        self, page: str, groups: list[tuple[str, list[str]]]
    ) -> None:
        n = len(groups)
        lo, hi = GROUP_COUNT_OK
        if n < lo or n > hi:
            self._record(
                page, "V9", "warn",
                f"page_groups declares {n} group(s) on {page} "
                f"(recommended {lo}-{hi})"
            )

    def _check_group_slots(
        self,
        page: str,
        groups: list[tuple[str, list[str]]],
        lengths: dict[str, int] | None,
    ) -> None:
        # If focal row is missing, the focal validator will flag it; skip
        # cross-reference here to avoid noise.
        if lengths is None:
            self._record(
                page, "V7", "warn",
                "page_focal row missing or malformed; "
                "slot-index range check skipped"
            )
            return

        all_slots: list[str] = []
        for name, slots in groups:
            if not slots:
                # Empty group is allowed (e.g., chrome=[] when chrome is
                # template-supplied). Recorded as info, not error.
                continue
            for slot in slots:
                all_slots.append(slot)
                m = SLOT_RE.match(slot)
                if not m:
                    self._record(
                        page, "V7", "error",
                        f"slot {slot!r} in group {name!r} invalid - "
                        "expected L1 / L2_<N> / L3_<N>"
                    )
                    continue
                tier = int(m.group(1))
                idx_raw = m.group(2)
                if tier == 1:
                    if idx_raw is not None:
                        self._record(
                            page, "V7", "error",
                            f"slot {slot!r} invalid - L1 has no index "
                            "(use bare L1)"
                        )
                        continue
                    if lengths["L1"] == 0:
                        self._record(
                            page, "V7", "error",
                            f"slot {slot!r} refers to empty L1 in page_focal"
                        )
                else:
                    if idx_raw is None:
                        self._record(
                            page, "V7", "error",
                            f"slot {slot!r} invalid - L{tier} requires "
                            "_<N> index"
                        )
                        continue
                    idx = int(idx_raw)
                    count = lengths[f"L{tier}"]
                    if idx < 1 or idx > count:
                        self._record(
                            page, "V7", "error",
                            f"slot {slot!r} out of range "
                            f"(page_focal.L{tier} has {count} item(s))"
                        )

        # V8: coverage + no duplicates
        duplicates = sorted({s for s in all_slots if all_slots.count(s) > 1})
        if duplicates:
            self._record(
                page, "V8", "error",
                f"slot(s) appear in multiple groups on {page}: {duplicates}"
            )

        expected: set[str] = set()
        if lengths["L1"] == 1:
            expected.add("L1")
        for i in range(1, lengths["L2"] + 1):
            expected.add(f"L2_{i}")
        for i in range(1, lengths["L3"] + 1):
            expected.add(f"L3_{i}")
        used = {s for s in all_slots if SLOT_RE.match(s)}
        uncovered = sorted(expected - used)
        if uncovered:
            self._record(
                page, "V8", "error",
                f"page_focal slot(s) not covered by any group on {page}: "
                f"{uncovered}"
            )

    # ---------------------------------------------------- svg-stage checks
    def _scan_svgs(self) -> None:
        if not self.svg_dir.exists():
            self._record(
                "-", "V11", "warn",
                f"svg_output/ not found at {self.svg_dir} - "
                "SVG-stage checks skipped"
            )
            return

        any_anchor_seen = False
        files = sorted(self.svg_dir.glob("*.svg"))
        for svg in files:
            self.summary["svg_files_scanned"] += 1
            try:
                content = svg.read_text(encoding="utf-8")
            except OSError as exc:
                self._record(
                    "-", "V11", "error",
                    f"{svg.name}: cannot read SVG ({exc})"
                )
                continue
            self._check_svg_fonts(svg, content)
            self._check_svg_palette(svg, content)
            anchored = self._check_svg_group_anchors(svg, content)
            any_anchor_seen = any_anchor_seen or anchored

        if files and not any_anchor_seen:
            self._record(
                "-", "V13", "info",
                "No data-l2-item anchors found in svg_output/ - "
                "likely legacy generation; group parity checks skipped"
            )

    def _check_svg_fonts(self, svg_path: Path, content: str) -> None:
        if not self._allowed_fonts:
            return
        for m in re.finditer(r'font-family\s*=\s*(["\'])(.*?)\1', content):
            stack = m.group(2).strip()
            if not stack:
                continue
            if _normalize_font_stack(stack) not in self._allowed_fonts:
                self._record(
                    svg_path.name, "V11", "error",
                    f"{svg_path.name}: font-family {stack!r} not in "
                    "spec_lock.typography whitelist"
                )

    def _check_svg_palette(self, svg_path: Path, content: str) -> None:
        if not self._palette_hex:
            return
        seen: set[str] = set()
        for attr in ("fill", "stroke", "stop-color"):
            pattern = re.compile(
                rf'\b{attr}\s*=\s*["\'](#[0-9A-Fa-f]{{3,8}})["\']'
            )
            for m in pattern.finditer(content):
                value = m.group(1).upper()
                if value in seen:
                    continue
                # Skip the three-digit shorthand; not part of palette grammar.
                if len(value) == 4:  # '#RGB'
                    continue
                if value not in self._palette_hex:
                    seen.add(value)
                    self._record(
                        svg_path.name, "V12", "error",
                        f"{svg_path.name}: {attr}={value} not in "
                        "## palette_roles"
                    )

    def _check_svg_group_anchors(self, svg_path: Path, content: str) -> bool:
        """Return True if this SVG declared any data-l2-item anchor."""
        anchors = re.findall(r'data-l2-item\s*=\s*["\']([^"\']+)["\']', content)
        if not anchors:
            return False
        # Map svg basename like 03_market.svg -> P03 if possible.
        page_key = self._svg_to_page_key(svg_path.name)
        if not page_key:
            self._record(
                svg_path.name, "V13", "warn",
                f"{svg_path.name}: cannot map filename to P<NN>; "
                "anchor parity check skipped"
            )
            return True

        groups = self._page_groups.get(page_key)
        if groups is None:
            self._record(
                svg_path.name, "V13", "error",
                f"{svg_path.name}: data-l2-item anchors present but "
                f"page_groups row missing for {page_key}"
            )
            return True

        declared_l2: set[str] = set()
        for _name, slots in groups:
            for slot in slots:
                if slot.startswith("L2_"):
                    declared_l2.add(slot[3:])

        for n in anchors:
            if n not in declared_l2:
                self._record(
                    svg_path.name, "V13", "error",
                    f"{svg_path.name}: data-l2-item={n!r} not declared in "
                    f"page_groups.{page_key} (declared: {sorted(declared_l2)})"
                )

        missing = sorted(declared_l2 - set(anchors))
        if missing:
            self._record(
                svg_path.name, "V13", "error",
                f"{svg_path.name}: declared L2 slot(s) {missing} "
                "have no matching data-l2-item anchor"
            )
        return True

    @staticmethod
    def _svg_to_page_key(name: str) -> str | None:
        m = re.match(r"^(\d{2})", name)
        if not m:
            return None
        return f"P{m.group(1)}"

    # ----------------------------------------------------------- internals
    def _record(self, page: str, check: str, severity: str,
                message: str) -> None:
        self.results.append({
            "page": page,
            "check": check,
            "severity": severity,
            "message": f"{check}: {message}",
        })
        if severity == "error":
            self.summary["errors"] += 1
        elif severity == "warn":
            self.summary["warnings"] += 1

    def _record_ok(self, page: str, message: str) -> None:
        self.summary["ok"] += 1
        self.results.append({
            "page": page,
            "check": "OK",
            "severity": "ok",
            "message": message,
        })

    def _has_page_error(self, page: str) -> bool:
        return any(r["page"] == page and r["severity"] == "error"
                   for r in self.results)

    def _has_severity(self, *checks: str) -> bool:
        return any(r["check"] in checks and r["severity"] == "error"
                   for r in self.results)

    def _exit_code(self) -> int:
        if self.summary["errors"] > 0:
            return 1
        if self.summary["warnings"] > 0:
            return 2
        return 0


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------
def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        prog="validate_visual_consistency",
        description=(
            "Validate spec_lock.md palette_roles + page_groups + typography "
            "and (default stage) svg_output/*.svg conformance. "
            "Exit codes 0=ok / 1=error / 2=warn."
        ),
    )
    p.add_argument(
        "project_path",
        help="Path to project directory containing spec_lock.md",
    )
    p.add_argument(
        "--stage",
        choices=("lock-only", "all"),
        default="all",
        help="lock-only validates spec_lock only; all also scans svg_output/",
    )
    p.add_argument(
        "--json",
        action="store_true",
        help="Emit a JSON report instead of human-readable text",
    )
    return p


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    project_path = Path(args.project_path)
    if not project_path.exists():
        print(f"[ERROR] Project path does not exist: {project_path}")
        return 1

    validator = VisualConsistencyValidator(project_path, stage=args.stage)
    code = validator.run()

    if args.json:
        print(json.dumps(validator.to_json(), ensure_ascii=False, indent=2))
    else:
        validator.print_summary()

    return code


if __name__ == "__main__":
    raise SystemExit(main())

#!/usr/bin/env python3
"""Validate spec_lock.md ## page_focal and ## page_tables sections.

Runs at Step 6 entry as the gate that blocks SVG generation when the
Strategist has not committed to a per-page focal hierarchy.

Grammar enforced for each row under ## page_focal:

    P<NN>: L1="<headline>" | L2=[item, item, ...] | L3=[item, item, ...]

Length rules (CJK-width aware):

    L1   exactly one,  <=18 CJK / <=36 Latin
    L2   2-4 items,    each <=12 CJK / <=24 Latin
    L3   0-3 items,    each <=10 CJK / <=20 Latin

Exit codes (match scripts/batch_validate.py):
    0 - all checks pass
    1 - one or more hard errors
    2 - no errors, warnings only
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import unicodedata
from pathlib import Path

# ---------------------------------------------------------------------------
# Sibling import: reuse parse_lock so we never re-implement the parser.
# ---------------------------------------------------------------------------
_SCRIPT_DIR = Path(__file__).resolve().parent
if str(_SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(_SCRIPT_DIR))

try:
    from update_spec import parse_lock  # type: ignore
except ImportError as exc:  # pragma: no cover - configuration error
    print(f"[FATAL] Cannot import parse_lock from update_spec: {exc}")
    raise SystemExit(1)


# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------
L1_MAX_CJK, L1_MAX_LATIN = 18, 36
L2_MIN, L2_MAX = 2, 4
L2_ITEM_MAX_CJK, L2_ITEM_MAX_LATIN = 12, 24
L3_MIN, L3_MAX = 0, 3
L3_ITEM_MAX_CJK, L3_ITEM_MAX_LATIN = 10, 20

# Project-relative path to the table catalog.
_TABLES_INDEX_REL = Path("templates") / "tables" / "tables_index.json"

# Skill root (this file lives in <skill>/scripts/).
_SKILL_ROOT = _SCRIPT_DIR.parent

PAGE_KEY_RE = re.compile(r"^P\d{2}$")

# Strict grammar regex for a focal row value.
_FOCAL_ROW_RE = re.compile(
    r'^\s*L1\s*=\s*"(?P<l1>[^"]*)"\s*'
    r'\|\s*L2\s*=\s*\[(?P<l2>[^\]]*)\]\s*'
    r'\|\s*L3\s*=\s*\[(?P<l3>[^\]]*)\]\s*$'
)

# Heuristic: noun-phrase topic labels we flag as warnings (C14).
_TOPIC_TAIL_TOKENS = (
    "\u5206\u6790",  # 分析
    "\u6982\u89c8",  # 概览
    "\u4ecb\u7ecd",  # 介绍
    "\u8bf4\u660e",  # 说明
    "\u603b\u89c8",  # 总览
    "\u60c5\u51b5",  # 情况
    "\u73b0\u72b6",  # 现状
    "Overview", "Introduction", "Analysis", "Summary",
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
def _is_cjk_char(ch: str) -> bool:
    if not ch or ch.isspace():
        return False
    if ord(ch) < 0x0080:
        return False
    return unicodedata.east_asian_width(ch) in ("W", "F")


def _visual_width(s: str) -> tuple[int, int]:
    """Return (cjk_count, latin_count) - wide chars count toward cjk_count."""
    cjk = sum(1 for c in s if _is_cjk_char(c))
    latin = sum(1 for c in s if not _is_cjk_char(c) and not c.isspace())
    return cjk, latin


def _exceeds_length(s: str, max_cjk: int, max_latin: int) -> bool:
    cjk, latin = _visual_width(s)
    return cjk > max_cjk or latin > max_latin


def _split_list(raw: str) -> list[str]:
    if not raw.strip():
        return []
    return [part.strip() for part in raw.split(",") if part.strip()]


# ---------------------------------------------------------------------------
# Validator
# ---------------------------------------------------------------------------
class FocalHierarchyValidator:
    """Enforce focal-hierarchy + table-style grammar of spec_lock.md."""

    DESIGN_SPEC_CANDIDATES = (
        "design_spec.md",
        "\u8bbe\u8ba1\u89c4\u8303\u4e0e\u5185\u5bb9\u5927\u7eb2.md",
        "design_specification.md",
        "\u8bbe\u8ba1\u89c4\u8303.md",
    )

    def __init__(self, project_path: Path) -> None:
        self.project_path = Path(project_path).resolve()
        self.lock_path = self.project_path / "spec_lock.md"
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
            "page_tables_total": 0,
            "page_tables_unknown": 0,
        }
        self._tables_catalog: set[str] | None = None
        self._tables_catalog_error: str | None = None

    # ------------------------------------------------------------------ run
    def run(self) -> int:
        if not self._check_lock_present():
            return 1

        sections = parse_lock(self.lock_path)

        if not self._check_focal_section(sections):
            return 1

        expected_pages = self._extract_design_spec_pages()
        focal_rows = sections.get("page_focal", {})
        page_rhythm = sections.get("page_rhythm", {})
        page_tables = sections.get("page_tables", {})
        page_charts = sections.get("page_charts", {})

        for page in expected_pages:
            if page not in focal_rows:
                self._record(page, "C3", "error",
                             f"page_focal row missing for {page} "
                             f"(declared in design_spec section IX)")

        for page, raw in sorted(focal_rows.items()):
            if not PAGE_KEY_RE.match(page):
                self._record(page, "C4", "error",
                             f"page_focal key {page!r} is not in P<NN> form")
                continue

            self.summary["pages_total"] += 1
            parsed = self._parse_focal_row(page, raw)
            if parsed is None:
                continue
            self._check_l1(page, parsed, page_rhythm.get(page))
            self._check_l2(page, parsed, page_rhythm.get(page),
                           page in page_tables)
            self._check_l3(page, parsed)
            self._check_duplicates(page, parsed)
            if not self._has_page_error(page):
                self._record_ok(page, parsed)

        if page_tables:
            self._check_table_section(page_tables)

        if page_tables and page_charts:
            self._check_mutual_exclusion(page_charts, page_tables)

        return self._exit_code()

    # --------------------------------------------------------------- output
    def print_summary(self) -> None:
        print(f"[SCAN] Project: {self.project_path}")
        print("=" * 80)
        for entry in self.results:
            tag = {"ok": "[OK]   ",
                   "warn": "[WARN] ",
                   "error": "[ERROR]"}.get(entry["severity"], "[?]")
            print(f"{tag} {entry['page']:<5} {entry['message']}")
        print()
        s = self.summary
        print("[Summary] focal_hierarchy validation")
        print(f"  pages_total: {s['pages_total']}  "
              f"ok: {s['ok']}  warnings: {s['warnings']}  errors: {s['errors']}")
        if s["page_tables_total"]:
            ok = s["page_tables_total"] - s["page_tables_unknown"]
            print(f"  page_tables: {s['page_tables_total']} references "
                  f"({ok} ok, {s['page_tables_unknown']} unknown)")
        if s["errors"]:
            print()
            print("[TIP] Fix the errors above; re-run before Step 6 quality gate.")

    def to_json(self) -> dict:
        return {
            "project_path": str(self.project_path),
            "summary": self.summary,
            "results": self.results,
        }

    # ----------------------------------------------------------- internals
    def _check_lock_present(self) -> bool:
        if not self.lock_path.exists():
            self._record("-", "C1", "error",
                         f"spec_lock.md not found at {self.lock_path}")
            return False
        return True

    def _check_focal_section(self, sections: dict[str, dict[str, str]]) -> bool:
        if "page_focal" not in sections:
            self._record("-", "C2", "error",
                         "## page_focal section missing - "
                         "Strategist must run the focal-hierarchy planning step")
            return False
        return True

    def _parse_focal_row(self, page: str, raw: str) -> dict | None:
        m = _FOCAL_ROW_RE.match(raw)
        if not m:
            self._record(page, "C4", "error",
                         'page_focal grammar invalid - expected '
                         'L1="..." | L2=[...] | L3=[...]')
            return None
        return {
            "L1": m.group("l1"),
            "L2": _split_list(m.group("l2")),
            "L3": _split_list(m.group("l3")),
        }

    def _check_l1(self, page: str, parsed: dict, rhythm: str | None) -> None:
        l1 = parsed["L1"]
        if not l1.strip():
            self._record(page, "C5", "error",
                         "L1 headline is empty - every page needs one assertion")
            return
        if _exceeds_length(l1, L1_MAX_CJK, L1_MAX_LATIN):
            cjk, latin = _visual_width(l1)
            self._record(page, "C6", "error",
                         f"L1 length {cjk} CJK / {latin} Latin exceeds limit "
                         f"({L1_MAX_CJK} CJK / {L1_MAX_LATIN} Latin)")
            return
        if (rhythm or "").strip() == "anchor":
            return
        for tail in _TOPIC_TAIL_TOKENS:
            if l1.endswith(tail):
                self._record(page, "C14", "warn",
                             f'L1="{l1}" looks like a topic label '
                             f"(ends with {tail!r}, no assertion verb)")
                break

    def _check_l2(self, page: str, parsed: dict, rhythm: str | None,
                  has_table: bool) -> None:
        l2 = parsed["L2"]
        if not (L2_MIN <= len(l2) <= L2_MAX):
            self._record(page, "C7", "error",
                         f"L2 count {len(l2)} outside [{L2_MIN}, {L2_MAX}]")
            return
        for idx, item in enumerate(l2, 1):
            if _exceeds_length(item, L2_ITEM_MAX_CJK, L2_ITEM_MAX_LATIN):
                cjk, latin = _visual_width(item)
                self._record(page, "C8", "error",
                             f"L2 item #{idx} {item!r} length {cjk} CJK / "
                             f"{latin} Latin exceeds limit "
                             f"({L2_ITEM_MAX_CJK} CJK / {L2_ITEM_MAX_LATIN} Latin)")
        if (rhythm or "").strip() == "breathing" and len(l2) > 2:
            self._record(page, "C15", "warn",
                         f"breathing pages should keep L2 <= 2 (got {len(l2)})")
        if has_table and not (3 <= len(l2) <= 4):
            self._record(page, "C16", "warn",
                         f"table pages should have L2 in [3, 4] (got {len(l2)})")

    def _check_l3(self, page: str, parsed: dict) -> None:
        l3 = parsed["L3"]
        if not (L3_MIN <= len(l3) <= L3_MAX):
            self._record(page, "C9", "error",
                         f"L3 count {len(l3)} outside [{L3_MIN}, {L3_MAX}]")
            return
        for idx, item in enumerate(l3, 1):
            if _exceeds_length(item, L3_ITEM_MAX_CJK, L3_ITEM_MAX_LATIN):
                cjk, latin = _visual_width(item)
                self._record(page, "C10", "error",
                             f"L3 item #{idx} {item!r} length {cjk} CJK / "
                             f"{latin} Latin exceeds limit "
                             f"({L3_ITEM_MAX_CJK} CJK / {L3_ITEM_MAX_LATIN} Latin)")

    def _check_duplicates(self, page: str, parsed: dict) -> None:
        l1 = parsed["L1"].strip()
        others = [x.strip() for x in (parsed["L2"] + parsed["L3"])]
        if l1 and l1 in others:
            self._record(page, "C11", "error",
                         f'L1="{l1}" duplicates an L2/L3 item on the same page')

    def _check_table_section(self, page_tables: dict[str, str]) -> None:
        catalog = self._load_tables_catalog()
        for page, value in sorted(page_tables.items()):
            self.summary["page_tables_total"] += 1
            if catalog is None:
                self.summary["page_tables_unknown"] += 1
                self._record(page, "C12", "error",
                             f"cannot resolve page_tables value {value!r}: "
                             f"{self._tables_catalog_error}")
                continue
            if value not in catalog:
                self.summary["page_tables_unknown"] += 1
                self._record(page, "C12", "error",
                             f"page_tables value {value!r} not in tables_index.json "
                             f"(known keys: {sorted(catalog)})")

    def _check_mutual_exclusion(self, page_charts: dict[str, str],
                                 page_tables: dict[str, str]) -> None:
        overlap = sorted(set(page_charts) & set(page_tables))
        for page in overlap:
            self._record(page, "C13", "error",
                         f"{page} appears in both page_charts and page_tables "
                         f"(mutual exclusion)")

    def _extract_design_spec_pages(self) -> list[str]:
        if not self.design_spec_path or not self.design_spec_path.exists():
            return []
        text = self.design_spec_path.read_text(encoding="utf-8", errors="replace")
        lines = text.splitlines()
        in_ix = False
        seen: set[str] = set()
        ordered: list[str] = []
        for raw in lines:
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

    def _load_tables_catalog(self) -> set[str] | None:
        if self._tables_catalog is not None or self._tables_catalog_error:
            return self._tables_catalog
        catalog_path = _SKILL_ROOT / _TABLES_INDEX_REL
        if not catalog_path.exists():
            self._tables_catalog_error = (
                f"tables_index.json not found at {catalog_path}"
            )
            return None
        try:
            data = json.loads(catalog_path.read_text(encoding="utf-8"))
            self._tables_catalog = set((data.get("tables") or {}).keys())
            return self._tables_catalog
        except (OSError, json.JSONDecodeError) as exc:
            self._tables_catalog_error = f"tables_index.json malformed: {exc}"
            return None

    def _record(self, page: str, check: str, severity: str, message: str) -> None:
        self.results.append({
            "page": page, "check": check,
            "severity": severity, "message": f"{check}: {message}",
        })
        if severity == "error":
            self.summary["errors"] += 1
        elif severity == "warn":
            self.summary["warnings"] += 1

    def _record_ok(self, page: str, parsed: dict) -> None:
        self.summary["ok"] += 1
        self.results.append({
            "page": page, "check": "OK", "severity": "ok",
            "message": (f'L1="{parsed["L1"]}" '
                        f'L2=[{len(parsed["L2"])}] L3=[{len(parsed["L3"])}]'),
        })

    def _has_page_error(self, page: str) -> bool:
        return any(r["page"] == page and r["severity"] == "error"
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
        prog="validate_focal_hierarchy",
        description=("Validate spec_lock.md ## page_focal and ## page_tables. "
                     "Gate run at Step 6 entry; exit codes 0=ok / 1=error / 2=warn."),
    )
    p.add_argument("project_path",
                   help="Path to project directory containing spec_lock.md")
    p.add_argument("--json", action="store_true",
                   help="Emit a JSON report instead of human-readable text")
    return p


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    project_path = Path(args.project_path)
    if not project_path.exists():
        print(f"[ERROR] Project path does not exist: {project_path}")
        return 1

    validator = FocalHierarchyValidator(project_path)
    code = validator.run()

    if args.json:
        print(json.dumps(validator.to_json(), ensure_ascii=False, indent=2))
    else:
        validator.print_summary()

    return code


if __name__ == "__main__":
    raise SystemExit(main())

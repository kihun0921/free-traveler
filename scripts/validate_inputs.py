#!/usr/bin/env python3
"""
validate_inputs.py

Traveler Task 생성 Pipeline(HARNESS_SCHEMA: traveler-screen-route-v1)의
입력이 존재하고 구조적으로 유효한지 확인하는 11개 검사.

이 스크립트는 아무 파일도 만들거나 수정하지 않는다(읽기 전용).
성공 시 "VALIDATE_INPUTS_PASS"와 검사 수를 출력하고 exit 0.
실패 시 누락 파일·Screen·Requirement ID를 출력하고 exit 1.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

REPO_ROOT = Path(__file__).resolve().parent.parent

EXPECTED_SCHEMA = "traveler-screen-route-v1"
EXPECTED_SCREEN_IDS = [f"SCR-00{i}" for i in range(1, 6)]
EXPECTED_ROUTES = {"/", "/about", "/travel-tools", "/mates", "/account"}
EXPECTED_REQ_FUNC = [f"REQ-FUNC-{i:03d}" for i in range(1, 81)]
EXPECTED_REQ_NF = [f"REQ-NF-{i:03d}" for i in range(1, 35)]

PRD_SRS_SCOPE_UI_DOCS = [
    "docs/01_PRD.md",
    "docs/02_SRS_BASELINE.md",
    "docs/PROJECT_SCOPE.md",
    "docs/03_UI_COVERAGE_ANALYSIS.md",
    "docs/04_UIUX_PLAN.md",
]

APP_ROUTER_PAGE_RE = re.compile(r"^src/app/([\w\-]+/)*page\.(tsx|jsx|ts|js)$")

AWS_EC2_KEYWORDS = ["aws-sdk", "@aws-sdk", "aws-cdk", "ec2"]


class Check:
    def __init__(self, number: int, label: str) -> None:
        self.number = number
        self.label = label
        self.passed = False
        self.detail = ""
        self.missing: list[str] = []

    def set(self, passed: bool, detail: str = "", missing: list[str] | None = None) -> "Check":
        self.passed = passed
        self.detail = detail
        self.missing = missing or []
        return self

    def render(self) -> str:
        status = "PASS" if self.passed else "FAIL"
        line = f"[{status}] {self.number}. {self.label}"
        if self.detail:
            line += f" — {self.detail}"
        return line


def read_text(rel: str) -> str | None:
    p = REPO_ROOT / rel
    if not p.exists():
        return None
    return p.read_text(encoding="utf-8")


def check_1_nextjs_dependency(checks: list[Check]) -> None:
    c = Check(1, "package.json에 Next.js 의존성이 있다")
    text = read_text("package.json")
    if text is None:
        checks.append(c.set(False, missing=["package.json"]))
        return
    try:
        data = json.loads(text)
    except json.JSONDecodeError as e:
        checks.append(c.set(False, f"JSON 파싱 실패: {e}"))
        return
    deps = {**data.get("dependencies", {}), **data.get("devDependencies", {})}
    has_next = "next" in deps
    checks.append(c.set(has_next, f"next 버전: {deps.get('next', '없음')}", [] if has_next else ["package.json:dependencies.next"]))


def check_2_app_router_entry_files(checks: list[Check]) -> None:
    c = Check(2, "src/app/page.tsx와 src/app/layout.tsx가 존재한다")
    missing = []
    for rel in ["src/app/page.tsx", "src/app/layout.tsx"]:
        if not (REPO_ROOT / rel).exists():
            missing.append(rel)
    checks.append(c.set(not missing, missing=missing))


def check_3_core_docs(checks: list[Check]) -> None:
    c = Check(3, "PRD·SRS·Project Scope·UI 문서가 존재한다")
    missing = [rel for rel in PRD_SRS_SCOPE_UI_DOCS if not (REPO_ROOT / rel).exists() or (REPO_ROOT / rel).stat().st_size == 0]
    checks.append(c.set(not missing, missing=missing))


def check_4_design_locked(checks: list[Check]) -> None:
    c = Check(4, "D-001 DESIGN.md와 LOCKED Manifest가 존재한다")
    missing = []
    design_path = "design-reference/D-001/DESIGN.md"
    manifest_path = "design-reference/DESIGN_MANIFEST.md"
    if not (REPO_ROOT / design_path).exists():
        missing.append(design_path)
    manifest_text = read_text(manifest_path)
    if manifest_text is None:
        missing.append(manifest_path)
    elif not re.search(r"Status\s*:?\*{0,2}\s*:?\s*LOCKED", manifest_text, re.IGNORECASE):
        missing.append(f"{manifest_path}:Status=LOCKED 미발견")
    checks.append(c.set(not missing, missing=missing))


def check_5_screen_route_contract_json(checks: list[Check]) -> dict | None:
    c = Check(5, "SCREEN_ROUTE_CONTRACT.json을 JSON으로 파싱할 수 있다")
    rel = "design-reference/SCREEN_ROUTE_CONTRACT.json"
    text = read_text(rel)
    if text is None:
        checks.append(c.set(False, missing=[rel]))
        return None
    try:
        data = json.loads(text)
    except json.JSONDecodeError as e:
        checks.append(c.set(False, f"JSON 파싱 실패: {e}", [rel]))
        return None
    schema_ok = data.get("schema") == EXPECTED_SCHEMA
    checks.append(c.set(schema_ok, f"schema={data.get('schema')!r}", [] if schema_ok else [f"schema!={EXPECTED_SCHEMA}"]))
    return data


def check_6_screen_count(checks: list[Check], contract: dict | None) -> list[dict]:
    c = Check(6, "Screen 수가 정확히 5개다")
    screens = (contract or {}).get("screens", [])
    ok = len(screens) == 5
    checks.append(c.set(ok, f"실제 개수: {len(screens)}"))
    return screens


def check_7_all_screens_present(checks: list[Check], screens: list[dict]) -> None:
    c = Check(7, "SCR-001~005가 모두 존재한다")
    ids = {s.get("id") for s in screens}
    missing = [sid for sid in EXPECTED_SCREEN_IDS if sid not in ids]
    checks.append(c.set(not missing, f"실제: {sorted(x for x in ids if x)}", missing))


def check_8_routes(checks: list[Check], screens: list[dict]) -> None:
    c = Check(8, "Route가 `/`, `/about`, `/travel-tools`, `/mates`, `/account`다")
    actual_routes = {s.get("route") for s in screens}
    missing = sorted(EXPECTED_ROUTES - actual_routes)
    extra = sorted(actual_routes - EXPECTED_ROUTES)
    ok = not missing and not extra
    checks.append(c.set(ok, f"실제: {sorted(x for x in actual_routes if x)}", missing + [f"예상 외 route: {e}" for e in extra]))


def check_9_page_entry_format(checks: list[Check], screens: list[dict]) -> None:
    c = Check(9, "Page Entry가 실제 Next.js App Router 경로 형식이다")
    bad = []
    for s in screens:
        file_path = s.get("filePath", "")
        if not APP_ROUTER_PAGE_RE.match(file_path):
            bad.append(f"{s.get('id', '?')}:{file_path!r}")
    checks.append(c.set(not bad, missing=bad))


def check_10_requirement_ids(checks: list[Check]) -> None:
    c = Check(10, "PROJECT_SCOPE에 REQ-FUNC 80개와 REQ-NF 34개가 모두 등장한다")
    text = read_text("docs/PROJECT_SCOPE.md")
    if text is None:
        checks.append(c.set(False, missing=["docs/PROJECT_SCOPE.md"]))
        return
    found_ids = set(re.findall(r"REQ-(?:FUNC|NF)-\d{3}", text))
    missing = [rid for rid in (*EXPECTED_REQ_FUNC, *EXPECTED_REQ_NF) if rid not in found_ids]
    checks.append(
        c.set(
            not missing,
            f"발견된 REQ ID 수: {len(found_ids)} (REQ-FUNC 80 + REQ-NF 34 = 114 기대)",
            missing,
        )
    )


def check_11_no_aws_ec2_active(checks: list[Check]) -> None:
    c = Check(11, "AWS·EC2가 활성 기술로 정의되지 않았다")
    hits = []

    pkg_text = read_text("package.json") or "{}"
    try:
        pkg = json.loads(pkg_text)
        deps = {**pkg.get("dependencies", {}), **pkg.get("devDependencies", {})}
    except json.JSONDecodeError:
        deps = {}
    for dep in deps:
        dep_lower = dep.lower()
        if any(kw in dep_lower for kw in AWS_EC2_KEYWORDS):
            hits.append(f"package.json:dependencies.{dep}")

    contract_text = read_text("design-reference/SCREEN_ROUTE_CONTRACT.json") or ""
    if re.search(r"\b(AWS|EC2)\b", contract_text):
        hits.append("SCREEN_ROUTE_CONTRACT.json에 AWS/EC2 문자열 존재")

    revised_srs = read_text("docs/06_SRS_UIUX_REVISED.md") or ""
    for m in re.finditer(r"(?m)^.*\b(AWS|EC2)\b.*$", revised_srs):
        line = m.group(0)
        if "만들지 않는다" in line or "제외" in line or "EXCLUDED" in line or "하지 않는다" in line:
            continue
        hits.append(f"06_SRS_UIUX_REVISED.md: {line.strip()[:80]}")

    checks.append(c.set(not hits, missing=hits))


def main() -> int:
    checks: list[Check] = []

    check_1_nextjs_dependency(checks)
    check_2_app_router_entry_files(checks)
    check_3_core_docs(checks)
    check_4_design_locked(checks)
    contract = check_5_screen_route_contract_json(checks)
    screens = check_6_screen_count(checks, contract)
    check_7_all_screens_present(checks, screens)
    check_8_routes(checks, screens)
    check_9_page_entry_format(checks, screens)
    check_10_requirement_ids(checks)
    check_11_no_aws_ec2_active(checks)

    for c in checks:
        print(c.render())

    failed = [c for c in checks if not c.passed]
    print()

    if not failed:
        print(f"VALIDATE_INPUTS_PASS ({len(checks)}/{len(checks)} checks)")
        return 0

    print(f"VALIDATE_INPUTS_FAIL ({len(checks) - len(failed)}/{len(checks)} checks passed)")
    print()
    print("누락/실패 상세:")
    for c in failed:
        print(f"- Check {c.number} ({c.label}):")
        if c.missing:
            for m in c.missing:
                print(f"    - {m}")
        elif c.detail:
            print(f"    - {c.detail}")
    return 1


if __name__ == "__main__":
    sys.exit(main())

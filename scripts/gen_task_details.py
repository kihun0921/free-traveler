#!/usr/bin/env python3
"""
gen_task_details.py

TASKS/00_TASK_LIST.md의 76개 구현 Task 행을 파싱해
TASKS/TASK-<ID>.md 상세 파일을 생성(또는 이미 있으면 건너뜀)한다.

이 스크립트는:
- 중복 Task ID, 빈 필수 열, 존재하지 않는 Depends On을 먼저 검사한다(실패 시 생성 중단).
- 이미 존재하는 TASKS/TASK-<ID>.md는 다시 만들지 않는다(멱등).
- 구현 코드/Branch/Commit을 만들지 않는다 — 문서만 생성한다.
"""

from __future__ import annotations

import re
import sys
from dataclasses import dataclass, field
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

REPO_ROOT = Path(__file__).resolve().parent.parent
TASKLIST_PATH = REPO_ROOT / "TASKS/00_TASK_LIST.md"
OUT_DIR = REPO_ROOT / "TASKS"

COLUMNS = [
    "seq",
    "task_id",
    "title",
    "category",
    "impl_status",
    "req_ref",
    "screen",
    "route",
    "page_entry",
    "depends_on",
    "expected_files",
    "functional_ac",
    "visual_ac",
    "security_ac",
    "verify",
    "priority",
]

ROW_RE = re.compile(r"^\|\s*\d+\s*\|")

DB_TABLE_ALLOWLIST = {
    "user_profile",
    "mate_post",
    "mate_application",
    "user_block",
    "report",
    "app_setting",
}


@dataclass
class TaskRow:
    seq: str
    task_id: str
    title: str
    category: str
    impl_status: str
    req_ref: str
    screen: str
    route: str
    page_entry: str
    depends_on: str
    expected_files: str
    functional_ac: str
    visual_ac: str
    security_ac: str
    verify: str
    priority: str


def parse_tasklist(text: str) -> list[TaskRow]:
    rows: list[TaskRow] = []
    for line in text.splitlines():
        if not ROW_RE.match(line):
            continue
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if len(cells) != len(COLUMNS):
            raise ValueError(f"컬럼 수 불일치({len(cells)}개, 기대 {len(COLUMNS)}개): {line[:80]}...")
        rows.append(TaskRow(*cells))
    return rows


def split_list_cell(raw: str) -> list[str]:
    raw = raw.strip()
    if raw in ("-", "", "해당없음", "해당 없음"):
        return []
    return [x.strip() for x in raw.split(",") if x.strip()]


def split_id_list(raw: str) -> list[str]:
    """Depends On 열: Task ID만 추출(설명 문구 없이 순수 ID 쉼표 목록으로 가정)."""
    return split_list_cell(raw)


def extract_req_ids(raw: str) -> list[str]:
    return re.findall(r"REQ-(?:FUNC|NF)-\d{3}", raw)


class Report:
    def __init__(self) -> None:
        self.ok = True
        self.lines: list[str] = []

    def check(self, label: str, passed: bool, detail: str = "") -> None:
        status = "PASS" if passed else "FAIL"
        if not passed:
            self.ok = False
        line = f"[{status}] {label}"
        if detail:
            line += f" — {detail}"
        self.lines.append(line)

    def render(self) -> str:
        return "\n".join(self.lines)


def validate(rows: list[TaskRow], report: Report) -> None:
    # 1) 중복 Task ID
    ids = [r.task_id for r in rows]
    dup = {i for i in ids if ids.count(i) > 1}
    report.check("중복 Task ID 없음", not dup, f"중복: {sorted(dup)}" if dup else "")

    # 2) 빈 필수 열 (Task ID, 제목, Category, Impl Status, Expected Files, Verify, Priority는 반드시 값이 있어야 함)
    required_nonempty = ["task_id", "title", "category", "impl_status", "expected_files", "verify", "priority"]
    empty_found = []
    for r in rows:
        for field_name in required_nonempty:
            if not getattr(r, field_name).strip():
                empty_found.append(f"{r.task_id}:{field_name}")
    report.check("필수 열 비어있지 않음", not empty_found, f"빈 값: {empty_found}" if empty_found else "")

    # 3) 존재하지 않는 Depends On 참조
    id_set = set(ids)
    dangling = []
    for r in rows:
        for dep in split_id_list(r.depends_on):
            if dep not in id_set:
                dangling.append(f"{r.task_id} -> {dep}")
    report.check("존재하지 않는 Depends On 참조 없음", not dangling, f"끊긴 참조: {dangling}" if dangling else "")


def category_forbidden_notes(category: str, task_id: str) -> list[str]:
    common = [
        "EC2·AWS 등 미승인 인프라 사용/언급",
        "예약·결제·체크아웃 UI, 가격(₩/$) 표기",
        "별점·리뷰·수치형 신뢰도 배지(예: 매너온도)",
        "Expected Files 목록 밖 파일 생성·수정",
        "자동 Merge/Merge Runner 구성",
    ]
    if category == "PAGE_OWNER":
        common.append("이 Task 안에서 새 Component 하위 파일을 직접 설계·생성(조립만 담당 — Depends On의 Component/Data/API Task 산출물을 조합)")
        common.append("Section 순서 변경 또는 임의 Section 추가/삭제")
        common.append("Lorem ipsum, `준비 중`, `정보 확인 필요` 문구 사용")
    if category == "DB":
        common.append(f"허용된 6개 테이블({', '.join(sorted(DB_TABLE_ALLOWLIST))}) 외 신규 테이블 생성")
        common.append("`AUDIT_LOG` 등 EXCLUDED 처리된 엔터티 재도입")
    if category in ("UNIT_TEST", "RLS_TEST", "E2E_TEST"):
        common.append("Chromium 외 브라우저(Firefox/WebKit) 매트릭스 추가")
        common.append("실제 결제·외부 실서비스 호출을 수행하는 테스트 작성")
    if category == "RELEASE_CHECK":
        common.append("코드 구현(이 Task는 검증 전용, Verify=Manual/Release Check)")
    return common


def render_task_md(r: TaskRow) -> str:
    reqs = extract_req_ids(r.req_ref)
    depends = split_id_list(r.depends_on)
    expected_files_list = split_list_cell(r.expected_files) or [r.expected_files]

    functional_ac_items = [x.strip() for x in re.split(r";\s*", r.functional_ac) if x.strip()]
    visual_ac_items = [x.strip() for x in re.split(r";\s*", r.visual_ac) if x.strip() and x.strip() != "-"]
    security_ac_items = [x.strip() for x in re.split(r";\s*", r.security_ac) if x.strip() and x.strip() != "-"]
    verify_items = split_list_cell(r.verify)

    def bullets(items: list[str], empty_note: str) -> str:
        if not items:
            return f"- {empty_note}"
        return "\n".join(f"- [ ] {i}" for i in items)

    test_cases_lines = []
    for v in verify_items:
        if v.startswith("UNIT") or v == "Unit(CI)":
            test_cases_lines.append(f"- [ ] {v}: Functional AC의 각 경계값·오류 조건을 개별 테스트 케이스로 작성")
        elif v.startswith("E2E") or v == "E2E(CI)":
            test_cases_lines.append(f"- [ ] {v}: Playwright(Chromium)로 핵심 흐름 1개 이상 자동화")
        elif v == "Manual Check":
            test_cases_lines.append("- [ ] Manual Check: 로컬/프리뷰 배포에서 Functional/Visual AC를 사람이 직접 확인하고 스크린샷 또는 체크리스트로 기록")
        elif v.startswith("RELEASE") or "Release" in v:
            test_cases_lines.append(f"- [ ] {v}: 배포 전 릴리스 체크리스트 항목으로 확인")
        elif v == "CI":
            test_cases_lines.append("- [ ] CI: 파이프라인 Job 통과 여부로 확인")
        else:
            test_cases_lines.append(f"- [ ] {v}")
    if not test_cases_lines:
        test_cases_lines.append("- [ ] (Verify 열 기준 확인 방법 없음 — 상세 필요 시 보완)")

    forbidden = category_forbidden_notes(r.category, r.task_id)

    scope_note = ""
    if reqs:
        scope_note = (
            f"이 Task가 다루는 Requirement({', '.join(reqs)})는 `docs/PROJECT_SCOPE.md` 기준 **IMPLEMENT**이다. "
            "EXCLUDED Requirement는 이 Task의 범위에 포함되지 않으며, EXCLUDED 목록은 "
            "`TASKS/00_TASK_LIST.md` §5(NON_IMPLEMENTATION)를 참조한다."
        )
    else:
        scope_note = (
            "이 Task는 특정 REQ-FUNC/REQ-NF ID가 아니라 `design-reference/SCREEN_ROUTE_CONTRACT.json`의 "
            "Section 계약을 충족하기 위한 Task이다(Requirement Ref: Section 계약 전용)."
        )

    design_ref_lines = [
        "- `design-reference/D-001/DESIGN.md` — 디자인 토큰, Do/Do Not, Section 계층·리듬 규칙(Status: LOCKED)",
        "- `design-reference/UI_CONTRACT.md` — Screen별 Section 순서·최소 콘텐츠·Empty State 요구",
        "- `design-reference/SCREEN_ROUTE_CONTRACT.json` — Screen/Route/Section 정본(schema `traveler-screen-route-v1`)",
    ]
    if r.screen and r.screen != "-":
        design_ref_lines.append(f"- 해당 Screen: `{r.screen}` — `UI_CONTRACT.md`의 `{r.screen}` 표를 그대로 인용해 AC를 검증한다.")

    depends_section = (
        "- " + "\n- ".join(depends) if depends else "- 없음(선행 Task 없이 독립적으로 시작 가능)"
    )
    if r.category == "PAGE_OWNER":
        depends_section += (
            "\n\n> 이 Task는 위 Depends On의 Component/Data/API Task가 만든 결과물을 "
            f"**Route Page({r.page_entry})로 조립하는 것만** 범위로 한다. "
            "새로운 하위 Component/Data/API Task를 이 문서 안에서 추가로 만들지 않는다."
        )

    expected_files_section = "\n".join(f"- `{f}`" if not f.startswith("`") else f"- {f}" for f in expected_files_list)
    expected_files_section += "\n\n> **이 목록 밖의 파일은 수정하지 않는다.** 추가 파일이 필요하면 `TASKS/00_TASK_LIST.md`를 먼저 갱신한 뒤 이 문서를 다시 생성한다."

    md = f"""---
schema: traveler-screen-route-v1
task_id: {r.task_id}
seq: {r.seq}
title: {r.title}
category: {r.category}
implementation_status: {r.impl_status}
screen: {r.screen}
route: {r.route}
page_entry: {r.page_entry}
priority: {r.priority}
depends_on: [{", ".join(depends)}]
requirements: [{", ".join(reqs)}]
status: TODO
---

# {r.task_id} — {r.title}

## Context

- Category: **{r.category}** / Implementation Status: **{r.impl_status}** / Priority: **{r.priority}**
- 이 Task는 `TASKS/00_TASK_LIST.md`(Seq {r.seq})에서 파생되었으며, 라우트 매핑은 `docs/06_SRS_UIUX_REVISED.md` §2를 따른다.
- Verify 방법: {', '.join(verify_items) if verify_items else '-'}

## Project Scope

{scope_note}

## Requirement Ref

{', '.join(reqs) if reqs else '-(Section 계약 전용)'}

## Screen / Route / Page Entry

| 항목 | 값 |
|---|---|
| Screen | {r.screen} |
| Route | {r.route} |
| Page Entry | {r.page_entry if r.page_entry != '-' else '-(Page Entry 없음 — 화면 조립 Task 아님)'} |

## Design Ref

{chr(10).join(design_ref_lines)}

## Depends On

{depends_section}

## Expected Files

{expected_files_section}

## Functional AC

{bullets(functional_ac_items, "명시된 Functional AC 없음 — 보완 필요")}

## Visual AC

{bullets(visual_ac_items, "이 Task는 시각적 요구사항이 없음(비-UI Task)")}

## Security/Privacy AC

{bullets(security_ac_items, "이 Task에 특화된 보안/개인정보 요구사항 없음(전역 SEC-BASELINE·DB-RLS-BASE를 따름)")}

## Test Cases

{chr(10).join(test_cases_lines)}

## Verify

{', '.join(verify_items) if verify_items else '-'}

## Definition of Done

- [ ] Functional AC, Visual AC, Security/Privacy AC 항목 전부 충족
- [ ] Expected Files 목록에 명시된 파일만 생성/수정됨(그 외 파일 변경 없음)
- [ ] Test Cases에 명시된 방법으로 확인 완료(Unit/E2E는 통과, Manual/Release Check는 체크리스트 기록)
- [ ] `design-reference/D-001/DESIGN.md`의 Do/Do Not 위반 없음(Lorem ipsum·준비 중·정보 확인 필요·빈 Card·예약/결제 UI·별점/매너온도 없음)
- [ ] `python scripts/audit_tasks.py` 재실행 시 이 Task와 관련된 FAIL 항목 없음

## Forbidden

{chr(10).join(f"- {f}" for f in forbidden)}
"""
    return md


def main() -> int:
    if not TASKLIST_PATH.exists():
        print(f"[FAIL] {TASKLIST_PATH} 없음")
        return 1

    text = TASKLIST_PATH.read_text(encoding="utf-8")
    rows = parse_tasklist(text)

    report = Report()
    validate(rows, report)
    print(report.render())
    print()
    if not report.ok:
        print("RESULT: VALIDATION_FAIL — Task 상세 파일을 생성하지 않는다.")
        return 1

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    created, skipped = [], []
    for r in rows:
        out_path = OUT_DIR / f"TASK-{r.task_id}.md"
        if out_path.exists():
            skipped.append(out_path.name)
            continue
        out_path.write_text(render_task_md(r), encoding="utf-8")
        created.append(out_path.name)

    print(f"생성: {len(created)}개, 건너뜀(이미 존재): {len(skipped)}개, 총 Task 행: {len(rows)}개")

    # 1:1 대조
    tasklist_ids = {r.task_id for r in rows}
    file_ids = {p.stem.removeprefix("TASK-") for p in OUT_DIR.glob("TASK-*.md")}
    missing_files = tasklist_ids - file_ids
    extra_files = file_ids - tasklist_ids
    print()
    print(f"[{'PASS' if not missing_files and not extra_files else 'FAIL'}] Task List ID ↔ TASK-*.md 파일명 1:1 대조 "
          f"— 목록 {len(tasklist_ids)}개, 파일 {len(file_ids)}개")
    if missing_files:
        print(f"  파일 없음: {sorted(missing_files)}")
    if extra_files:
        print(f"  목록에 없는 파일: {sorted(extra_files)}")

    return 0 if (not missing_files and not extra_files) else 1


if __name__ == "__main__":
    sys.exit(main())

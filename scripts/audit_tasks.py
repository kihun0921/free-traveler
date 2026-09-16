#!/usr/bin/env python3
"""
audit_tasks.py

Traveler Task 파이프라인(HARNESS_SCHEMA: traveler-screen-route-v1)의
최종 감사 스크립트. 18개 검사를 수행하고 두 산출물을 생성한다:

  - TASKS/TASK_MANIFEST.csv      (Task 전체 목록, 스프레드시트용)
  - TASKS/TASK_AUDIT_REPORT.md   (18개 검사 결과 보고서)

입력(읽기 전용, 이 스크립트는 이 파일들을 수정하지 않는다):
  - TASKS/00_TASK_LIST.md
  - TASKS/TASK-*.md
  - docs/PROJECT_SCOPE.md
  - design-reference/SCREEN_ROUTE_CONTRACT.json

exit code: 0 = AUDIT_PASS, 1 = 오류 있음(AUDIT_FAIL)
"""

from __future__ import annotations

import csv
import json
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

REPO_ROOT = Path(__file__).resolve().parent.parent
TASKLIST_PATH = REPO_ROOT / "TASKS/00_TASK_LIST.md"
TASKS_DIR = REPO_ROOT / "TASKS"
PROJECT_SCOPE_PATH = REPO_ROOT / "docs/PROJECT_SCOPE.md"
SCREEN_ROUTE_CONTRACT_PATH = REPO_ROOT / "design-reference/SCREEN_ROUTE_CONTRACT.json"
MANIFEST_CSV_PATH = TASKS_DIR / "TASK_MANIFEST.csv"
AUDIT_REPORT_PATH = TASKS_DIR / "TASK_AUDIT_REPORT.md"

EXPECTED_SCHEMA = "traveler-screen-route-v1"
SCREEN_IDS = [f"SCR-00{i}" for i in range(1, 6)]
ALLOWED_TABLES = {
    "user_profile",
    "mate_post",
    "mate_application",
    "user_block",
    "report",
    "app_setting",
}
REQUIRED_DB_TASK_IDS = {
    "schema": "DB-SCHEMA-BASE",
    "rls": "DB-RLS-BASE",
    "access": "DB-ACCESS",
    "seed": "DB-SEED-BASE",
}
INFRA_FORBIDDEN_KEYWORDS = ["EC2", "AWS", "자동 병합", "Merge Runner", "머지 러너"]
ROW_RE = re.compile(r"^\|\s*\d+\s*\|")
SCOPE_ROW_RE = re.compile(r"^\|\s*(REQ-(?:FUNC|NF)-\d{3})\s*\|\s*(IMPLEMENT|EXCLUDED)\s*\|", re.MULTILINE)

EXPECTED_REQ_FUNC = [f"REQ-FUNC-{i:03d}" for i in range(1, 81)]
EXPECTED_REQ_NF = [f"REQ-NF-{i:03d}" for i in range(1, 35)]


@dataclass
class ListTask:
    seq: str
    task_id: str
    title: str
    category: str
    impl_status: str
    req_ref: str
    screen: str
    route: str
    page_entry: str
    depends_on: list[str] = field(default_factory=list)
    expected_files: str = ""


@dataclass
class DetailTask:
    task_id: str
    frontmatter: dict = field(default_factory=dict)
    body: str = ""

    @property
    def category(self) -> str:
        return self.frontmatter.get("category", "")

    @property
    def screen(self) -> str:
        return self.frontmatter.get("screen", "-")

    @property
    def route(self) -> str:
        return self.frontmatter.get("route", "-")

    @property
    def page_entry(self) -> str:
        return self.frontmatter.get("page_entry", "-")

    @property
    def priority(self) -> str:
        return self.frontmatter.get("priority", "-")

    @property
    def title(self) -> str:
        return self.frontmatter.get("title", "")

    @property
    def status(self) -> str:
        return self.frontmatter.get("status", "")

    @property
    def depends_on(self) -> list[str]:
        v = self.frontmatter.get("depends_on", [])
        return v if isinstance(v, list) else []

    @property
    def requirements(self) -> list[str]:
        v = self.frontmatter.get("requirements", [])
        return v if isinstance(v, list) else []


class Report:
    def __init__(self) -> None:
        self.ok = True
        self.entries: list[tuple[int, str, bool, str]] = []

    def check(self, num: int, label: str, passed: bool, detail: str = "") -> None:
        if not passed:
            self.ok = False
        self.entries.append((num, label, passed, detail))

    def render_text(self) -> str:
        lines = []
        for num, label, passed, detail in self.entries:
            status = "PASS" if passed else "FAIL"
            line = f"[{status}] {num}. {label}"
            if detail:
                line += f" — {detail}"
            lines.append(line)
        return "\n".join(lines)

    def render_markdown(self) -> str:
        lines = [
            "| # | 검사 | 결과 | 상세 |",
            "|---:|---|---|---|",
        ]
        for num, label, passed, detail in self.entries:
            status = "PASS" if passed else "FAIL"
            detail_cell = detail.replace("|", "/").replace("\n", " ") if detail else "-"
            lines.append(f"| {num} | {label} | {status} | {detail_cell} |")
        return "\n".join(lines)


# ---------------------------------------------------------------- parsing --


def parse_id_list(raw: str) -> list[str]:
    raw = raw.strip()
    if raw in ("", "-", "해당없음", "해당 없음"):
        return []
    return [x.strip() for x in raw.split(",") if x.strip()]


def parse_tasklist(text: str) -> list[ListTask]:
    tasks: list[ListTask] = []
    for line in text.splitlines():
        if not ROW_RE.match(line):
            continue
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if len(cells) != 16:
            continue
        (
            seq, task_id, title, category, impl_status, req_ref,
            screen, route, page_entry, depends_on, expected_files,
        ) = cells[:11]
        tasks.append(
            ListTask(
                seq=seq, task_id=task_id, title=title, category=category,
                impl_status=impl_status, req_ref=req_ref, screen=screen,
                route=route, page_entry=page_entry,
                depends_on=parse_id_list(depends_on), expected_files=expected_files,
            )
        )
    return tasks


def parse_detail_frontmatter(text: str) -> tuple[dict, str]:
    fm_match = re.match(r"^---\n(.*?)\n---\n(.*)$", text, re.DOTALL)
    if not fm_match:
        return {}, text
    fm_text, body = fm_match.groups()
    data: dict = {}
    for line in fm_text.splitlines():
        m = re.match(r"^([A-Za-z_]+):\s*(.*)$", line.strip())
        if not m:
            continue
        key, val = m.groups()
        data[key] = parse_id_list(val.strip("[]")) if val.startswith("[") else val.strip()
    return data, body


def load_detail_tasks() -> dict[str, DetailTask]:
    result: dict[str, DetailTask] = {}
    if not TASKS_DIR.exists():
        return result
    for p in sorted(TASKS_DIR.glob("TASK-*.md")):
        fm, body = parse_detail_frontmatter(p.read_text(encoding="utf-8"))
        task_id = fm.get("task_id", p.stem.removeprefix("TASK-"))
        result[task_id] = DetailTask(task_id=task_id, frontmatter=fm, body=body)
    return result


def load_project_scope() -> tuple[set[str], set[str]]:
    if not PROJECT_SCOPE_PATH.exists():
        return set(), set()
    text = PROJECT_SCOPE_PATH.read_text(encoding="utf-8")
    rows = SCOPE_ROW_RE.findall(text)
    implement_ids = {r[0] for r in rows if r[1] == "IMPLEMENT"}
    excluded_ids = {r[0] for r in rows if r[1] == "EXCLUDED"}
    return implement_ids, excluded_ids


def load_screen_route_contract() -> dict:
    if not SCREEN_ROUTE_CONTRACT_PATH.exists():
        return {}
    try:
        return json.loads(SCREEN_ROUTE_CONTRACT_PATH.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return {}


def body_excluding_prohibition_sections(body: str) -> str:
    """'Definition of Done'/'Forbidden' 절은 금지 항목을 나열하는 절이므로
    금지 키워드가 등장하는 것이 정상이다(위반이 아니라 규칙 명시). 그 앞부분만 검사한다."""
    return body.split("## Definition of Done")[0]


def get_verify_from_body(body: str) -> str:
    m = re.search(r"## Verify\s*\n+(.+?)(?:\n##|\Z)", body, re.DOTALL)
    return m.group(1).strip().replace("\n", " ") if m else ""


# ------------------------------------------------------------------ checks --


def check_1_one_to_one(report: Report, list_tasks: list[ListTask], detail_tasks: dict[str, DetailTask]) -> None:
    list_ids = {t.task_id for t in list_tasks}
    detail_ids = set(detail_tasks.keys())
    missing = list_ids - detail_ids
    extra = detail_ids - list_ids
    report.check(
        1, "Task List 구현 ID와 상세 Task 파일 1:1",
        not missing and not extra,
        f"상세 없음: {sorted(missing)}, 목록에 없는 상세: {sorted(extra)}",
    )


def check_2_no_duplicate_ids(report: Report, list_tasks: list[ListTask]) -> None:
    ids = [t.task_id for t in list_tasks]
    dup_in_list = sorted({i for i in ids if ids.count(i) > 1})
    file_stems = [p.stem.removeprefix("TASK-") for p in TASKS_DIR.glob("TASK-*.md")]
    dup_in_files = sorted({i for i in file_stems if file_stems.count(i) > 1})
    report.check(
        2, "중복 Task ID 0",
        not dup_in_list and not dup_in_files,
        f"List 중복: {dup_in_list}, 파일명 중복: {dup_in_files}",
    )


def check_3_no_missing_depends_on(report: Report, list_tasks: list[ListTask]) -> None:
    ids = {t.task_id for t in list_tasks}
    dangling = [f"{t.task_id} -> {dep}" for t in list_tasks for dep in t.depends_on if dep not in ids]
    report.check(3, "Depends On 누락 0(존재하지 않는 Task 참조 없음)", not dangling, f"끊긴 참조: {dangling}")


def check_4_no_cycle(report: Report, list_tasks: list[ListTask]) -> None:
    graph = {t.task_id: t.depends_on for t in list_tasks}
    WHITE, GRAY, BLACK = 0, 1, 2
    color = {tid: WHITE for tid in graph}
    cycle_path: list[str] = []

    def dfs(node: str, path: list[str]) -> bool:
        color[node] = GRAY
        path.append(node)
        for dep in graph.get(node, []):
            if dep not in color:
                continue
            if color[dep] == GRAY:
                cycle_path.extend(path[path.index(dep):] + [dep])
                return True
            if color[dep] == WHITE and dfs(dep, path):
                return True
        path.pop()
        color[node] = BLACK
        return False

    found_cycle = False
    for tid in list(graph.keys()):
        if color[tid] == WHITE:
            if dfs(tid, []):
                found_cycle = True
                break

    report.check(4, "Dependency Cycle 0", not found_cycle, f"순환 경로: {' -> '.join(cycle_path)}" if found_cycle else "")


def check_5_page_owner_per_screen(report: Report, tasks: dict[str, DetailTask]) -> dict[str, DetailTask]:
    owners_by_screen: dict[str, list[DetailTask]] = {}
    for t in tasks.values():
        if t.category == "PAGE_OWNER":
            owners_by_screen.setdefault(t.screen, []).append(t)

    multi = {s: [t.task_id for t in ts] for s, ts in owners_by_screen.items() if len(ts) > 1}
    missing = [s for s in SCREEN_IDS if s not in owners_by_screen]
    ok = not multi and not missing
    report.check(
        5, "Screen 5개 모두 Page Owner 정확히 1개",
        ok,
        f"Screen당 2개 이상: {multi}, Owner 없는 Screen: {missing}",
    )
    return {s: ts[0] for s, ts in owners_by_screen.items() if len(ts) == 1}


def check_6_route_page_entry_expected_files(report: Report, owners: dict[str, DetailTask], contract: dict) -> None:
    if not contract:
        report.check(6, "Route·Page Entry·Expected Files 일치", False, "SCREEN_ROUTE_CONTRACT.json 로드 실패")
        return
    contract_by_id = {s["id"]: s for s in contract.get("screens", [])}
    mismatches = []
    for sid, owner in owners.items():
        c = contract_by_id.get(sid)
        if c is None:
            mismatches.append(f"{sid}: SCREEN_ROUTE_CONTRACT.json에 없음")
            continue
        expected_route = c.get("route", "")
        expected_file = c.get("filePath", "")
        owner_route = owner.route.strip("`")
        owner_page_entry = owner.page_entry.strip("`")
        if owner_route != expected_route:
            mismatches.append(f"{sid}: route 불일치(Task={owner_route!r}, Contract={expected_route!r})")
        if owner_page_entry != expected_file:
            mismatches.append(f"{sid}: page_entry 불일치(Task={owner_page_entry!r}, Contract={expected_file!r})")
        if owner.page_entry not in owner.body and owner_page_entry not in owner.body:
            mismatches.append(f"{sid}: page_entry가 Expected Files 절에 없음")
    report.check(6, "Route·Page Entry·Expected Files 일치", not mismatches, "; ".join(mismatches))


def check_7_no_component_only_screen(report: Report, tasks: dict[str, DetailTask]) -> None:
    owner_screens = {t.screen for t in tasks.values() if t.category == "PAGE_OWNER"}
    component_screens = {
        t.screen for t in tasks.values()
        if t.category == "COMPONENT" and re.fullmatch(r"SCR-\d{3}", t.screen or "")
    }
    orphan = sorted(component_screens - owner_screens)
    report.check(7, "Component-only Screen 0(Component만 있고 Page Owner 없는 Screen 없음)", not orphan, f"Orphan Screen: {orphan}")


def check_8_scr001_starter(report: Report, owners: dict[str, DetailTask]) -> None:
    owner = owners.get("SCR-001")
    if owner is None:
        report.check(8, "SCR-001 Starter 제거 AC 존재", False, "SCR-001 Page Owner 없음")
        return
    text = owner.body
    ok = ("Next.js" in text or "create-next-app" in text or "기본 템플릿" in text) and "제거" in text
    report.check(8, "SCR-001 Starter 제거 AC 존재", ok)


def check_9_scr003_tabs(report: Report, owners: dict[str, DetailTask]) -> None:
    owner = owners.get("SCR-003")
    if owner is None:
        report.check(9, "SCR-003 세 탭 조립 AC 존재", False, "SCR-003 Page Owner 없음")
        return
    ok = all(kw in owner.body for kw in ["항공", "숙소", "동행"])
    report.check(9, "SCR-003 세 탭 조립 AC 존재", ok)


def check_10_scr005_roles(report: Report, owners: dict[str, DetailTask]) -> None:
    owner = owners.get("SCR-005")
    if owner is None:
        report.check(10, "SCR-005 역할별 상태 조립 AC 존재", False, "SCR-005 Page Owner 없음")
        return
    ok = all(kw in owner.body for kw in ["Guest", "Member", "Admin"])
    report.check(10, "SCR-005 역할별 상태 조립 AC 존재", ok)


def check_11_db_tasks_exist(report: Report, tasks: dict[str, DetailTask]) -> None:
    missing = [tid for tid in REQUIRED_DB_TASK_IDS.values() if tid not in tasks]
    report.check(
        11, "DB Schema·RLS·Access·Seed Task 존재",
        not missing,
        f"누락: {missing}" if missing else f"확인: {list(REQUIRED_DB_TASK_IDS.values())}",
    )


def check_12_db_table_scope(report: Report, tasks: dict[str, DetailTask]) -> None:
    disallowed: set[str] = set()
    mentioned: set[str] = set()
    for t in tasks.values():
        if t.category != "DB":
            continue
        scoped = body_excluding_prohibition_sections(t.body)
        for m in re.finditer(r"(?:CREATE TABLE|테이블)\s*[`\"]?([a-z_]+)[`\"]?", scoped, re.IGNORECASE):
            name = m.group(1).lower()
            if name and name not in ALLOWED_TABLES:
                disallowed.add(name)
        mentioned.update(n for n in re.findall(r"`([a-z_]+)`", scoped) if n in ALLOWED_TABLES)
    report.check(
        12, "DB Table 범위가 6개 기본 테이블을 크게 넘지 않음",
        not disallowed and len(mentioned) <= 6,
        f"허용 목록 밖 테이블: {sorted(disallowed)}, 언급된 허용 테이블 수: {len(mentioned)}",
    )


def check_13_external_input_not_stored(report: Report, tasks: dict[str, DetailTask]) -> None:
    candidates = ["COMP-SCR003-FLIGHT-FORM", "COMP-SCR003-HOTEL-FORM", "API-OUTBOUND-VALIDATION", "PAGE-SCR003"]
    phrases = ["전달되지 않", "전달 안", "저장하지 않", "미보존", "미전달", "저장·미전송", "미전송"]
    found_in = []
    for tid in candidates:
        t = tasks.get(tid)
        if t is None:
            continue
        scoped = body_excluding_prohibition_sections(t.body)
        if any(p in scoped for p in phrases):
            found_in.append(tid)
    report.check(
        13, "외부 입력 비저장 AC 존재(항공·숙소 입력값 서버/DB/URL 미전달)",
        bool(found_in),
        f"확인된 Task: {found_in}" if found_in else f"확인 대상 Task 중 어디에도 없음: {candidates}",
    )


def check_14_auth_adult_rls(report: Report, tasks: dict[str, DetailTask]) -> None:
    problems = []
    auth_task = tasks.get("AUTH-SUPABASE-SETUP")
    if auth_task is None or "성인" not in body_excluding_prohibition_sections(auth_task.body):
        problems.append("AUTH-SUPABASE-SETUP에 성인 확인 AC 없음")
    rls_task = tasks.get("DB-RLS-BASE")
    if rls_task is None or "RLS" not in body_excluding_prohibition_sections(rls_task.body):
        problems.append("DB-RLS-BASE에 RLS AC 없음")
    rls_test = tasks.get("TEST-RLS-BASIC")
    if rls_test is None:
        problems.append("TEST-RLS-BASIC Task 없음")
    report.check(14, "Auth·성인·기본 RLS AC 존재", not problems, "; ".join(problems))


def check_15_playwright_chromium(report: Report, tasks: dict[str, DetailTask]) -> None:
    e2e_tasks = [t for t in tasks.values() if t.category == "E2E_TEST"]
    chromium_ok = []
    bad_browser = []
    for t in e2e_tasks:
        scoped_lower = body_excluding_prohibition_sections(t.body).lower()
        if "chromium" in scoped_lower:
            chromium_ok.append(t.task_id)
        if "firefox" in scoped_lower or "webkit" in scoped_lower:
            bad_browser.append(t.task_id)
    ok = len(e2e_tasks) >= 1 and bool(chromium_ok) and not bad_browser
    report.check(
        15, "Playwright Chromium Smoke Task 존재",
        ok,
        f"E2E Task {len(e2e_tasks)}개, Chromium 명시 {chromium_ok}, 타 브라우저 위반 {bad_browser}",
    )


def check_16_no_aws_ec2_automerge(report: Report, tasks: dict[str, DetailTask]) -> None:
    hits: dict[str, list[str]] = {}
    for t in tasks.values():
        scoped = body_excluding_prohibition_sections(t.body)
        for kw in INFRA_FORBIDDEN_KEYWORDS:
            if kw.lower() in scoped.lower():
                hits.setdefault(kw, []).append(t.task_id)
    report.check(16, "AWS·EC2·자동 Merge 구현 Task 0", not hits, f"검출: {hits}" if hits else "")


def check_17_all_requirements_tracked(report: Report, tasks: dict[str, DetailTask]) -> tuple[set[str], set[str]]:
    implement_ids, excluded_ids = load_project_scope()
    used: set[str] = set()
    for t in tasks.values():
        used.update(t.requirements)

    all_expected = set(EXPECTED_REQ_FUNC) | set(EXPECTED_REQ_NF)
    accounted = used | excluded_ids
    missing = all_expected - accounted
    func_missing = sorted(x for x in missing if x.startswith("REQ-FUNC"))
    nf_missing = sorted(x for x in missing if x.startswith("REQ-NF"))

    report.check(
        17, "REQ-FUNC 80개와 REQ-NF 34개가 Task 또는 EXCLUDED 표에 존재",
        not missing,
        f"REQ-FUNC 누락: {func_missing}, REQ-NF 누락: {nf_missing}",
    )
    return used, excluded_ids


def check_18_excluded_no_impl_file(report: Report, tasks: dict[str, DetailTask], excluded_ids: set[str]) -> None:
    leaked = []
    for t in tasks.values():
        overlap = set(t.requirements) & excluded_ids
        if overlap:
            leaked.append(f"{t.task_id}: {sorted(overlap)}")
    # 방어적 점검: EXCLUDED ID 자체를 파일명으로 가진 구현 파일이 없는지도 확인
    stray_files = [
        p.name for p in TASKS_DIR.glob("TASK-*.md")
        if any(rid in p.name for rid in excluded_ids)
    ]
    report.check(
        18, "EXCLUDED 상세 구현 파일이 생성되지 않음",
        not leaked and not stray_files,
        f"requirements에 EXCLUDED 포함: {leaked}, EXCLUDED ID 파일명 발견: {stray_files}",
    )


# ------------------------------------------------------------------ output --


def write_manifest_csv(tasks: dict[str, DetailTask]) -> None:
    fieldnames = ["task_id", "category", "screen", "route", "page_entry", "priority", "depends_on", "requirements", "verify", "status"]
    with MANIFEST_CSV_PATH.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for tid in sorted(tasks.keys()):
            t = tasks[tid]
            writer.writerow(
                {
                    "task_id": t.task_id,
                    "category": t.category,
                    "screen": t.screen,
                    "route": t.route,
                    "page_entry": t.page_entry,
                    "priority": t.priority,
                    "depends_on": "; ".join(t.depends_on),
                    "requirements": "; ".join(t.requirements),
                    "verify": get_verify_from_body(t.body),
                    "status": t.status,
                }
            )


def write_audit_report(report: Report, overall_ok: bool) -> None:
    total = len(report.entries)
    passed = sum(1 for _, _, ok, _ in report.entries if ok)
    lines = [
        "# Free Traveler — Task Audit Report",
        "",
        f"- **Result:** {'AUDIT_PASS' if overall_ok else 'AUDIT_FAIL'}",
        f"- **Checks:** {passed}/{total} passed",
        "- **Inputs:** `TASKS/00_TASK_LIST.md`, `TASKS/TASK-*.md`, `docs/PROJECT_SCOPE.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json`",
        "",
        "## Checklist (1~18)",
        "",
        report.render_markdown(),
        "",
    ]
    AUDIT_REPORT_PATH.write_text("\n".join(lines), encoding="utf-8")


def main() -> int:
    if not TASKLIST_PATH.exists() or not any(TASKS_DIR.glob("TASK-*.md")):
        print("[INFO] TASKS/00_TASK_LIST.md 또는 TASKS/TASK-*.md가 아직 없다.")
        print("RESULT: NOTHING_TO_AUDIT")
        return 1

    report = Report()

    list_text = TASKLIST_PATH.read_text(encoding="utf-8")
    list_tasks = parse_tasklist(list_text)
    detail_tasks = load_detail_tasks()
    contract = load_screen_route_contract()

    check_1_one_to_one(report, list_tasks, detail_tasks)
    check_2_no_duplicate_ids(report, list_tasks)
    check_3_no_missing_depends_on(report, list_tasks)
    check_4_no_cycle(report, list_tasks)
    owners = check_5_page_owner_per_screen(report, detail_tasks)
    check_6_route_page_entry_expected_files(report, owners, contract)
    check_7_no_component_only_screen(report, detail_tasks)
    check_8_scr001_starter(report, owners)
    check_9_scr003_tabs(report, owners)
    check_10_scr005_roles(report, owners)
    check_11_db_tasks_exist(report, detail_tasks)
    check_12_db_table_scope(report, detail_tasks)
    check_13_external_input_not_stored(report, detail_tasks)
    check_14_auth_adult_rls(report, detail_tasks)
    check_15_playwright_chromium(report, detail_tasks)
    check_16_no_aws_ec2_automerge(report, detail_tasks)
    _used, excluded_ids = check_17_all_requirements_tracked(report, detail_tasks)
    check_18_excluded_no_impl_file(report, detail_tasks, excluded_ids)

    print(report.render_text())
    print()

    write_manifest_csv(detail_tasks)
    write_audit_report(report, report.ok)
    print(f"산출물 작성: {MANIFEST_CSV_PATH.relative_to(REPO_ROOT)}, {AUDIT_REPORT_PATH.relative_to(REPO_ROOT)}")
    print()

    total = len(report.entries)
    passed = sum(1 for _, _, ok, _ in report.entries if ok)
    if report.ok:
        print(f"AUDIT_PASS ({passed}/{total} checks)")
        return 0
    print(f"AUDIT_FAIL ({passed}/{total} checks passed)")
    return 1


if __name__ == "__main__":
    sys.exit(main())

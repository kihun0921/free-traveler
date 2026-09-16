#!/usr/bin/env python3
"""Free Traveler — Wave/DAG builder.

Reads the Task pipeline (TASK_MANIFEST.csv + TASK-<ID>.md frontmatter) and
design-reference/SCREEN_ROUTE_CONTRACT.json, computes a dependency-safe Wave
plan, and writes:

  - TASKS/TASK_DAG.md      (human-readable dependency graph + cycle report)
  - TASKS/WAVE_PLAN.md     (Wave -> Task ID list, consumed by /run-wave)
  - TASKS/WAVE_STATE.json  (initial execution state, schema_version)
  - TASKS/TASK_MANIFEST.csv rewritten with a `wave_id` column added

This script does not write implementation code, does not create git
branches/PRs, and does not merge anything. It only plans Wave order.
"""

from __future__ import annotations

import csv
import json
import re
import sys
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parents[1]
TASKS_DIR = ROOT / "TASKS"
DETAILS_DIR_CANDIDATES = [TASKS_DIR / "details", TASKS_DIR]  # try nested, fall back to flat
MANIFEST_PATH = TASKS_DIR / "TASK_MANIFEST.csv"
CONTRACT_PATH = ROOT / "design-reference" / "SCREEN_ROUTE_CONTRACT.json"
DAG_OUT = TASKS_DIR / "TASK_DAG.md"
WAVE_PLAN_OUT = TASKS_DIR / "WAVE_PLAN.md"
WAVE_STATE_OUT = TASKS_DIR / "WAVE_STATE.json"

MIN_WAVE_SIZE = 4
MAX_WAVE_SIZE = 7

# Wave 그룹 순서 (사용자 지정, 이 순서를 벗어나지 않는다)
GROUP_TITLES = {
    1: "Scaffold, 문서, Harness 확인",
    2: "Airbnb 스타일 공통 UI, 정적 데이터, Layout",
    3: "Supabase Auth, 6개 Table, 기본 RLS",
    4: "SCR-001 메인 Component와 Page Owner",
    5: "SCR-002 대표 소개 Component와 Page Owner",
    6: "SCR-003 여행 입력·외부 이동·동행글 입력 Component와 Page Owner",
    7: "SCR-004 동행 목록·상세·신청 Component와 Page Owner",
    8: "SCR-005 계정·내 활동·간단 관리자 Component와 Page Owner",
    9: "Unit·Playwright·접근성·CI",
    10: "Vercel Preview와 Release 확인",
}

SCREEN_TO_GROUP = {
    "SCR-001": 4,
    "SCR-002": 5,
    "SCR-003": 6,
    "SCR-004": 7,
    "SCR-005": 8,
}

# 카테고리/Task ID 단위 명시적 그룹 지정(화면만으로 판단할 수 없는 공용/기반 Task)
EXPLICIT_GROUP = {
    "DATA-DESTINATIONS": 2,
    "DATA-SAFETY": 2,
    "DATA-REPRESENTATIVE": 2,
    "DATA-CONTENT-VALIDATION": 2,
    "COMP-GLOBAL-HEADER-FOOTER": 2,
    "COMP-GLOBAL-FAVORITE-TOGGLE": 2,
    "COMP-GLOBAL-SHARE-BUTTON": 2,
    "COMP-GLOBAL-TOAST": 2,
    "COMP-GLOBAL-ERROR-PAGES": 2,
    "COMP-GLOBAL-POLICY-PAGES": 2,
    "DB-SCHEMA-BASE": 3,
    "DB-RLS-BASE": 3,
    "DB-ACCESS": 3,
    "DB-SEED-BASE": 3,
    "AUTH-SUPABASE-SETUP": 3,
    "SEC-BASELINE": 3,
    "API-MATE-POSTS": 3,       # SCR-001 최근 동행글 미리보기가 Group4에서 바로 필요
    "API-ADMIN-SETTINGS": 3,   # API-OUTBOUND-VALIDATION(Group6)의 선행 조건
    "TEST-RLS-BASIC": 3,
    "API-OUTBOUND-VALIDATION": 6,
    "API-CONTACT-DETECTION": 6,
    "API-MATE-APPLICATIONS": 7,
    "API-BLOCK-REPORT": 7,
    "COMP-GLOBAL-A11Y": 9,     # 그룹9 제목의 "접근성"에 해당
    "COMP-GLOBAL-SEO": 9,      # 모든 Page Owner의 page.tsx를 수정하므로 Page Owner 이후 배치
    "UNIT-TRAVEL-DATES": 9,
    "UNIT-CONTACT-DETECTION": 9,
    "UNIT-MATE-STATE": 9,
    "E2E-PUBLIC-SMOKE": 9,
    "E2E-TRAVEL-TOOLS": 9,
    "E2E-MATE-AUTH": 9,
    "CI-LINT-TYPECHECK-UNIT": 9,
    "RELEASE-PERFORMANCE-CHECK": 10,
    "RELEASE-A11Y-MANUAL": 10,
    "RELEASE-CONTENT-QA": 10,
    "RELEASE-SEO-CHECK": 10,
    "RELEASE-COST-CHECK": 10,
    "RELEASE-VERCEL-SUPABASE-CHECK": 10,
}

FRONTMATTER_RE = re.compile(r"^---\n(.*?)\n---\n", re.S)
FIELD_RE = re.compile(r"^([a-zA-Z_]+):\s*(.*)$", re.M)
BACKTICK_RE = re.compile(r"`([^`]+)`")


@dataclass
class TaskInfo:
    task_id: str
    category: str
    screen: str
    depends_on: list[str]
    expected_files: list[str]
    touches_all_pages: bool
    seq: int = 0
    preferred_group: int = 0


def find_details_dir() -> Path:
    for cand in DETAILS_DIR_CANDIDATES:
        if cand.exists() and list(cand.glob("TASK-*.md")):
            return cand
    print(f"[FATAL] TASK-*.md 상세 파일을 찾을 수 없음 (확인 경로: {DETAILS_DIR_CANDIDATES})")
    sys.exit(1)


def parse_frontmatter(text: str) -> dict[str, str]:
    m = FRONTMATTER_RE.match(text)
    if not m:
        return {}
    block = m.group(1)
    out: dict[str, str] = {}
    for fm in FIELD_RE.finditer(block):
        out[fm.group(1)] = fm.group(2).strip()
    return out


def parse_list_field(raw: str) -> list[str]:
    raw = raw.strip()
    if raw.startswith("[") and raw.endswith("]"):
        inner = raw[1:-1].strip()
        if not inner:
            return []
        return [x.strip() for x in inner.split(",") if x.strip()]
    if raw in ("", "-"):
        return []
    return [raw]


def extract_expected_files(body: str) -> tuple[list[str], bool]:
    m = re.search(r"## Expected Files\n(.*?)\n##", body, re.S)
    section = m.group(1) if m else ""
    # 실제 파일 목록은 "- `path`" 형태의 글머리 기호 줄만 해당한다.
    # ">"로 시작하는 안내 문구(예: "추가 파일이 필요하면 `TASKS/00_TASK_LIST.md`를 먼저 갱신...")는
    # 이 Task가 실제로 수정하는 파일이 아니므로 반드시 제외한다.
    bullet_lines = [ln for ln in section.splitlines() if ln.strip().startswith("-")]
    tokens: list[str] = []
    for ln in bullet_lines:
        tokens.extend(BACKTICK_RE.findall(ln))
    files = []
    touches_all_pages = False
    for tok in tokens:
        if tok in ("page.tsx", "layout.tsx"):
            touches_all_pages = True
            continue
        if "/" in tok or tok.endswith((".ts", ".tsx", ".sql", ".yml", ".json", ".md", ".css")):
            files.append(tok)
    if any(re.search(r"각\s*`?page\.tsx`?", ln) for ln in bullet_lines):
        touches_all_pages = True
    return files, touches_all_pages


def load_tasks(details_dir: Path) -> dict[str, TaskInfo]:
    tasks: dict[str, TaskInfo] = {}
    for path in sorted(details_dir.glob("TASK-*.md")):
        text = path.read_text(encoding="utf-8")
        fm = parse_frontmatter(text)
        task_id = fm.get("task_id", path.stem.replace("TASK-", "", 1))
        category = fm.get("category", "")
        screen = fm.get("screen", "-")
        depends_on = parse_list_field(fm.get("depends_on", "[]"))
        seq = int(fm.get("seq", "0") or 0)
        files, touches_all = extract_expected_files(text)
        tasks[task_id] = TaskInfo(
            task_id=task_id,
            category=category,
            screen=screen,
            depends_on=depends_on,
            expected_files=files,
            touches_all_pages=touches_all,
            seq=seq,
        )
    return tasks


def load_manifest_rows() -> list[dict[str, str]]:
    with MANIFEST_PATH.open(encoding="utf-8", newline="") as f:
        return list(csv.DictReader(f))


def load_page_owners(tasks: dict[str, TaskInfo]) -> list[str]:
    return sorted(t.task_id for t in tasks.values() if t.category == "PAGE_OWNER")


def assign_preferred_groups(tasks: dict[str, TaskInfo]) -> None:
    for t in tasks.values():
        if t.task_id in EXPLICIT_GROUP:
            t.preferred_group = EXPLICIT_GROUP[t.task_id]
        elif t.screen in SCREEN_TO_GROUP:
            t.preferred_group = SCREEN_TO_GROUP[t.screen]
        elif t.category == "RELEASE_CHECK":
            t.preferred_group = 10
        elif t.category in ("UNIT_TEST", "RLS_TEST", "E2E_TEST", "CI"):
            t.preferred_group = 9
        elif t.category == "DATA":
            t.preferred_group = 2
        else:
            # 화면이 없는 공용 COMPONENT/기타는 기본적으로 공통 UI 그룹
            t.preferred_group = 2


def add_inferred_edges(tasks: dict[str, TaskInfo], page_owners: list[str]) -> list[tuple[str, str]]:
    """페이지 소유자 이후에 배치되어야 하는 암묵적 순서(예: SEO가 각 page.tsx를 수정)를 edge로 추가."""
    inferred: list[tuple[str, str]] = []
    for t in tasks.values():
        if t.touches_all_pages and t.category != "PAGE_OWNER":
            for owner in page_owners:
                if owner not in t.depends_on:
                    t.depends_on.append(owner)
                    inferred.append((owner, t.task_id))
    return inferred


def detect_cycles(tasks: dict[str, TaskInfo]) -> list[list[str]]:
    WHITE, GRAY, BLACK = 0, 1, 2
    color = {tid: WHITE for tid in tasks}
    cycles: list[list[str]] = []
    stack: list[str] = []

    def dfs(node: str) -> None:
        color[node] = GRAY
        stack.append(node)
        for dep in tasks[node].depends_on:
            if dep not in tasks:
                continue
            if color[dep] == GRAY:
                idx = stack.index(dep)
                cycles.append(stack[idx:] + [dep])
            elif color[dep] == WHITE:
                dfs(dep)
        stack.pop()
        color[node] = BLACK

    for tid in tasks:
        if color[tid] == WHITE:
            dfs(tid)
    return cycles


def topo_sort(tasks: dict[str, TaskInfo]) -> list[str]:
    """Kahn's algorithm. dependents[x] = tasks that depend ON x (x must run first)."""
    indegree = {tid: len(t.depends_on) for tid, t in tasks.items()}
    dependents: dict[str, list[str]] = {tid: [] for tid in tasks}
    for tid, t in tasks.items():
        for dep in t.depends_on:
            if dep in dependents:
                dependents[dep].append(tid)

    ready = [tid for tid, d in indegree.items() if d == 0]

    def sort_key(tid: str) -> tuple:
        t = tasks[tid]
        return (t.preferred_group, t.seq if t.seq else 999, t.task_id)

    ready.sort(key=sort_key)
    order: list[str] = []
    while ready:
        ready.sort(key=sort_key)
        current = ready.pop(0)
        order.append(current)
        for nxt in dependents[current]:
            indegree[nxt] -= 1
            if indegree[nxt] == 0:
                ready.append(nxt)
    if len(order) != len(tasks):
        remaining = set(tasks) - set(order)
        print(f"[FATAL] 순환 의존성으로 topo sort 미완료. 미배치 Task: {sorted(remaining)}")
        sys.exit(1)
    return order


def find_file_conflicts(tasks: dict[str, TaskInfo]) -> dict[str, set[str]]:
    """동일 파일을 Expected Files로 명시한 서로 다른 Task 쌍을 충돌로 기록."""
    file_owners: dict[str, list[str]] = {}
    for t in tasks.values():
        for f in t.expected_files:
            file_owners.setdefault(f, []).append(t.task_id)
    conflicts: dict[str, set[str]] = {tid: set() for tid in tasks}
    for _, owners in file_owners.items():
        if len(owners) < 2:
            continue
        for a in owners:
            for b in owners:
                if a != b:
                    conflicts[a].add(b)
    return conflicts


def local_topo_within_wave(wave_tasks: list[str], tasks: dict[str, TaskInfo]) -> list[str]:
    """Wave 내부에서는 Task ID 순으로 실행하되, 같은 Wave 안의 실제 의존 관계는 위반하지 않는다."""
    wave_set = set(wave_tasks)
    indegree = {tid: 0 for tid in wave_tasks}
    dependents: dict[str, list[str]] = {tid: [] for tid in wave_tasks}
    for tid in wave_tasks:
        for dep in tasks[tid].depends_on:
            if dep in wave_set:
                indegree[tid] += 1
                dependents[dep].append(tid)
    ready = sorted([tid for tid, d in indegree.items() if d == 0])
    ordered: list[str] = []
    while ready:
        ready.sort()
        cur = ready.pop(0)
        ordered.append(cur)
        for nxt in dependents[cur]:
            indegree[nxt] -= 1
            if indegree[nxt] == 0:
                ready.append(nxt)
    return ordered


def build_waves(order: list[str], tasks: dict[str, TaskInfo], conflicts: dict[str, set[str]]) -> list[list[str]]:
    waves: list[list[str]] = []
    current: list[str] = []
    current_group: int | None = None

    def flush() -> None:
        nonlocal current, current_group
        if current:
            waves.append(current)
        current = []
        current_group = None

    for tid in order:
        g = tasks[tid].preferred_group
        conflict_hit = any(other in current for other in conflicts.get(tid, set()))
        must_break_size = len(current) >= MAX_WAVE_SIZE
        must_break_group = current and g != current_group and len(current) >= MIN_WAVE_SIZE
        if current and (must_break_size or must_break_group or conflict_hit):
            flush()
        current.append(tid)
        current_group = g if current_group is None else current_group
    flush()
    return waves


def verify_no_forward_violation(waves: list[list[str]], tasks: dict[str, TaskInfo]) -> int:
    wave_index = {tid: i for i, w in enumerate(waves) for tid in w}
    violations = 0
    for tid, t in tasks.items():
        for dep in t.depends_on:
            if dep not in wave_index:
                continue
            if wave_index[dep] > wave_index[tid]:
                violations += 1
                print(f"[FAIL] {dep} (Wave {wave_index[dep]+1}) 가 후행 Task {tid} (Wave {wave_index[tid]+1}) 보다 뒤에 배치됨")
    return violations


def make_wave_ids(n: int) -> list[str]:
    return [f"W{str(i+1).zfill(2)}" for i in range(n)]


def wave_title(tasks_in_wave: list[str], tasks: dict[str, TaskInfo]) -> str:
    groups = sorted({tasks[t].preferred_group for t in tasks_in_wave})
    titles = [GROUP_TITLES[g] for g in groups]
    return " / ".join(dict.fromkeys(titles))


def has_page_owner(tasks_in_wave: list[str], tasks: dict[str, TaskInfo]) -> list[str]:
    return [t for t in tasks_in_wave if tasks[t].category == "PAGE_OWNER"]


def write_task_dag(tasks: dict[str, TaskInfo], cycles: list[list[str]], inferred: list[tuple[str, str]],
                    order: list[str], waves: list[list[str]], wave_ids: list[str]) -> None:
    lines = []
    lines.append("# Free Traveler — Task Dependency Graph (TASKS/TASK_DAG.md)")
    lines.append("")
    lines.append("- **생성 스크립트:** `scripts/build_waves.py`")
    lines.append("- **입력:** `TASKS/TASK_MANIFEST.csv`, `TASKS/TASK-*.md`(frontmatter `depends_on`), `design-reference/SCREEN_ROUTE_CONTRACT.json`")
    lines.append("- 이 문서는 계획 문서이며 구현 코드가 아니다.")
    lines.append("")
    lines.append(f"## 순환 의존성 검사 결과: {len(cycles)}건")
    if cycles:
        for c in cycles:
            lines.append(f"- 순환: {' -> '.join(c)}")
    else:
        lines.append("- 순환 의존성 없음(0건).")
    lines.append("")
    if inferred:
        lines.append("## 추론된 암묵적 순서(파일 충돌 기반, 원본 Task 문서의 Depends On에는 없음)")
        for a, b in inferred:
            lines.append(f"- `{a}` → `{b}` (동일 `page.tsx` 계열 파일을 나중에 수정하므로 Page Owner 이후로 강제)")
        lines.append("")
    lines.append("## Task 별 의존 관계")
    lines.append("")
    lines.append("| Task ID | Category | Screen | Depends On | 배치 Wave |")
    lines.append("|---|---|---|---|---|")
    wave_of = {tid: wave_ids[i] for i, w in enumerate(waves) for tid in w}
    for tid in order:
        t = tasks[tid]
        deps = ", ".join(t.depends_on) if t.depends_on else "-"
        lines.append(f"| {tid} | {t.category} | {t.screen} | {deps} | {wave_of.get(tid, '-')} |")
    lines.append("")
    lines.append("## Wave 배치 순서(Topological Order)")
    lines.append("")
    lines.append(", ".join(order))
    lines.append("")
    DAG_OUT.write_text("\n".join(lines) + "\n", encoding="utf-8")


def write_wave_plan(waves: list[list[str]], wave_ids: list[str], tasks: dict[str, TaskInfo]) -> None:
    lines = []
    lines.append("# Free Traveler — Wave Plan (TASKS/WAVE_PLAN.md)")
    lines.append("")
    lines.append("- **생성 스크립트:** `scripts/build_waves.py` — 이후 `/run-wave`, `/prepare-task`가 이 파일을 Wave 소속 정본으로 읽는다.")
    lines.append("- Wave ID는 배치 결과에 따라 동적으로 생성되었으며 W00~W10으로 미리 고정되지 않았다.")
    lines.append("- 각 Wave는 `TASKS/00_TASK_LIST.md`의 Depends On 순서를 위반하지 않는다(선행 Task가 후행 Wave에 배치된 경우 없음 — 검증 결과는 실행 로그 참고).")
    lines.append("- 한 Wave 내부에서도 Task ID 순으로 한 개씩 순차 구현한다(§ 각 Wave의 Task 목록은 이미 이 순서로 정렬됨).")
    lines.append("")
    for i, (wid, wtasks) in enumerate(zip(wave_ids, waves)):
        title = wave_title(wtasks, tasks)
        owners = has_page_owner(wtasks, tasks)
        lines.append(f"## Wave {wid}")
        lines.append("")
        lines.append(f"- **그룹:** {title}")
        lines.append(f"- **Task 수:** {len(wtasks)}")
        lines.append("- **Task 목록(Task ID 순 실행):**")
        for tid in wtasks:
            lines.append(f"  - {tid}")
        if owners:
            lines.append(f"- **Page Owner(이 화면의 마지막 통합 Task):** {', '.join(owners)}")
            lines.append("- **Preview Checkpoint: required** — 이 Wave에 Page Owner가 포함되어 있으므로, 사람이 Vercel Preview에서 확인하기 전에는 다음 Wave를 자동으로 시작하지 않는다.")
        lines.append("")
    WAVE_PLAN_OUT.write_text("\n".join(lines) + "\n", encoding="utf-8")


def write_wave_state(waves: list[list[str]], wave_ids: list[str], tasks: dict[str, TaskInfo]) -> None:
    state = {
        "schema_version": "traveler-wave-state-v1",
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "waves": [],
    }
    for wid, wtasks in zip(wave_ids, waves):
        owners = has_page_owner(wtasks, tasks)
        state["waves"].append(
            {
                "wave_id": wid,
                "title": wave_title(wtasks, tasks),
                "task_ids": wtasks,
                "status": "pending",
                "checkpoint_required": bool(owners),
                "checkpoint_result": None,
            }
        )
    WAVE_STATE_OUT.write_text(json.dumps(state, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def rewrite_manifest_with_wave_id(waves: list[list[str]], wave_ids: list[str]) -> None:
    wave_of = {tid: wid for wid, wtasks in zip(wave_ids, waves) for tid in wtasks}
    rows = load_manifest_rows()
    fieldnames = list(rows[0].keys()) if rows else []
    if "wave_id" not in fieldnames:
        fieldnames.append("wave_id")
    for row in rows:
        row["wave_id"] = wave_of.get(row["task_id"], "-")
    with MANIFEST_PATH.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    if not MANIFEST_PATH.exists():
        print(f"[FATAL] {MANIFEST_PATH} 없음 — 먼저 scripts/audit_tasks.py를 실행해 Manifest를 생성한다.")
        sys.exit(1)
    if not CONTRACT_PATH.exists():
        print(f"[FATAL] {CONTRACT_PATH} 없음.")
        sys.exit(1)
    json.loads(CONTRACT_PATH.read_text(encoding="utf-8"))  # 존재·파싱 가능성만 확인(스키마 자체는 이미 audit_tasks.py가 검증)

    details_dir = find_details_dir()
    tasks = load_tasks(details_dir)
    manifest_ids = {r["task_id"] for r in load_manifest_rows()}
    if set(tasks) != manifest_ids:
        missing_detail = manifest_ids - set(tasks)
        missing_manifest = set(tasks) - manifest_ids
        print(f"[FATAL] Manifest ↔ 상세 파일 불일치. Manifest에만 있음: {sorted(missing_detail)}, 상세 파일에만 있음: {sorted(missing_manifest)}")
        sys.exit(1)

    page_owners = load_page_owners(tasks)
    if len(page_owners) != 5:
        print(f"[FATAL] Page Owner가 정확히 5개가 아님: {page_owners}")
        sys.exit(1)

    assign_preferred_groups(tasks)
    inferred_edges = add_inferred_edges(tasks, page_owners)

    cycles = detect_cycles(tasks)
    if cycles:
        print(f"[FATAL] 순환 의존성 {len(cycles)}건 발견 — Wave를 생성하지 않는다.")
        for c in cycles:
            print(f"  - {' -> '.join(c)}")
        sys.exit(1)

    order = topo_sort(tasks)
    conflicts = find_file_conflicts(tasks)
    waves = build_waves(order, tasks, conflicts)
    waves = [local_topo_within_wave(w, tasks) for w in waves]

    violations = verify_no_forward_violation(waves, tasks)
    if violations:
        print(f"[FATAL] 선행 Task가 후행 Wave에 배치된 경우 {violations}건 — Wave 계획을 생성하지 않는다.")
        sys.exit(1)

    wave_ids = make_wave_ids(len(waves))

    write_task_dag(tasks, cycles, inferred_edges, order, waves, wave_ids)
    write_wave_plan(waves, wave_ids, tasks)
    write_wave_state(waves, wave_ids, tasks)
    rewrite_manifest_with_wave_id(waves, wave_ids)

    print(f"순환 의존성 수: {len(cycles)}")
    print(f"Wave 수: {len(waves)}")
    print("Wave별 Task 수:")
    for wid, wtasks in zip(wave_ids, waves):
        print(f"  {wid}: {len(wtasks)}개 — {wave_title(wtasks, tasks)}")
    print("Page Owner 위치:")
    wave_of = {tid: wid for wid, wtasks in zip(wave_ids, waves) for tid in wtasks}
    for owner in page_owners:
        print(f"  {owner}: {wave_of[owner]}")
    print("")
    print(f"작성됨: {DAG_OUT.relative_to(ROOT)}, {WAVE_PLAN_OUT.relative_to(ROOT)}, {WAVE_STATE_OUT.relative_to(ROOT)}, {MANIFEST_PATH.relative_to(ROOT)}(wave_id 열 추가)")
    print("")
    print("BUILD_WAVES_PASS")


if __name__ == "__main__":
    main()

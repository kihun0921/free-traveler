#!/usr/bin/env python3
"""Free Traveler — Screen Contract 검사 (scripts/check_screen_contract.py)

입력:
  - design-reference/SCREEN_ROUTE_CONTRACT.json  (Screen/Route 정본)
  - TASKS/TASK_MANIFEST.csv                       (Page Owner Task 계획)
  - src/app 디렉터리                              (mode=ci/release에서만 실제 파일 스캔)

실행 모드:
  --mode=plan     Page Owner Task와 경로 "계획"만 검사한다(실제 src/app 파일 스캔 없음).
  --mode=ci       plan 검사 + 실제 구현된 src/app/**/page.tsx와 공개 경로를 검사한다.
  --mode=release  ci 검사 + docs/preview-checks/SCR-001.md ~ SCR-005.md 존재 여부를 더한다.

고정 화면(정확히 5개, 이 순서·경로를 벗어나면 실패):
  SCR-001 `/`, SCR-002 `/about`, SCR-003 `/travel-tools`, SCR-004 `/mates`, SCR-005 `/account`

허용 기술 경로(사용자 화면 수에 포함하지 않는다):
  `/auth/callback`, `/api/**`, `not-found`(Next.js 특수 파일)

오류는 exit code 1로 종료하며, 각 오류에 파일·화면 ID·수정 힌트를 포함한다.
이 스크립트는 구현 코드를 작성하지 않으며 읽기·검사만 수행한다.
"""

from __future__ import annotations

import csv
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parents[1]
CONTRACT_PATH = ROOT / "design-reference" / "SCREEN_ROUTE_CONTRACT.json"
MANIFEST_PATH = ROOT / "TASKS" / "TASK_MANIFEST.csv"
APP_DIR = ROOT / "src" / "app"
PREVIEW_CHECKS_DIR = ROOT / "docs" / "preview-checks"

FIXED_SCREENS: dict[str, str] = {
    "SCR-001": "/",
    "SCR-002": "/about",
    "SCR-003": "/travel-tools",
    "SCR-004": "/mates",
    "SCR-005": "/account",
}

# 이 화면은 반드시 항공/숙소 여행 입력(travel-input)과 동행 작성(mate-write)
# 두 요구를 모두 포함해야 한다(원칙 9 — 세 탭 분리 조립).
SCR003_TRAVEL_INPUT_REQS = {f"REQ-FUNC-{n:03d}" for n in range(11, 27)}  # 011~026
SCR003_MATE_WRITE_REQS = {"REQ-FUNC-031", "REQ-FUNC-032", "REQ-FUNC-080"}
SCR003_TRAVEL_INPUT_COMPONENTS = {"COMP-SCR003-FLIGHT-FORM", "COMP-SCR003-HOTEL-FORM"}
SCR003_MATE_WRITE_COMPONENTS = {"COMP-SCR003-MATE-WRITE"}

# 여행지 상세 / 안전정보는 SCR-001 Drawer로만 구현한다(별도 Page 금지).
BANNED_NEW_PAGE_PREFIXES = ["destinations", "safety"]

VALID_MODES = ("plan", "ci", "release")


@dataclass
class Issue:
    check: str
    file: str
    screen_id: str
    message: str
    hint: str

    def render(self) -> str:
        return (
            f"[FAIL] {self.check} | file={self.file} | screen={self.screen_id}\n"
            f"       사유: {self.message}\n"
            f"       수정 힌트: {self.hint}"
        )


@dataclass
class Result:
    issues: list[Issue] = field(default_factory=list)
    passed: list[str] = field(default_factory=list)

    def fail(self, check: str, file: str, screen_id: str, message: str, hint: str) -> None:
        self.issues.append(Issue(check, file, screen_id, message, hint))

    def ok(self, check: str) -> None:
        self.passed.append(check)


def parse_mode(argv: list[str]) -> str:
    mode = None
    for arg in argv:
        if arg.startswith("--mode="):
            mode = arg.split("=", 1)[1].strip()
        elif arg == "--mode":
            idx = argv.index(arg)
            if idx + 1 < len(argv):
                mode = argv[idx + 1].strip()
    if mode is None:
        print("[FATAL] --mode=plan|ci|release 를 지정해야 한다. 예: python scripts/check_screen_contract.py --mode=plan")
        sys.exit(1)
    if mode not in VALID_MODES:
        print(f"[FATAL] 알 수 없는 mode: {mode!r} (plan|ci|release 중 하나)")
        sys.exit(1)
    return mode


def strip_backticks(raw: str) -> str:
    raw = raw.strip()
    if raw.startswith("`") and raw.endswith("`") and len(raw) >= 2:
        return raw[1:-1]
    return raw


def split_multi(raw: str) -> list[str]:
    raw = raw.strip()
    if raw in ("", "-"):
        return []
    return [x.strip() for x in re.split(r";\s*|,\s*", raw) if x.strip()]


def load_contract() -> dict:
    if not CONTRACT_PATH.exists():
        print(f"[FATAL] {CONTRACT_PATH} 없음.")
        sys.exit(1)
    import json

    try:
        return json.loads(CONTRACT_PATH.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        print(f"[FATAL] {CONTRACT_PATH} JSON 파싱 실패: {e}")
        sys.exit(1)


def load_manifest_rows() -> list[dict[str, str]]:
    if not MANIFEST_PATH.exists():
        print(f"[FATAL] {MANIFEST_PATH} 없음 — 먼저 scripts/audit_tasks.py를 실행한다.")
        sys.exit(1)
    with MANIFEST_PATH.open(encoding="utf-8", newline="") as f:
        return list(csv.DictReader(f))


# ---------------------------------------------------------------------------
# Check 1: 고정 화면 5개가 정확히 존재한다.
# ---------------------------------------------------------------------------
def check_fixed_screens(contract: dict, result: Result) -> dict[str, dict]:
    screens = {s["id"]: s for s in contract.get("screens", [])}
    check = "1.고정화면5개"

    if len(screens) != 5:
        result.fail(
            check,
            str(CONTRACT_PATH.relative_to(ROOT)),
            "-",
            f"Screen 수가 5개가 아님(실제 {len(screens)}개): {sorted(screens.keys())}",
            "SCREEN_ROUTE_CONTRACT.json의 screens 배열을 정확히 5개(SCR-001~005)로 되돌린다.",
        )
        return screens

    ok = True
    for sid, expected_route in FIXED_SCREENS.items():
        if sid not in screens:
            result.fail(check, str(CONTRACT_PATH.relative_to(ROOT)), sid,
                        f"{sid}가 SCREEN_ROUTE_CONTRACT.json에 없음",
                        f"{sid} 항목을 route={expected_route}로 추가한다.")
            ok = False
            continue
        actual_route = screens[sid].get("route")
        if actual_route != expected_route:
            result.fail(check, str(CONTRACT_PATH.relative_to(ROOT)), sid,
                        f"{sid}의 route가 {actual_route!r} — 고정값 {expected_route!r}과 다름",
                        f"{sid}.route를 {expected_route!r}로 수정한다.")
            ok = False
    extra = set(screens.keys()) - set(FIXED_SCREENS.keys())
    if extra:
        result.fail(check, str(CONTRACT_PATH.relative_to(ROOT)), ",".join(sorted(extra)),
                    f"고정 5개 화면 밖의 Screen ID 발견: {sorted(extra)}",
                    "고정 화면 목록(SCR-001~005) 밖의 Screen을 제거하거나 이 스크립트의 FIXED_SCREENS를 갱신할 근거를 문서화한다.")
        ok = False
    if ok:
        result.ok(check)
    return screens


# ---------------------------------------------------------------------------
# Check 2: 각 화면 Page Owner Task가 정확히 하나다.
# ---------------------------------------------------------------------------
def check_page_owners(manifest_rows: list[dict[str, str]], result: Result) -> dict[str, dict[str, str]]:
    check = "2.PageOwner1개"
    owners_by_screen: dict[str, list[dict[str, str]]] = {sid: [] for sid in FIXED_SCREENS}
    for row in manifest_rows:
        if row.get("category") != "PAGE_OWNER":
            continue
        screen = row.get("screen", "-")
        if screen in owners_by_screen:
            owners_by_screen[screen].append(row)
        else:
            result.fail(check, str(MANIFEST_PATH.relative_to(ROOT)), screen,
                        f"Task {row.get('task_id')}가 고정 화면 밖의 screen={screen!r}에 대한 PAGE_OWNER로 등록됨",
                        "TASK_MANIFEST.csv/00_TASK_LIST.md의 Screen 값을 SCR-001~005 중 하나로 고친다.")

    resolved: dict[str, dict[str, str]] = {}
    ok = True
    for sid, rows in owners_by_screen.items():
        if len(rows) == 0:
            result.fail(check, str(MANIFEST_PATH.relative_to(ROOT)), sid,
                        f"{sid}에 PAGE_OWNER Task가 없음",
                        f"{sid}용 PAGE-SCR{sid[-3:]} Task를 TASK_MANIFEST.csv/00_TASK_LIST.md에 추가한다.")
            ok = False
        elif len(rows) > 1:
            ids = [r.get("task_id") for r in rows]
            result.fail(check, str(MANIFEST_PATH.relative_to(ROOT)), sid,
                        f"{sid}에 PAGE_OWNER Task가 {len(rows)}개({ids}) — 정확히 1개여야 함",
                        "중복 Page Owner 중 하나만 남기고 나머지는 COMPONENT로 재분류하거나 제거한다.")
            ok = False
        else:
            resolved[sid] = rows[0]
    if ok:
        result.ok(check)
    return resolved


# ---------------------------------------------------------------------------
# Check 3: 기술 경로를 사용자 화면으로 세지 않는다.
# ---------------------------------------------------------------------------
def is_allowed_tech_path(route: str) -> bool:
    if route == "/auth/callback":
        return True
    if route == "/api" or route.startswith("/api/"):
        return True
    if route in ("not-found", "/not-found"):
        return True
    return False


def check_tech_paths_not_counted(contract: dict, manifest_rows: list[dict[str, str]], result: Result) -> None:
    check = "3.기술경로제외"
    ok = True

    # 3a. Contract의 techRoutes가 고정 5개 화면의 route와 겹치지 않는지.
    tech_routes = contract.get("techRoutes", [])
    fixed_routes = set(FIXED_SCREENS.values())
    overlap = [r for r in tech_routes if r in fixed_routes]
    if overlap:
        result.fail(check, str(CONTRACT_PATH.relative_to(ROOT)), "-",
                    f"techRoutes가 고정 화면 route와 겹침: {overlap}",
                    "SCREEN_ROUTE_CONTRACT.json의 techRoutes에서 고정 화면 route를 제거한다.")
        ok = False

    # 3b. Manifest의 PAGE_OWNER route가 허용 기술 경로 패턴에 해당하지 않는지
    #     (Page Owner는 사용자 화면이어야 하며 기술 경로일 수 없다).
    for row in manifest_rows:
        if row.get("category") != "PAGE_OWNER":
            continue
        route = strip_backticks(row.get("route", ""))
        if is_allowed_tech_path(route):
            result.fail(check, str(MANIFEST_PATH.relative_to(ROOT)), row.get("screen", "-"),
                        f"Task {row.get('task_id')}의 route={route!r}가 허용 기술 경로 패턴과 일치함",
                        "Page Owner Task의 route를 고정 5개 화면 경로 중 하나로 고친다.")
            ok = False
    if ok:
        result.ok(check)


def check_tech_paths_not_counted_fs(result: Result, app_pages: list[tuple[str, Path]]) -> None:
    """mode=ci/release: 실제 src/app 스캔 결과 중 허용 기술 경로는 화면 수 계산에서 제외되어야 한다.
    (이 함수 자체는 판정하지 않는다 — count_screen_pages()가 이미 필터링해서 넘겨준다.
    허용 기술 경로가 아닌데 5개 고정 화면도 아닌 경로가 있으면 check_ci_pages()가 별도로 잡는다.)"""
    return


# ---------------------------------------------------------------------------
# Check 4: 여행지 상세/안전정보를 새 Page로 만들지 않았는지.
# ---------------------------------------------------------------------------
def check_no_new_detail_pages_plan(manifest_rows: list[dict[str, str]], result: Result) -> None:
    check = "4.상세Page금지(계획)"
    ok = True
    for row in manifest_rows:
        route = strip_backticks(row.get("route", "")).lstrip("/")
        first_segment = route.split("/")[0] if route else ""
        if first_segment in BANNED_NEW_PAGE_PREFIXES:
            result.fail(check, str(MANIFEST_PATH.relative_to(ROOT)), row.get("screen", "-"),
                        f"Task {row.get('task_id')}가 금지된 별도 경로(/{first_segment}/...)를 route로 사용함",
                        "여행지 상세·안전정보는 SCR-001의 Drawer/Modal로만 구현한다(별도 Page/Route 생성 금지).")
            ok = False
    if ok:
        result.ok(check)


def check_no_new_detail_pages_fs(app_pages: list[tuple[str, Path]], result: Result) -> None:
    check = "4.상세Page금지(구현)"
    ok = True
    for route, path in app_pages:
        segment = route.lstrip("/").split("/")[0] if route.lstrip("/") else ""
        if segment in BANNED_NEW_PAGE_PREFIXES:
            result.fail(check, str(path.relative_to(ROOT)), "SCR-001",
                        f"금지된 별도 Page 발견: route={route!r}",
                        "이 파일을 삭제하고 여행지 상세·안전정보는 SCR-001의 Drawer/Modal(COMP-SCR001-DEST-DRAWER / COMP-SCR001-SAFETY-DRAWER)로만 구현한다.")
            ok = False
    if ok:
        result.ok(check)


# ---------------------------------------------------------------------------
# Check 5: SCR-003 Task가 여행 입력과 동행 작성 양쪽 요구를 포함한다.
# ---------------------------------------------------------------------------
def check_scr003_dual_requirements(page_owners: dict[str, dict[str, str]], result: Result) -> None:
    check = "5.SCR003양쪽요구"
    owner = page_owners.get("SCR-003")
    if owner is None:
        # Check 2가 이미 이 문제를 별도로 보고하므로 여기서는 조용히 스킵한다.
        return

    task_id = owner.get("task_id", "PAGE-SCR003")
    reqs = set(split_multi(owner.get("requirements", "")))
    deps = set(split_multi(owner.get("depends_on", "")))

    has_travel_input = bool(reqs & SCR003_TRAVEL_INPUT_REQS) or bool(deps & SCR003_TRAVEL_INPUT_COMPONENTS)
    has_mate_write = bool(reqs & SCR003_MATE_WRITE_REQS) or bool(deps & SCR003_MATE_WRITE_COMPONENTS)

    if not has_travel_input:
        result.fail(check, str(MANIFEST_PATH.relative_to(ROOT)), "SCR-003",
                    f"{task_id}의 requirements/depends_on에 항공·숙소 여행 입력 요구(REQ-FUNC-011~026 또는 FLIGHT/HOTEL-FORM Component)가 없음",
                    f"{task_id}의 depends_on에 COMP-SCR003-FLIGHT-FORM/COMP-SCR003-HOTEL-FORM을, requirements에 REQ-FUNC-011~026 중 해당 항목을 포함시킨다.")
    if not has_mate_write:
        result.fail(check, str(MANIFEST_PATH.relative_to(ROOT)), "SCR-003",
                    f"{task_id}의 requirements/depends_on에 동행 작성 요구(REQ-FUNC-031/032/080 또는 MATE-WRITE Component)가 없음",
                    f"{task_id}의 depends_on에 COMP-SCR003-MATE-WRITE를, requirements에 REQ-FUNC-031/032/080 중 해당 항목을 포함시킨다.")
    if has_travel_input and has_mate_write:
        result.ok(check)


# ---------------------------------------------------------------------------
# mode=ci/release 전용: 실제 src/app 스캔
# ---------------------------------------------------------------------------
def scan_app_pages(app_dir: Path) -> list[tuple[str, Path]]:
    """src/app 아래의 실제 page.tsx/page.ts 파일을 (route, path) 목록으로 반환한다.
    Route Group `(group)`은 URL 세그먼트가 아니므로 제거한다."""
    if not app_dir.exists():
        return []
    pages: list[tuple[str, Path]] = []
    for path in app_dir.rglob("page.tsx"):
        pages.append((_route_for(app_dir, path), path))
    for path in app_dir.rglob("page.ts"):
        if path.with_suffix(".tsx") in {p for _, p in pages}:
            continue
        pages.append((_route_for(app_dir, path), path))
    return pages


def _route_for(app_dir: Path, page_path: Path) -> str:
    rel = page_path.relative_to(app_dir).parent
    segments = [seg for seg in rel.parts if not (seg.startswith("(") and seg.endswith(")"))]
    if not segments:
        return "/"
    return "/" + "/".join(segments)


def check_ci_pages(app_pages: list[tuple[str, Path]], result: Result) -> None:
    check = "3.실제경로검사(ci)"
    found_routes = {route: path for route, path in app_pages}
    ok = True

    for sid, expected_route in FIXED_SCREENS.items():
        if expected_route not in found_routes:
            result.fail(check, str((APP_DIR / "page.tsx").relative_to(ROOT)), sid,
                        f"{sid}({expected_route})의 실제 page.tsx가 아직 구현되지 않음",
                        f"design-reference/SCREEN_ROUTE_CONTRACT.json의 filePath에 명시된 경로에 {sid} Page Owner를 구현한다.")
            ok = False

    for route, path in app_pages:
        if route in FIXED_SCREENS.values():
            continue
        if is_allowed_tech_path(route):
            continue
        segment = route.lstrip("/").split("/")[0] if route.lstrip("/") else ""
        if segment in BANNED_NEW_PAGE_PREFIXES:
            continue  # check_no_new_detail_pages_fs가 별도로 보고한다.
        result.fail(check, str(path.relative_to(ROOT)), "-",
                    f"고정 5개 화면·허용 기술 경로 어디에도 속하지 않는 예상치 못한 Page 발견: route={route!r}",
                    "이 Page가 실제로 필요하면 design-reference/SCREEN_ROUTE_CONTRACT.json에 정식 Screen 또는 techRoutes로 등록하고, 아니면 삭제한다.")
        ok = False
    if ok:
        result.ok(check)


# ---------------------------------------------------------------------------
# Check 6 (mode=release): Preview Checkpoint 문서 존재.
# ---------------------------------------------------------------------------
def check_preview_checkpoints(result: Result) -> None:
    check = "6.PreviewCheckpoint"
    ok = True
    for sid in FIXED_SCREENS:
        doc = PREVIEW_CHECKS_DIR / f"{sid}.md"
        if not doc.exists():
            result.fail(check, str(doc.relative_to(ROOT)), sid,
                        f"{sid}의 Preview Checkpoint 문서가 없음",
                        f"사람이 Vercel Preview에서 {sid}를 확인한 뒤 {doc.relative_to(ROOT)}를 작성한다(CONFIRMED/REJECTED와 확인 시각 기록).")
            ok = False
    if ok:
        result.ok(check)


def main() -> None:
    mode = parse_mode(sys.argv[1:])

    contract = load_contract()
    manifest_rows = load_manifest_rows()

    result = Result()

    screens = check_fixed_screens(contract, result)
    page_owners = check_page_owners(manifest_rows, result)
    check_tech_paths_not_counted(contract, manifest_rows, result)
    check_no_new_detail_pages_plan(manifest_rows, result)
    check_scr003_dual_requirements(page_owners, result)

    app_pages: list[tuple[str, Path]] = []
    if mode in ("ci", "release"):
        app_pages = scan_app_pages(APP_DIR)
        check_ci_pages(app_pages, result)
        check_no_new_detail_pages_fs(app_pages, result)

    if mode == "release":
        check_preview_checkpoints(result)

    print(f"=== Screen Contract 검사 (mode={mode}) ===")
    for name in result.passed:
        print(f"[OK] {name}")
    for issue in result.issues:
        print(issue.render())

    total = len(result.passed) + len({i.check for i in result.issues})
    if result.issues:
        fail_checks = sorted({i.check for i in result.issues})
        print("")
        print(f"SCREEN_CONTRACT_FAIL (mode={mode}) — 실패 {len(result.issues)}건, 실패한 검사: {fail_checks}")
        sys.exit(1)

    print("")
    print(f"SCREEN_CONTRACT_PASS (mode={mode}) — {total}/{total} checks")


if __name__ == "__main__":
    main()

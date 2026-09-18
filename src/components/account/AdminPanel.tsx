"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import { showToast } from "@/components/common/Toast";

type ReportStatus = "OPEN" | "RESOLVED" | "DISMISSED";

interface Report {
  id: string;
  reporter_id: string;
  target_type: string;
  target_id: string;
  reason: string;
  status: ReportStatus;
  created_at: string;
  updated_at: string;
}

interface OutboundSettings {
  flight_outbound_url: string;
  hotel_outbound_url: string;
}

const STATUS_LABEL: Record<ReportStatus, string> = {
  OPEN: "처리 대기",
  RESOLVED: "처리 완료",
  DISMISSED: "반려",
};

function StatusBadge({ status }: { status: ReportStatus }) {
  const styleByStatus: Record<ReportStatus, string> = {
    OPEN: "bg-[#FEF7EC] text-[#B8720A] border border-[#FCE4C0]",
    RESOLVED: "bg-[#F0F9F5] text-[#137A54] border border-transparent",
    DISMISSED: "bg-[#EEEEF0] text-[#6B6B72] border border-transparent",
  };
  return (
    <span
      className={`inline-flex items-center rounded-[4px] px-2 py-0.5 text-xs font-medium ${styleByStatus[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

function isValidHttpsUrl(value: string): boolean {
  if (!value) return true;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

export default function AdminPanel() {
  const [authState, setAuthState] = useState<"checking" | "denied" | "granted">("checking");

  const [reports, setReports] = useState<Report[]>([]);
  const [statusFilter, setStatusFilter] = useState<"ALL" | ReportStatus>("ALL");
  const [reportsLoading, setReportsLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [settings, setSettings] = useState<OutboundSettings>({
    flight_outbound_url: "",
    hotel_outbound_url: "",
  });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsErrors, setSettingsErrors] = useState<Partial<OutboundSettings>>({});

  async function loadReports(filter: "ALL" | ReportStatus) {
    setReportsLoading(true);
    try {
      const query = filter === "ALL" ? "" : `?status=${filter}`;
      const res = await fetch(`/api/admin/reports${query}`);
      if (res.status === 401 || res.status === 403) {
        setAuthState("denied");
        return;
      }
      if (!res.ok) {
        showToast("신고 목록을 불러오지 못했습니다.", "critical");
        return;
      }
      const data: Report[] = await res.json();
      setReports(data);
      setAuthState("granted");
    } catch {
      showToast("신고 목록을 불러오지 못했습니다.", "critical");
    } finally {
      setReportsLoading(false);
    }
  }

  async function loadSettings() {
    setSettingsLoading(true);
    try {
      const res = await fetch("/api/admin/settings/outbound");
      if (res.status === 401 || res.status === 403) {
        setAuthState("denied");
        return;
      }
      if (!res.ok) return;
      const data: OutboundSettings = await res.json();
      setSettings({
        flight_outbound_url: data.flight_outbound_url ?? "",
        hotel_outbound_url: data.hotel_outbound_url ?? "",
      });
    } finally {
      setSettingsLoading(false);
    }
  }

  useEffect(() => {
    loadReports("ALL");
    loadSettings();
  }, []);

  useEffect(() => {
    if (authState !== "granted") return;
    loadReports(statusFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  async function handleStatusChange(reportId: string, nextStatus: ReportStatus) {
    setUpdatingId(reportId);
    try {
      const res = await fetch(`/api/admin/reports?id=${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.status === 401 || res.status === 403) {
        setAuthState("denied");
        return;
      }
      if (!res.ok) {
        showToast("신고 상태 변경에 실패했습니다.", "critical");
        return;
      }
      const updated: Report = await res.json();
      setReports((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      showToast("신고 상태가 변경되었습니다.", "success");
    } catch {
      showToast("신고 상태 변경에 실패했습니다.", "critical");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleSettingsSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errors: Partial<OutboundSettings> = {};
    if (!isValidHttpsUrl(settings.flight_outbound_url)) {
      errors.flight_outbound_url = "https:// 로 시작하는 URL만 저장할 수 있습니다.";
    }
    if (!isValidHttpsUrl(settings.hotel_outbound_url)) {
      errors.hotel_outbound_url = "https:// 로 시작하는 URL만 저장할 수 있습니다.";
    }
    setSettingsErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSettingsSaving(true);
    try {
      const res = await fetch("/api/admin/settings/outbound", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.status === 401 || res.status === 403) {
        setAuthState("denied");
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        showToast(body?.error ?? "URL 설정 저장에 실패했습니다.", "critical");
        return;
      }
      showToast("외부 URL 설정이 저장되었습니다.", "success");
    } catch {
      showToast("URL 설정 저장에 실패했습니다.", "critical");
    } finally {
      setSettingsSaving(false);
    }
  }

  if (authState === "denied") {
    return null;
  }

  return (
    <section className="space-y-6" aria-label="간단 관리자">
      <div>
        <h2 className="text-lg font-semibold text-[#24242A]">간단 관리자</h2>
        <p className="mt-1 text-sm text-[#45454C]">
          신고 처리 상태를 관리하고, 항공·숙소 조회 시 이동할 외부 URL을 설정합니다.
        </p>
      </div>

      <div className="rounded-[12px] border border-[#EEEEF0] bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-base font-semibold text-[#24242A]">신고 목록</h3>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "ALL" | ReportStatus)}
            className="rounded-[8px] border border-[#E5E5EA] bg-white px-3 py-2 text-sm text-[#24242A] focus:border-[#24242A] focus:outline-none"
            aria-label="신고 상태 필터"
          >
            <option value="ALL">전체</option>
            <option value="OPEN">처리 대기</option>
            <option value="RESOLVED">처리 완료</option>
            <option value="DISMISSED">반려</option>
          </select>
        </div>

        {reportsLoading ? (
          <p className="mt-4 text-sm text-[#6B6B72]">불러오는 중...</p>
        ) : reports.length === 0 ? (
          <div className="mt-4 rounded-[12px] border border-[#EEEEF0] bg-[#FAFAFA] p-6 text-center">
            <p className="text-sm text-[#45454C]">아직 접수된 신고가 없습니다.</p>
            <p className="mt-1 text-sm text-[#6B6B72]">
              신고가 접수되면 이 목록에서 상태(처리 대기/처리 완료/반려)를 확인하고 변경할 수 있습니다.
            </p>
            <button
              type="button"
              onClick={() => loadReports(statusFilter)}
              className="mt-3 inline-flex items-center justify-center rounded-[8px] border border-[#E5E5EA] bg-white px-4 py-2 text-sm font-medium text-[#24242A] hover:bg-[#FAFAFA]"
            >
              목록 새로고침
            </button>
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#EEEEF0] text-[#6B6B72]">
                  <th className="py-2 pr-4 font-medium">대상</th>
                  <th className="py-2 pr-4 font-medium">신고 사유</th>
                  <th className="py-2 pr-4 font-medium">접수일</th>
                  <th className="py-2 pr-4 font-medium">상태</th>
                  <th className="py-2 pr-4 font-medium">상태 변경</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id} className="border-b border-[#EEEEF0] last:border-0">
                    <td className="py-3 pr-4 text-[#24242A]">
                      {report.target_type} · {report.target_id.slice(0, 8)}
                    </td>
                    <td className="py-3 pr-4 text-[#45454C]">{report.reason}</td>
                    <td className="py-3 pr-4 text-[#6B6B72]">
                      {new Date(report.created_at).toLocaleDateString("ko-KR")}
                    </td>
                    <td className="py-3 pr-4">
                      <StatusBadge status={report.status} />
                    </td>
                    <td className="py-3 pr-4">
                      <select
                        value={report.status}
                        disabled={updatingId === report.id}
                        onChange={(e) =>
                          handleStatusChange(report.id, e.target.value as ReportStatus)
                        }
                        className="rounded-[8px] border border-[#E5E5EA] bg-white px-2 py-1.5 text-sm text-[#24242A] focus:border-[#24242A] focus:outline-none disabled:bg-[#EEEEF0]"
                        aria-label={`${report.id} 신고 상태 변경`}
                      >
                        <option value="OPEN">처리 대기</option>
                        <option value="RESOLVED">처리 완료</option>
                        <option value="DISMISSED">반려</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="rounded-[12px] border border-[#EEEEF0] bg-white p-6">
        <h3 className="text-base font-semibold text-[#24242A]">외부 URL 설정</h3>
        <p className="mt-1 text-sm text-[#45454C]">
          항공·숙소 조회 시 이동할 외부 사이트 URL입니다. HTTPS 주소만 저장됩니다.
        </p>

        <form onSubmit={handleSettingsSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="flight-outbound-url" className="block text-sm font-medium text-[#24242A]">
              항공 외부 URL
            </label>
            <input
              id="flight-outbound-url"
              type="text"
              inputMode="url"
              placeholder="https://example.com/flights"
              value={settings.flight_outbound_url}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, flight_outbound_url: e.target.value }))
              }
              disabled={settingsLoading}
              className="mt-1 block w-full rounded-[8px] border border-[#E5E5EA] bg-white px-3 py-3 text-sm text-[#24242A] focus:border-[1.5px] focus:border-[#24242A] focus:outline-none"
            />
            {settingsErrors.flight_outbound_url && (
              <p className="mt-1 text-sm text-[#C13515]">{settingsErrors.flight_outbound_url}</p>
            )}
          </div>

          <div>
            <label htmlFor="hotel-outbound-url" className="block text-sm font-medium text-[#24242A]">
              숙소 외부 URL
            </label>
            <input
              id="hotel-outbound-url"
              type="text"
              inputMode="url"
              placeholder="https://example.com/hotels"
              value={settings.hotel_outbound_url}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, hotel_outbound_url: e.target.value }))
              }
              disabled={settingsLoading}
              className="mt-1 block w-full rounded-[8px] border border-[#E5E5EA] bg-white px-3 py-3 text-sm text-[#24242A] focus:border-[1.5px] focus:border-[#24242A] focus:outline-none"
            />
            {settingsErrors.hotel_outbound_url && (
              <p className="mt-1 text-sm text-[#C13515]">{settingsErrors.hotel_outbound_url}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={settingsSaving || settingsLoading}
            className="inline-flex h-12 items-center justify-center rounded-[8px] bg-[#FF6B4A] px-6 text-sm font-semibold text-white hover:bg-[#E85837] disabled:bg-[#FFD5C7]"
          >
            {settingsSaving ? "저장 중..." : "URL 설정 저장"}
          </button>
        </form>
      </div>
    </section>
  );
}

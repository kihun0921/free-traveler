"use client";

import { useEffect, useState } from "react";
import { createRoot, type Root } from "react-dom/client";

type ToastVariant = "success" | "critical" | "info";

interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
}

const AUTO_DISMISS_MS = 4000;

let toasts: ToastItem[] = [];
let listeners: Array<() => void> = [];
let nextId = 1;
let viewportRoot: Root | null = null;

function notifyListeners(): void {
  listeners.forEach((listener) => listener());
}

const VARIANT_STYLES: Record<ToastVariant, string> = {
  success: "border border-[#137A54]/20 bg-[#F0F9F5] text-[#137A54]",
  critical: "border border-[#F8CCC6] bg-[#FDF2F0] text-[#C13515]",
  info: "border border-transparent bg-[#24242A] text-white",
};

function useToastItems(): ToastItem[] {
  const [items, setItems] = useState(toasts);

  useEffect(() => {
    const listener = () => setItems(toasts);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((existing) => existing !== listener);
    };
  }, []);

  return items;
}

function ToastViewport() {
  const items = useToastItems();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 md:inset-x-auto md:right-6 md:items-end">
      {items.map((toast) => (
        <div
          key={toast.id}
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className={`pointer-events-auto max-w-[calc(100vw-32px)] rounded-[8px] px-4 py-3 text-[14px] leading-[1.57] shadow-[0_1px_2px_rgba(36,36,42,.04),0_8px_24px_-4px_rgba(36,36,42,.06)] md:max-w-[360px] ${VARIANT_STYLES[toast.variant]}`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}

function ensureViewportMounted(): void {
  if (typeof document === "undefined" || viewportRoot) return;

  const container = document.createElement("div");
  container.setAttribute("id", "free-traveler-toast-viewport");
  document.body.appendChild(container);
  viewportRoot = createRoot(container);
  viewportRoot.render(<ToastViewport />);
}

/**
 * 참가요청 접수, 신고 접수, 외부 이동 실패 등 인앱 알림에 사용한다.
 * 실제 이메일 발송 없이 이 Toast로만 결과를 안내한다. 4초 후 자동 소멸한다.
 */
export function showToast(
  message: string,
  variant: ToastVariant = "info",
): void {
  if (typeof window === "undefined") return;

  ensureViewportMounted();

  const id = nextId++;
  toasts = [...toasts, { id, message, variant }];
  notifyListeners();

  window.setTimeout(() => {
    toasts = toasts.filter((toast) => toast.id !== id);
    notifyListeners();
  }, AUTO_DISMISS_MS);
}

import { useState, useCallback } from "react";

export const SERVICE_COLORS: Record<string, string> = {
  A: "hsl(215 80% 52%)",
  B: "hsl(145 63% 32%)",
  C: "hsl(280 60% 52%)",
  D: "hsl(38 92% 50%)",
  E: "hsl(170 60% 38%)",
  F: "hsl(215 15% 50%)",
};

export const SERVICE_NAMES: Record<string, string> = {
  A: "Кредиты и ипотека",
  B: "Вклады и накопления",
  C: "Карты и счета",
  D: "Переводы и платежи",
  E: "Страхование",
  F: "Прочие операции",
};

export type QueueEntry = {
  number: string;
  window: number | null;
  service: string;
  status: "waiting" | "called" | "serving" | "done";
  waitMin: number;
  calledAt?: string;
};

export type WindowInfo = {
  id: number;
  operator: string;
  open: boolean;
};

export const WINDOWS: WindowInfo[] = [
  { id: 1, operator: "Смирнова О.Р.", open: true },
  { id: 2, operator: "Кузнецов А.В.", open: true },
  { id: 3, operator: "Белова Т.И.", open: false },
  { id: 4, operator: "Орлов М.С.", open: true },
  { id: 5, operator: "Тихонова Д.Н.", open: true },
];

const SERVICES = ["A", "B", "C", "D", "E", "F"];

const generateQueue = (): QueueEntry[] => {
  const entries: QueueEntry[] = [];
  for (let i = 0; i < 16; i++) {
    const svc = SERVICES[Math.floor(Math.random() * SERVICES.length)];
    const num = Math.floor(Math.random() * 50) + 1;
    entries.push({
      number: `${svc}${String(num).padStart(3, "0")}`,
      window: null,
      service: svc,
      status: "waiting",
      waitMin: (i + 1) * 4,
    });
  }
  return entries;
};

// Singleton state — shared across components in same session
let _queue: QueueEntry[] = generateQueue();
let _windows: WindowInfo[] = WINDOWS.map((w) => ({ ...w }));
let _current: { number: string; window: number } | null = null;
const _listeners: Array<() => void> = [];

const notify = () => _listeners.forEach((fn) => fn());

export const queueStore = {
  getQueue: () => _queue,
  getWindows: () => _windows,
  getCurrent: () => _current,

  callNext: (windowId: number) => {
    const waiting = _queue.filter((q) => q.status === "waiting");
    if (!waiting.length) return null;
    const next = waiting[0];
    const now = new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
    _queue = _queue.map((q) =>
      q.number === next.number
        ? { ...q, status: "called", window: windowId, calledAt: now }
        : q
    );
    _current = { number: next.number, window: windowId };
    notify();
    return next;
  },

  finishCurrent: (windowId: number) => {
    _queue = _queue.map((q) =>
      q.window === windowId && (q.status === "called" || q.status === "serving")
        ? { ...q, status: "done" }
        : q
    );
    if (_current?.window === windowId) _current = null;
    notify();
  },

  toggleWindow: (windowId: number) => {
    _windows = _windows.map((w) =>
      w.id === windowId ? { ...w, open: !w.open } : w
    );
    notify();
  },

  subscribe: (fn: () => void) => {
    _listeners.push(fn);
    return () => {
      const idx = _listeners.indexOf(fn);
      if (idx > -1) _listeners.splice(idx, 1);
    };
  },
};

export function useQueueStore() {
  const [, rerender] = useState(0);

  const subscribe = useCallback(() => {
    return queueStore.subscribe(() => rerender((n) => n + 1));
  }, []);

  useState(() => {
    const unsub = subscribe();
    return unsub;
  });

  return {
    queue: queueStore.getQueue(),
    windows: queueStore.getWindows(),
    current: queueStore.getCurrent(),
    callNext: queueStore.callNext,
    finishCurrent: queueStore.finishCurrent,
    toggleWindow: queueStore.toggleWindow,
  };
}

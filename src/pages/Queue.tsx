import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";

const SERVICE_COLORS: Record<string, string> = {
  A: "hsl(215 80% 52%)",
  B: "hsl(145 63% 32%)",
  C: "hsl(280 60% 52%)",
  D: "hsl(38 92% 50%)",
  E: "hsl(170 60% 38%)",
  F: "hsl(215 15% 50%)",
};

const SERVICE_NAMES: Record<string, string> = {
  A: "Кредиты",
  B: "Вклады",
  C: "Карты",
  D: "Переводы",
  E: "Страхование",
  F: "Прочее",
};

type QueueEntry = {
  number: string;
  window: number;
  service: string;
  status: "waiting" | "called" | "serving";
  waitMin: number;
};

const generateQueue = (): QueueEntry[] => {
  const entries: QueueEntry[] = [];
  const services = ["A", "B", "C", "D", "E", "F"];
  for (let i = 0; i < 14; i++) {
    const svc = services[Math.floor(Math.random() * services.length)];
    const num = Math.floor(Math.random() * 50) + 1;
    entries.push({
      number: `${svc}${String(num).padStart(3, "0")}`,
      window: Math.floor(Math.random() * 5) + 1,
      service: svc,
      status: i < 2 ? "called" : i < 5 ? "serving" : "waiting",
      waitMin: (i + 1) * 4,
    });
  }
  return entries;
};

const windows = [
  { id: 1, operator: "Смирнова О.Р.", open: true },
  { id: 2, operator: "Кузнецов А.В.", open: true },
  { id: 3, operator: "Белова Т.И.", open: false },
  { id: 4, operator: "Орлов М.С.", open: true },
  { id: 5, operator: "Тихонова Д.Н.", open: true },
];

export default function Queue() {
  const [queue, setQueue] = useState<QueueEntry[]>(generateQueue);
  const [current, setCurrent] = useState<{ number: string; window: number } | null>(null);
  const [tick, setTick] = useState(0);
  const [flash, setFlash] = useState(false);

  // Автообновление очереди каждые 8 секунд
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const callNext = useCallback(() => {
    const waiting = queue.filter((q) => q.status === "waiting");
    if (!waiting.length) return;
    const next = waiting[0];
    const win = windows.filter((w) => w.open)[Math.floor(Math.random() * 3)];
    setCurrent({ number: next.number, window: win.id });
    setFlash(true);
    setTimeout(() => setFlash(false), 1500);
    setQueue((prev) =>
      prev.map((q) =>
        q.number === next.number
          ? { ...q, status: "called", window: win.id }
          : q
      )
    );
  }, [queue]);

  const waiting = queue.filter((q) => q.status === "waiting");
  const serving = queue.filter((q) => q.status === "called" || q.status === "serving");

  const now = new Date().toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="space-y-5 animate-slide-up">
      {/* Current call — big board */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "hsl(var(--sidebar-background))",
          border: "1px solid hsl(var(--sidebar-border))",
        }}
      >
        <div className="px-6 py-4 flex items-center justify-between border-b border-sidebar-border/40">
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: "hsl(145 63% 42%)" }}
            />
            <span className="text-white/70 text-sm font-medium">ТАБЛО ОЧЕРЕДИ</span>
          </div>
          <div className="flex items-center gap-3">
            <span
              className="font-mono text-sm"
              style={{ color: "hsl(var(--sidebar-foreground))" }}
            >
              {now} · обновлено {tick > 0 ? `${tick * 8}с назад` : "только что"}
            </span>
            <button
              onClick={callNext}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: "hsl(145 63% 32%)",
                color: "#fff",
              }}
            >
              <Icon name="ChevronRight" size={13} />
              Вызвать следующего
            </button>
          </div>
        </div>

        {current ? (
          <div
            className="flex items-center justify-center gap-16 py-10 px-8 transition-all"
            style={{
              background: flash ? "hsl(145 63% 18%)" : "transparent",
              transition: "background 0.4s ease",
            }}
          >
            <div className="text-center">
              <div
                className="text-xs uppercase tracking-widest mb-2 font-medium"
                style={{ color: "hsl(var(--sidebar-foreground))" }}
              >
                Вызывается
              </div>
              <div
                className="font-black leading-none"
                style={{
                  fontSize: 88,
                  color: SERVICE_COLORS[current.number[0]] || "hsl(145 63% 42%)",
                  fontFamily: "'Golos Text', sans-serif",
                  textShadow: `0 0 40px ${SERVICE_COLORS[current.number[0]]}44`,
                }}
              >
                {current.number}
              </div>
              <div
                className="text-sm mt-1"
                style={{ color: "hsl(var(--sidebar-foreground))" }}
              >
                {SERVICE_NAMES[current.number[0]]}
              </div>
            </div>

            <div
              className="w-px self-stretch"
              style={{ background: "hsl(var(--sidebar-border))" }}
            />

            <div className="text-center">
              <div
                className="text-xs uppercase tracking-widest mb-2 font-medium"
                style={{ color: "hsl(var(--sidebar-foreground))" }}
              >
                Окно
              </div>
              <div
                className="font-black leading-none"
                style={{
                  fontSize: 88,
                  color: "hsl(var(--sidebar-primary))",
                  fontFamily: "'Golos Text', sans-serif",
                }}
              >
                {current.window}
              </div>
              <div
                className="text-sm mt-1"
                style={{ color: "hsl(var(--sidebar-foreground))" }}
              >
                {windows.find((w) => w.id === current.window)?.operator}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-14">
            <div className="text-center">
              <Icon
                name="Monitor"
                size={36}
                style={{ color: "hsl(var(--sidebar-foreground))", margin: "0 auto 12px" }}
              />
              <p style={{ color: "hsl(var(--sidebar-foreground))" }} className="text-sm">
                Нажмите «Вызвать следующего» для начала
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Windows status */}
        <div
          className="rounded-xl overflow-hidden col-span-1"
          style={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
          }}
        >
          <div
            className="px-4 py-3 border-b flex items-center gap-2"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            <Icon name="LayoutGrid" size={14} style={{ color: "hsl(var(--primary))" }} />
            <span
              className="text-sm font-semibold"
              style={{ color: "hsl(var(--foreground))" }}
            >
              Окна обслуживания
            </span>
          </div>
          <div className="p-4 space-y-2">
            {windows.map((win) => {
              const serving = queue.find(
                (q) => q.window === win.id && (q.status === "called" || q.status === "serving")
              );
              return (
                <div
                  key={win.id}
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{
                    background: win.open ? "hsl(var(--background))" : "hsl(var(--muted))",
                    border: `1px solid ${win.open ? "hsl(var(--border))" : "transparent"}`,
                    opacity: win.open ? 1 : 0.6,
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="flex items-center justify-center rounded-lg font-bold text-sm w-8 h-8"
                      style={{
                        background: win.open ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                        color: "#fff",
                      }}
                    >
                      {win.id}
                    </div>
                    <div>
                      <div
                        className="text-xs font-medium"
                        style={{ color: "hsl(var(--foreground))" }}
                      >
                        {win.operator.split(" ")[0]}
                      </div>
                      <div
                        className="text-xs"
                        style={{ color: "hsl(var(--muted-foreground))" }}
                      >
                        {serving ? serving.number : win.open ? "Ожидает" : "Закрыто"}
                      </div>
                    </div>
                  </div>
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: win.open
                        ? serving
                          ? "hsl(38 92% 50%)"
                          : "hsl(145 63% 42%)"
                        : "hsl(var(--muted-foreground))",
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Waiting list */}
        <div
          className="rounded-xl overflow-hidden col-span-2"
          style={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
          }}
        >
          <div
            className="px-4 py-3 border-b flex items-center justify-between"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            <div className="flex items-center gap-2">
              <Icon name="Users" size={14} style={{ color: "hsl(var(--primary))" }} />
              <span
                className="text-sm font-semibold"
                style={{ color: "hsl(var(--foreground))" }}
              >
                Очередь ожидания
              </span>
            </div>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{
                background: "hsl(var(--accent))",
                color: "hsl(var(--accent-foreground))",
              }}
            >
              {waiting.length} чел.
            </span>
          </div>

          <div className="divide-y" style={{ maxHeight: 320, overflowY: "auto" }}>
            {/* Served / being called */}
            {serving.slice(0, 3).map((entry) => (
              <div
                key={entry.number}
                className="flex items-center gap-3 px-4 py-3"
                style={{ background: "hsl(145 45% 96%)" }}
              >
                <span
                  className="font-bold text-sm w-16 font-mono"
                  style={{ color: SERVICE_COLORS[entry.service] }}
                >
                  {entry.number}
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{
                    background: "hsl(145 45% 86%)",
                    color: "hsl(145 63% 28%)",
                  }}
                >
                  Вызван → окно {entry.window}
                </span>
                <span
                  className="text-xs ml-auto"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  {SERVICE_NAMES[entry.service]}
                </span>
              </div>
            ))}

            {/* Waiting */}
            {waiting.map((entry, i) => (
              <div
                key={entry.number}
                className="flex items-center gap-3 px-4 py-3 transition-colors"
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.background = "hsl(var(--muted))")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.background = "transparent")
                }
              >
                <span
                  className="text-xs w-5 text-right"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  {i + 1}
                </span>
                <span
                  className="font-bold text-sm w-16 font-mono"
                  style={{ color: SERVICE_COLORS[entry.service] }}
                >
                  {entry.number}
                </span>
                <span
                  className="text-xs flex-1"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  {SERVICE_NAMES[entry.service]}
                </span>
                <span
                  className="text-xs"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  ~{entry.waitMin} мин
                </span>
              </div>
            ))}

            {waiting.length === 0 && (
              <div className="flex items-center justify-center py-10">
                <div className="text-center">
                  <Icon
                    name="CheckCircle2"
                    size={28}
                    style={{ color: "hsl(145 63% 42%)", margin: "0 auto 8px" }}
                  />
                  <p
                    className="text-sm font-medium"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    Очередь пуста
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

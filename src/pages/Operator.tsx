import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { useQueueStore, SERVICE_COLORS, SERVICE_NAMES } from "@/hooks/useQueueStore";
import { playCallSound, playDoneSound } from "@/hooks/useQueueSound";

const MY_WINDOW_ID = 2; // Окно текущего оператора (Кузнецов А.В.)

export default function Operator() {
  const { queue, windows, current, callNext, finishCurrent, toggleWindow } =
    useQueueStore();

  const [flash, setFlash] = useState(false);
  const [lastCalled, setLastCalled] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const myWindow = windows.find((w) => w.id === MY_WINDOW_ID)!;
  const myClient = queue.find(
    (q) =>
      q.window === MY_WINDOW_ID &&
      (q.status === "called" || q.status === "serving")
  );
  const waiting = queue.filter((q) => q.status === "waiting");
  const doneToday = queue.filter((q) => q.status === "done").length;

  // Таймер обслуживания
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timerActive) {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const handleCallNext = () => {
    const entry = callNext(MY_WINDOW_ID);
    if (entry) {
      setLastCalled(entry.number);
      setFlash(true);
      setTimer(0);
      setTimerActive(true);
      setTimeout(() => setFlash(false), 1200);
      if (soundEnabled) playCallSound();
    }
  };

  const handleFinish = () => {
    finishCurrent(MY_WINDOW_ID);
    setLastCalled(null);
    setTimerActive(false);
    setTimer(0);
    if (soundEnabled) playDoneSound();
  };

  const formatTimer = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  return (
    <div className="max-w-4xl space-y-5 animate-slide-up">
      {/* Header — window status */}
      <div
        className="rounded-xl px-5 py-4 flex items-center justify-between"
        style={{
          background: myWindow.open ? "hsl(var(--sidebar-background))" : "hsl(var(--muted))",
          border: `1px solid ${myWindow.open ? "hsl(var(--sidebar-border))" : "hsl(var(--border))"}`,
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className="flex items-center justify-center rounded-xl font-black text-2xl"
            style={{
              width: 56,
              height: 56,
              background: myWindow.open ? "hsl(145 63% 32%)" : "hsl(var(--muted-foreground))",
              color: "#fff",
            }}
          >
            {MY_WINDOW_ID}
          </div>
          <div>
            <div
              className="font-semibold"
              style={{ color: myWindow.open ? "#fff" : "hsl(var(--foreground))" }}
            >
              Окно {MY_WINDOW_ID} — {myWindow.operator}
            </div>
            <div
              className="text-sm mt-0.5 flex items-center gap-1.5"
              style={{ color: myWindow.open ? "hsl(145 63% 62%)" : "hsl(var(--muted-foreground))" }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: myWindow.open ? "hsl(145 63% 52%)" : "hsl(var(--muted-foreground))",
                  display: "inline-block",
                }}
              />
              {myWindow.open ? "Окно открыто · Принимает клиентов" : "Окно закрыто"}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled((s) => !s)}
            title={soundEnabled ? "Звук включён" : "Звук выключен"}
            className="flex items-center justify-center w-9 h-9 rounded-lg transition-all"
            style={{
              background: soundEnabled
                ? "hsl(145 63% 24%)"
                : "hsl(var(--sidebar-accent))",
              color: soundEnabled ? "hsl(145 63% 62%)" : "hsl(var(--sidebar-foreground))",
              border: `1px solid ${soundEnabled ? "hsl(145 63% 32%)" : "hsl(var(--sidebar-border))"}`,
            }}
          >
            <Icon name={soundEnabled ? "Volume2" : "VolumeX"} size={15} />
          </button>
          <button
            onClick={() => toggleWindow(MY_WINDOW_ID)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              background: myWindow.open ? "hsl(0 72% 45%)" : "hsl(145 63% 32%)",
              color: "#fff",
            }}
          >
            <Icon name={myWindow.open ? "DoorClosed" : "DoorOpen"} size={15} />
            {myWindow.open ? "Закрыть окно" : "Открыть окно"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Call panel */}
        <div className="col-span-2 space-y-4">
          {/* Current client */}
          <div
            className="rounded-xl overflow-hidden transition-all"
            style={{
              background: flash ? "hsl(145 63% 14%)" : "hsl(var(--card))",
              border: `2px solid ${myClient ? "hsl(145 63% 32%)" : "hsl(var(--border))"}`,
              transition: "background 0.5s ease, border-color 0.3s ease",
            }}
          >
            <div
              className="px-5 py-3 border-b flex items-center justify-between"
              style={{ borderColor: myClient ? "hsl(145 63% 28%)" : "hsl(var(--border))" }}
            >
              <span
                className="text-sm font-semibold"
                style={{ color: myClient ? "hsl(145 63% 62%)" : "hsl(var(--muted-foreground))" }}
              >
                {myClient ? "Текущий клиент" : "Нет активного клиента"}
              </span>
              {myClient && timerActive && (
                <span
                  className="font-mono text-sm font-bold px-2.5 py-0.5 rounded-full"
                  style={{
                    background: "hsl(145 63% 22%)",
                    color: "hsl(145 63% 62%)",
                  }}
                >
                  {formatTimer(timer)}
                </span>
              )}
            </div>

            {myClient ? (
              <div className="px-5 py-6">
                <div className="flex items-center gap-6 mb-6">
                  <div
                    className="font-black leading-none"
                    style={{
                      fontSize: 72,
                      color: SERVICE_COLORS[myClient.service],
                      textShadow: `0 0 30px ${SERVICE_COLORS[myClient.service]}44`,
                    }}
                  >
                    {myClient.number}
                  </div>
                  <div>
                    <div
                      className="text-base font-semibold mb-1"
                      style={{ color: "hsl(var(--foreground))" }}
                    >
                      {SERVICE_NAMES[myClient.service]}
                    </div>
                    {myClient.calledAt && (
                      <div
                        className="text-sm"
                        style={{ color: "hsl(var(--muted-foreground))" }}
                      >
                        Вызван в {myClient.calledAt}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleFinish}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
                    style={{
                      background: "hsl(145 63% 32%)",
                      color: "#fff",
                    }}
                  >
                    <Icon name="CheckCircle2" size={16} />
                    Завершить обслуживание
                  </button>
                  <button
                    onClick={handleCallNext}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all"
                    style={{
                      background: "hsl(var(--muted))",
                      color: "hsl(var(--muted-foreground))",
                    }}
                  >
                    <Icon name="SkipForward" size={15} />
                    Пропустить
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-5 py-8 flex flex-col items-center gap-4">
                <Icon
                  name="UserCheck"
                  size={40}
                  style={{ color: "hsl(var(--muted-foreground))" }}
                />
                <p
                  className="text-sm text-center"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  Нажмите кнопку ниже, чтобы вызвать<br />следующего клиента из очереди
                </p>
                <button
                  onClick={handleCallNext}
                  disabled={!myWindow.open || waiting.length === 0}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all"
                  style={{
                    background:
                      myWindow.open && waiting.length > 0
                        ? "hsl(var(--primary))"
                        : "hsl(var(--muted))",
                    color:
                      myWindow.open && waiting.length > 0
                        ? "hsl(var(--primary-foreground))"
                        : "hsl(var(--muted-foreground))",
                    cursor:
                      myWindow.open && waiting.length > 0 ? "pointer" : "not-allowed",
                  }}
                >
                  <Icon name="ChevronRight" size={16} />
                  Вызвать следующего
                </button>
              </div>
            )}
          </div>

          {/* Next in queue preview */}
          {waiting.length > 0 && (
            <div
              className="rounded-xl overflow-hidden"
              style={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
              }}
            >
              <div
                className="px-5 py-3 border-b"
                style={{ borderColor: "hsl(var(--border))" }}
              >
                <span
                  className="text-sm font-semibold"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  Следующие в очереди
                </span>
              </div>
              <div>
                {waiting.slice(0, 5).map((entry, i) => (
                  <div
                    key={entry.number}
                    className="flex items-center gap-3 px-5 py-3 border-b last:border-0 transition-colors"
                    style={{ borderColor: "hsl(var(--border))" }}
                  >
                    <span
                      className="w-5 text-xs text-right flex-shrink-0"
                      style={{ color: "hsl(var(--muted-foreground))" }}
                    >
                      {i + 1}
                    </span>
                    <span
                      className="font-bold font-mono text-sm w-16"
                      style={{ color: SERVICE_COLORS[entry.service] }}
                    >
                      {entry.number}
                    </span>
                    <span
                      className="text-sm flex-1"
                      style={{ color: "hsl(var(--foreground))" }}
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
              </div>
            </div>
          )}
        </div>

        {/* Stats sidebar */}
        <div className="space-y-4">
          {/* My stats */}
          <div
            className="rounded-xl overflow-hidden"
            style={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
            }}
          >
            <div
              className="px-4 py-3 border-b"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              <span
                className="text-sm font-semibold"
                style={{ color: "hsl(var(--foreground))" }}
              >
                Моя статистика
              </span>
            </div>
            <div className="p-4 space-y-3">
              {[
                { label: "Обслужено сегодня", value: doneToday, icon: "CheckCircle2", color: "hsl(145 63% 32%)" },
                { label: "В очереди сейчас", value: waiting.length, icon: "Users", color: "hsl(215 80% 52%)" },
                { label: "Среднее время", value: "4:32", icon: "Timer", color: "hsl(38 92% 50%)" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-3 p-3 rounded-lg"
                  style={{ background: "hsl(var(--background))" }}
                >
                  <div
                    className="p-1.5 rounded-lg"
                    style={{ background: stat.color + "18" }}
                  >
                    <Icon name={stat.icon} size={14} style={{ color: stat.color }} />
                  </div>
                  <div>
                    <div
                      className="text-lg font-bold leading-tight"
                      style={{ color: "hsl(var(--foreground))" }}
                    >
                      {stat.value}
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: "hsl(var(--muted-foreground))" }}
                    >
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* All windows */}
          <div
            className="rounded-xl overflow-hidden"
            style={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
            }}
          >
            <div
              className="px-4 py-3 border-b"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              <span
                className="text-sm font-semibold"
                style={{ color: "hsl(var(--foreground))" }}
              >
                Все окна
              </span>
            </div>
            <div className="p-3 space-y-1.5">
              {windows.map((win) => {
                const active = queue.find(
                  (q) =>
                    q.window === win.id &&
                    (q.status === "called" || q.status === "serving")
                );
                const isMe = win.id === MY_WINDOW_ID;
                return (
                  <div
                    key={win.id}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg"
                    style={{
                      background: isMe
                        ? "hsl(var(--accent))"
                        : "hsl(var(--background))",
                      border: isMe
                        ? "1px solid hsl(var(--primary)/40)"
                        : "1px solid transparent",
                    }}
                  >
                    <div
                      className="w-6 h-6 rounded flex items-center justify-center font-bold text-xs flex-shrink-0"
                      style={{
                        background: win.open
                          ? "hsl(var(--primary))"
                          : "hsl(var(--muted-foreground))",
                        color: "#fff",
                      }}
                    >
                      {win.id}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-xs font-medium truncate"
                        style={{ color: "hsl(var(--foreground))" }}
                      >
                        {win.operator.split(" ")[0]} {isMe ? "(я)" : ""}
                      </div>
                      <div
                        className="text-xs truncate"
                        style={{ color: "hsl(var(--muted-foreground))" }}
                      >
                        {active
                          ? active.number
                          : win.open
                          ? "Свободно"
                          : "Закрыто"}
                      </div>
                    </div>
                    <div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{
                        background: win.open
                          ? active
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
        </div>
      </div>
    </div>
  );
}
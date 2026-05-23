import { useState } from "react";
import Icon from "@/components/ui/icon";

const metrics = [
  {
    label: "Выполнено задач",
    value: "247",
    delta: "+12 за месяц",
    positive: true,
    icon: "CheckCircle2",
    color: "hsl(145 63% 32%)",
  },
  {
    label: "Активных проектов",
    value: "18",
    delta: "+3 новых",
    positive: true,
    icon: "Briefcase",
    color: "hsl(215 80% 52%)",
  },
  {
    label: "Обращений в работе",
    value: "34",
    delta: "-5 с прошлой недели",
    positive: true,
    icon: "MessageSquare",
    color: "hsl(38 92% 50%)",
  },
  {
    label: "Просрочено",
    value: "7",
    delta: "+2 критичных",
    positive: false,
    icon: "AlertCircle",
    color: "hsl(0 72% 51%)",
  },
];

const tableData = [
  {
    id: "ЗАД-1041",
    name: "Обновить договор с клиентом ООО «Ромашка»",
    status: "В работе",
    priority: "Высокий",
    deadline: "24.05.2026",
    assignee: "Иванов А.И.",
  },
  {
    id: "ЗАД-1038",
    name: "Согласовать бюджет Q2 с руководством",
    status: "На согласовании",
    priority: "Высокий",
    deadline: "25.05.2026",
    assignee: "Петрова М.С.",
  },
  {
    id: "ЗАД-1035",
    name: "Подготовить отчёт по кредитному портфелю",
    status: "Выполнено",
    priority: "Средний",
    deadline: "22.05.2026",
    assignee: "Сидоров К.В.",
  },
  {
    id: "ЗАД-1031",
    name: "Провести аудит системы безопасности",
    status: "Просрочено",
    priority: "Критический",
    deadline: "20.05.2026",
    assignee: "Козлов Д.П.",
  },
  {
    id: "ЗАД-1028",
    name: "Обучение новых сотрудников — онбординг",
    status: "В работе",
    priority: "Низкий",
    deadline: "30.05.2026",
    assignee: "Новикова Е.А.",
  },
  {
    id: "ЗАД-1024",
    name: "Интеграция с внешним API партнёра",
    status: "На согласовании",
    priority: "Средний",
    deadline: "28.05.2026",
    assignee: "Морозов В.И.",
  },
];

const statusConfig: Record<string, { bg: string; text: string }> = {
  "В работе": { bg: "hsl(215 80% 94%)", text: "hsl(215 80% 38%)" },
  "На согласовании": { bg: "hsl(38 92% 92%)", text: "hsl(38 70% 38%)" },
  Выполнено: { bg: "hsl(145 45% 90%)", text: "hsl(145 63% 28%)" },
  Просрочено: { bg: "hsl(0 72% 93%)", text: "hsl(0 72% 45%)" },
};

const priorityConfig: Record<string, { dot: string }> = {
  Критический: { dot: "hsl(0 72% 51%)" },
  Высокий: { dot: "hsl(38 92% 50%)" },
  Средний: { dot: "hsl(215 80% 52%)" },
  Низкий: { dot: "hsl(145 63% 42%)" },
};

export default function Home() {
  const [exportOpen, setExportOpen] = useState(false);
  const [filter, setFilter] = useState("all");

  const filtered =
    filter === "all"
      ? tableData
      : tableData.filter((r) => r.status === filter);

  const handleExport = (format: string) => {
    setExportOpen(false);
    alert(`Выгрузка в формате ${format} запущена`);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <div
            key={i}
            className="rounded-xl p-5 transition-shadow hover:shadow-md"
            style={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              animationDelay: `${i * 60}ms`,
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className="p-2 rounded-lg"
                style={{ background: m.color + "18" }}
              >
                <Icon name={m.icon} size={18} style={{ color: m.color }} />
              </div>
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{
                  background: m.positive ? "hsl(145 45% 90%)" : "hsl(0 72% 93%)",
                  color: m.positive ? "hsl(145 63% 28%)" : "hsl(0 72% 45%)",
                }}
              >
                {m.delta}
              </span>
            </div>
            <div
              className="text-3xl font-bold mb-0.5"
              style={{ color: "hsl(var(--foreground))" }}
            >
              {m.value}
            </div>
            <div
              className="text-sm"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              {m.label}
            </div>
          </div>
        ))}
      </div>

      {/* Table section */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
        }}
      >
        {/* Table header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: "hsl(var(--border))" }}
        >
          <div>
            <h2
              className="font-semibold text-sm"
              style={{ color: "hsl(var(--foreground))" }}
            >
              Задачи и поручения
            </h2>
            <p
              className="text-xs mt-0.5"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              Актуальный список на {new Date().toLocaleDateString("ru-RU")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-lg border outline-none"
              style={{
                background: "hsl(var(--background))",
                borderColor: "hsl(var(--border))",
                color: "hsl(var(--foreground))",
              }}
            >
              <option value="all">Все статусы</option>
              <option value="В работе">В работе</option>
              <option value="На согласовании">На согласовании</option>
              <option value="Выполнено">Выполнено</option>
              <option value="Просрочено">Просрочено</option>
            </select>

            {/* Export dropdown */}
            <div className="relative">
              <button
                onClick={() => setExportOpen(!exportOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: "hsl(var(--primary))",
                  color: "hsl(var(--primary-foreground))",
                }}
              >
                <Icon name="Download" size={13} />
                Выгрузить
                <Icon name="ChevronDown" size={12} />
              </button>
              {exportOpen && (
                <div
                  className="absolute right-0 top-full mt-1 rounded-lg shadow-lg z-10 overflow-hidden animate-fade-in"
                  style={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    minWidth: 160,
                  }}
                >
                  {[
                    { label: "Excel (.xlsx)", icon: "Table2" },
                    { label: "PDF документ", icon: "FileText" },
                    { label: "CSV таблица", icon: "FileSpreadsheet" },
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => handleExport(opt.label)}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-left transition-colors"
                      style={{ color: "hsl(var(--foreground))" }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLElement).style.background =
                          "hsl(var(--muted))")
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLElement).style.background =
                          "transparent")
                      }
                    >
                      <Icon
                        name={opt.icon}
                        size={14}
                        style={{ color: "hsl(var(--primary))" }}
                      />
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr
                style={{
                  background: "hsl(var(--muted))",
                  borderBottom: "1px solid hsl(var(--border))",
                }}
              >
                {["ID", "Задача", "Статус", "Приоритет", "Срок", "Исполнитель"].map(
                  (col) => (
                    <th
                      key={col}
                      className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wide"
                      style={{ color: "hsl(var(--muted-foreground))" }}
                    >
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr
                  key={row.id}
                  className="transition-colors"
                  style={{
                    borderBottom:
                      i < filtered.length - 1
                        ? "1px solid hsl(var(--border))"
                        : "none",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.background =
                      "hsl(var(--muted)/0.5)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = "transparent")
                  }
                >
                  <td
                    className="px-4 py-3 font-mono text-xs"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    {row.id}
                  </td>
                  <td
                    className="px-4 py-3 font-medium max-w-xs"
                    style={{ color: "hsl(var(--foreground))" }}
                  >
                    <span className="line-clamp-1">{row.name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{
                        background: statusConfig[row.status]?.bg,
                        color: statusConfig[row.status]?.text,
                      }}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="flex items-center gap-1.5 text-xs"
                      style={{ color: "hsl(var(--foreground))" }}
                    >
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{
                          background: priorityConfig[row.priority]?.dot,
                        }}
                      />
                      {row.priority}
                    </span>
                  </td>
                  <td
                    className="px-4 py-3 text-sm"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    {row.deadline}
                  </td>
                  <td
                    className="px-4 py-3 text-sm"
                    style={{ color: "hsl(var(--foreground))" }}
                  >
                    {row.assignee}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-5 py-3 border-t"
          style={{
            borderColor: "hsl(var(--border))",
            background: "hsl(var(--muted)/0.3)",
          }}
        >
          <span
            className="text-xs"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Показано {filtered.length} из {tableData.length} записей
          </span>
          <div className="flex gap-1">
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                className="w-7 h-7 rounded text-xs font-medium transition-colors"
                style={{
                  background:
                    p === 1 ? "hsl(var(--primary))" : "transparent",
                  color:
                    p === 1
                      ? "hsl(var(--primary-foreground))"
                      : "hsl(var(--muted-foreground))",
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

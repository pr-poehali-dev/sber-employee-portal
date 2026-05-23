import { useState } from "react";
import Icon from "@/components/ui/icon";

const services = [
  { id: "A", label: "Кредиты и ипотека", icon: "Landmark", color: "hsl(215 80% 52%)", desc: "Оформление, рефинансирование, консультация" },
  { id: "B", label: "Вклады и накопления", icon: "PiggyBank", color: "hsl(145 63% 32%)", desc: "Открытие, закрытие, пролонгация вкладов" },
  { id: "C", label: "Карты и счета", icon: "CreditCard", color: "hsl(280 60% 52%)", desc: "Выпуск карт, операции по счетам" },
  { id: "D", label: "Переводы и платежи", icon: "ArrowLeftRight", color: "hsl(38 92% 50%)", desc: "СБП, SWIFT, оплата услуг" },
  { id: "E", label: "Страхование", icon: "Shield", color: "hsl(170 60% 38%)", desc: "Страховые продукты и оформление полисов" },
  { id: "F", label: "Прочие операции", icon: "MoreHorizontal", color: "hsl(215 15% 50%)", desc: "Справки, документы, консультации" },
];

type TicketData = {
  number: string;
  service: (typeof services)[0];
  time: string;
  position: number;
  waitMin: number;
};

export default function Tickets() {
  const [selected, setSelected] = useState<string | null>(null);
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [printing, setPrinting] = useState(false);

  const takeTicket = () => {
    if (!selected) return;
    const svc = services.find((s) => s.id === selected)!;
    setPrinting(true);
    setTimeout(() => {
      const num = Math.floor(Math.random() * 40) + 1;
      setTicket({
        number: `${svc.id}${String(num).padStart(3, "0")}`,
        service: svc,
        time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
        position: num,
        waitMin: Math.round(num * 4.5),
      });
      setPrinting(false);
    }, 900);
  };

  const reset = () => {
    setTicket(null);
    setSelected(null);
  };

  if (ticket) {
    return (
      <div className="flex items-start justify-center pt-4 animate-slide-up">
        <div className="w-full max-w-md">
          {/* Ticket card */}
          <div
            className="rounded-2xl overflow-hidden shadow-xl"
            style={{ border: "1px solid hsl(var(--border))" }}
          >
            {/* Header strip */}
            <div
              className="px-8 pt-8 pb-6 text-center"
              style={{ background: ticket.service.color }}
            >
              <div className="text-white/70 text-sm font-medium mb-1">Ваш номер талона</div>
              <div className="text-white font-black text-7xl tracking-tight leading-none mb-2">
                {ticket.number}
              </div>
              <div className="text-white/80 text-sm">{ticket.service.label}</div>
            </div>

            {/* Body */}
            <div
              className="px-8 py-6"
              style={{ background: "hsl(var(--card))" }}
            >
              {/* Dashed divider */}
              <div
                className="border-t-2 border-dashed mb-6"
                style={{ borderColor: "hsl(var(--border))" }}
              />

              <div className="grid grid-cols-3 gap-4 text-center mb-6">
                <div>
                  <div
                    className="text-2xl font-bold"
                    style={{ color: "hsl(var(--foreground))" }}
                  >
                    {ticket.position}
                  </div>
                  <div
                    className="text-xs mt-0.5"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    место в очереди
                  </div>
                </div>
                <div>
                  <div
                    className="text-2xl font-bold"
                    style={{ color: "hsl(var(--foreground))" }}
                  >
                    ~{ticket.waitMin} мин
                  </div>
                  <div
                    className="text-xs mt-0.5"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    ожидание
                  </div>
                </div>
                <div>
                  <div
                    className="text-2xl font-bold"
                    style={{ color: "hsl(var(--foreground))" }}
                  >
                    {ticket.time}
                  </div>
                  <div
                    className="text-xs mt-0.5"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    время выдачи
                  </div>
                </div>
              </div>

              <div
                className="rounded-xl p-4 flex items-center gap-3 mb-6"
                style={{ background: "hsl(var(--muted))" }}
              >
                <Icon name="Info" size={16} style={{ color: ticket.service.color, flexShrink: 0 }} />
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  Следите за табло в зале. При вызове вашего номера подойдите к указанному окну в течение 3 минут.
                </p>
              </div>

              {/* Barcode visual */}
              <div className="flex justify-center gap-px mb-6">
                {Array.from({ length: 40 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-sm"
                    style={{
                      width: i % 3 === 0 ? 3 : 1,
                      height: i % 5 === 0 ? 32 : 24,
                      background: "hsl(var(--foreground))",
                      opacity: 0.15 + (i % 4) * 0.2,
                    }}
                  />
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={reset}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: ticket.service.color,
                    color: "#fff",
                  }}
                >
                  Взять ещё талон
                </button>
                <button
                  className="px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
                  style={{
                    background: "hsl(var(--muted))",
                    color: "hsl(var(--muted-foreground))",
                  }}
                  onClick={() => window.print()}
                >
                  <Icon name="Printer" size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl animate-slide-up">
      <div
        className="rounded-xl p-6 mb-5"
        style={{
          background: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
        }}
      >
        <h2
          className="font-semibold text-base mb-1"
          style={{ color: "hsl(var(--foreground))" }}
        >
          Выберите услугу
        </h2>
        <p
          className="text-sm mb-5"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          Клиент получит талон с номером в очереди
        </p>

        <div className="grid grid-cols-2 gap-3">
          {services.map((svc) => (
            <button
              key={svc.id}
              onClick={() => setSelected(svc.id)}
              className="flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all"
              style={{
                borderColor: selected === svc.id ? svc.color : "hsl(var(--border))",
                background:
                  selected === svc.id
                    ? svc.color + "12"
                    : "hsl(var(--background))",
              }}
            >
              <div
                className="p-2 rounded-lg flex-shrink-0 mt-0.5"
                style={{ background: svc.color + "18" }}
              >
                <Icon name={svc.icon} size={16} style={{ color: svc.color }} />
              </div>
              <div>
                <div
                  className="text-sm font-semibold leading-tight mb-0.5"
                  style={{
                    color:
                      selected === svc.id ? svc.color : "hsl(var(--foreground))",
                  }}
                >
                  {svc.label}
                </div>
                <div
                  className="text-xs"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  {svc.desc}
                </div>
              </div>
              {selected === svc.id && (
                <Icon
                  name="CheckCircle2"
                  size={16}
                  className="ml-auto flex-shrink-0"
                  style={{ color: svc.color }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={takeTicket}
        disabled={!selected || printing}
        className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2"
        style={{
          background: selected ? "hsl(var(--primary))" : "hsl(var(--muted))",
          color: selected ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))",
          cursor: selected ? "pointer" : "not-allowed",
          opacity: printing ? 0.7 : 1,
        }}
      >
        {printing ? (
          <>
            <Icon name="Loader2" size={16} className="animate-spin" />
            Формирую талон...
          </>
        ) : (
          <>
            <Icon name="Ticket" size={16} />
            Выдать талон
          </>
        )}
      </button>
    </div>
  );
}

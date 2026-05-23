import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";


const Section = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) => (
  <div
    className="rounded-xl overflow-hidden"
    style={{
      background: "hsl(var(--card))",
      border: "1px solid hsl(var(--border))",
    }}
  >
    <div
      className="flex items-center gap-2.5 px-5 py-4 border-b"
      style={{ borderColor: "hsl(var(--border))" }}
    >
      <Icon name={icon} size={16} style={{ color: "hsl(var(--primary))" }} />
      <h2
        className="font-semibold text-sm"
        style={{ color: "hsl(var(--foreground))" }}
      >
        {title}
      </h2>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

const Field = ({
  label,
  value,
  type = "text",
  readOnly = false,
}: {
  label: string;
  value: string;
  type?: string;
  readOnly?: boolean;
}) => (
  <div>
    <label
      className="block text-xs font-medium mb-1.5"
      style={{ color: "hsl(var(--muted-foreground))" }}
    >
      {label}
    </label>
    <input
      type={type}
      defaultValue={value}
      readOnly={readOnly}
      className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all"
      style={{
        background: readOnly ? "hsl(var(--muted))" : "hsl(var(--background))",
        border: "1px solid hsl(var(--border))",
        color: "hsl(var(--foreground))",
        cursor: readOnly ? "default" : "text",
      }}
      onFocus={(e) => {
        if (!readOnly)
          (e.currentTarget as HTMLInputElement).style.borderColor =
            "hsl(var(--primary))";
      }}
      onBlur={(e) => {
        (e.currentTarget as HTMLInputElement).style.borderColor =
          "hsl(var(--border))";
      }}
    />
  </div>
);

const Toggle = ({
  label,
  description,
  defaultChecked = false,
}: {
  label: string;
  description: string;
  defaultChecked?: boolean;
}) => {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div>
        <div
          className="text-sm font-medium"
          style={{ color: "hsl(var(--foreground))" }}
        >
          {label}
        </div>
        <div
          className="text-xs mt-0.5"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          {description}
        </div>
      </div>
      <button
        onClick={() => setChecked(!checked)}
        className="relative flex-shrink-0 w-10 h-5 rounded-full transition-colors duration-200"
        style={{
          background: checked ? "hsl(var(--primary))" : "hsl(var(--border))",
        }}
      >
        <span
          className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
          style={{ transform: checked ? "translateX(20px)" : "translateX(0)" }}
        />
      </button>
    </div>
  );
};

export default function Settings() {
  const [saved, setSaved] = useState(false);
  const [exportFormat, setExportFormat] = useState("xlsx");
  const [exportEncoding, setExportEncoding] = useState("utf8");

  // Голос — загружаем из localStorage
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState(
    () => localStorage.getItem("voice_name") ?? ""
  );
  const [volume, setVolume] = useState(
    () => parseFloat(localStorage.getItem("voice_volume") ?? "1")
  );
  const [rate, setRate] = useState(
    () => parseFloat(localStorage.getItem("voice_rate") ?? "0.88")
  );
  const [pitch, setPitch] = useState(
    () => parseFloat(localStorage.getItem("voice_pitch") ?? "1.05")
  );

  useEffect(() => {
    const load = () => {
      const list = window.speechSynthesis?.getVoices() ?? [];
      const ru = list.filter((v) => v.lang.startsWith("ru"));
      const available = ru.length ? ru : list.slice(0, 8);
      setVoices(available);
      // Если голос ещё не выбран — берём первый русский
      if (!localStorage.getItem("voice_name") && available[0]) {
        setSelectedVoice(available[0].name);
      }
    };
    load();
    window.speechSynthesis?.addEventListener("voiceschanged", load);
    return () => window.speechSynthesis?.removeEventListener("voiceschanged", load);
  }, []);

  const handleTestVoice = () => {
    try {
      window.speechSynthesis?.cancel();
      const utter = new SpeechSynthesisUtterance("Талон А — четырнадцать. Пройдите к окну два.");
      utter.lang = "ru-RU";
      utter.volume = volume;
      utter.rate = rate;
      utter.pitch = pitch;
      const voice = voices.find((v) => v.name === selectedVoice);
      if (voice) utter.voice = voice;
      window.speechSynthesis?.speak(utter);
    } catch { /* молча */ }
  };

  const handleSave = () => {
    // Сохраняем настройки голоса в localStorage
    localStorage.setItem("voice_name", selectedVoice);
    localStorage.setItem("voice_volume", String(volume));
    localStorage.setItem("voice_rate", String(rate));
    localStorage.setItem("voice_pitch", String(pitch));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-5 max-w-3xl animate-slide-up">
      {/* Profile */}
      <Section title="Профиль сотрудника" icon="User">
        <div className="flex items-center gap-4 mb-5">
          <div
            className="flex items-center justify-center rounded-full text-white font-bold text-lg flex-shrink-0"
            style={{
              width: 64,
              height: 64,
              background: "hsl(var(--primary))",
            }}
          >
            АИ
          </div>
          <div>
            <div
              className="font-semibold"
              style={{ color: "hsl(var(--foreground))" }}
            >
              Алексей Иванов
            </div>
            <div
              className="text-sm"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              Менеджер отдела корпоративного кредитования
            </div>
            <button
              className="text-xs mt-1 font-medium"
              style={{ color: "hsl(var(--primary))" }}
            >
              Изменить фото
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Имя" value="Алексей" />
          <Field label="Фамилия" value="Иванов" />
          <Field label="Должность" value="Менеджер отдела" readOnly />
          <Field label="Табельный номер" value="СБ-00147832" readOnly />
          <Field label="Рабочий email" value="a.ivanov@sber.ru" type="email" />
          <Field label="Внутренний телефон" value="7-33-14" />
        </div>
      </Section>

      {/* Notifications */}
      <Section title="Уведомления" icon="Bell">
        <div
          className="divide-y"
          style={{ "--tw-divide-opacity": 1 } as React.CSSProperties}
        >
          <Toggle
            label="Email-уведомления"
            description="Получать важные уведомления на рабочую почту"
            defaultChecked
          />
          <Toggle
            label="Уведомления о задачах"
            description="Напоминать о приближающихся сроках задач"
            defaultChecked
          />
          <Toggle
            label="Системные оповещения"
            description="Новости портала и технические обновления"
          />
          <Toggle
            label="Отчёты на почту"
            description="Автоматически отправлять еженедельный отчёт"
            defaultChecked
          />
        </div>
      </Section>

      {/* Export settings */}
      <Section title="Настройки выгрузки данных" icon="Download">
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label
              className="block text-xs font-medium mb-1.5"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              Формат по умолчанию
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "xlsx", label: "Excel", icon: "Table2" },
                { value: "pdf", label: "PDF", icon: "FileText" },
                { value: "csv", label: "CSV", icon: "FileSpreadsheet" },
              ].map((f) => (
                <button
                  key={f.value}
                  onClick={() => setExportFormat(f.value)}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-all text-sm font-medium"
                  style={{
                    background:
                      exportFormat === f.value
                        ? "hsl(var(--accent))"
                        : "hsl(var(--background))",
                    borderColor:
                      exportFormat === f.value
                        ? "hsl(var(--primary))"
                        : "hsl(var(--border))",
                    color:
                      exportFormat === f.value
                        ? "hsl(var(--primary))"
                        : "hsl(var(--muted-foreground))",
                  }}
                >
                  <Icon name={f.icon} size={18} />
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label
                className="block text-xs font-medium mb-1.5"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                Кодировка файла
              </label>
              <select
                value={exportEncoding}
                onChange={(e) => setExportEncoding(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{
                  background: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  color: "hsl(var(--foreground))",
                }}
              >
                <option value="utf8">UTF-8 (рекомендуется)</option>
                <option value="win1251">Windows-1251</option>
                <option value="ascii">ASCII</option>
              </select>
            </div>
            <div>
              <label
                className="block text-xs font-medium mb-1.5"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                Разделитель CSV
              </label>
              <select
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{
                  background: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  color: "hsl(var(--foreground))",
                }}
              >
                <option value=";">Точка с запятой (;)</option>
                <option value=",">Запятая (,)</option>
                <option value="\t">Табуляция</option>
              </select>
            </div>
          </div>
        </div>

        <div
          className="mt-4 p-3 rounded-lg flex items-center gap-2.5"
          style={{ background: "hsl(var(--accent))" }}
        >
          <Icon
            name="Info"
            size={14}
            style={{ color: "hsl(var(--primary))", flexShrink: 0 }}
          />
          <span
            className="text-xs"
            style={{ color: "hsl(var(--accent-foreground))" }}
          >
            Выгрузка доступна на главной странице — кнопка «Выгрузить» в таблице задач
          </span>
        </div>
      </Section>

      {/* Voice & Sound */}
      <Section title="Голос и звук очереди" icon="Mic2">
        <div className="space-y-5">
          {/* Voice selector */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>
              Голос объявления
            </label>
            {voices.length > 0 ? (
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{
                  background: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  color: "hsl(var(--foreground))",
                }}
              >
                {voices.map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            ) : (
              <div
                className="px-3 py-2 rounded-lg text-sm"
                style={{
                  background: "hsl(var(--muted))",
                  color: "hsl(var(--muted-foreground))",
                  border: "1px solid hsl(var(--border))",
                }}
              >
                Голоса загружаются... (разрешите доступ в браузере)
              </div>
            )}
          </div>

          {/* Sliders */}
          <div className="grid grid-cols-3 gap-5">
            {[
              { label: "Громкость", value: volume, min: 0, max: 1, step: 0.05, set: setVolume, fmt: (v: number) => `${Math.round(v * 100)}%` },
              { label: "Скорость речи", value: rate, min: 0.5, max: 2, step: 0.05, set: setRate, fmt: (v: number) => `${v.toFixed(2)}x` },
              { label: "Тон голоса", value: pitch, min: 0.5, max: 2, step: 0.05, set: setPitch, fmt: (v: number) => v.toFixed(2) },
            ].map((s) => (
              <div key={s.label}>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium" style={{ color: "hsl(var(--muted-foreground))" }}>
                    {s.label}
                  </label>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded"
                    style={{ background: "hsl(var(--accent))", color: "hsl(var(--primary))" }}
                  >
                    {s.fmt(s.value)}
                  </span>
                </div>
                <input
                  type="range"
                  min={s.min}
                  max={s.max}
                  step={s.step}
                  value={s.value}
                  onChange={(e) => s.set(parseFloat(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{
                    accentColor: "hsl(var(--primary))",
                    background: `linear-gradient(to right, hsl(var(--primary)) ${((s.value - s.min) / (s.max - s.min)) * 100}%, hsl(var(--border)) 0%)`,
                  }}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{s.fmt(s.min)}</span>
                  <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{s.fmt(s.max)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Test button */}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handleTestVoice}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{ background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }}
            >
              <Icon name="Play" size={14} />
              Воспроизвести тест
            </button>
            <button
              onClick={() => window.speechSynthesis?.cancel()}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all"
              style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}
            >
              <Icon name="Square" size={13} />
              Стоп
            </button>
            <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
              «Талон А — четырнадцать. Пройдите к окну два.»
            </span>
          </div>
        </div>
      </Section>

      {/* Save button */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all"
          style={{
            background: saved ? "hsl(145 50% 45%)" : "hsl(var(--primary))",
            color: "hsl(var(--primary-foreground))",
          }}
        >
          <Icon name={saved ? "Check" : "Save"} size={15} />
          {saved ? "Сохранено!" : "Сохранить изменения"}
        </button>
        <button
          className="px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
          style={{
            background: "hsl(var(--muted))",
            color: "hsl(var(--muted-foreground))",
          }}
        >
          Отмена
        </button>
      </div>
    </div>
  );
}
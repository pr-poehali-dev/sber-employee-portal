// Голосовое объявление через Web Speech API
const SERVICE_VOICE: Record<string, string> = {
  A: "А",
  B: "Б",
  C: "В",
  D: "Г",
  E: "Д",
  F: "Е",
};

export function announceTicket(ticketNumber: string, windowId: number) {
  try {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const letter = ticketNumber[0];
    const digits = ticketNumber.slice(1).replace(/^0+/, "") || "ноль";
    const voiceLetter = SERVICE_VOICE[letter] || letter;
    const text = `Талон ${voiceLetter} — ${digits}. Пройдите к окну ${windowId}.`;

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "ru-RU";

    // Читаем сохранённые настройки из localStorage
    utter.volume = parseFloat(localStorage.getItem("voice_volume") ?? "1");
    utter.rate   = parseFloat(localStorage.getItem("voice_rate")   ?? "0.88");
    utter.pitch  = parseFloat(localStorage.getItem("voice_pitch")  ?? "1.05");

    const savedName = localStorage.getItem("voice_name");
    if (savedName) {
      const voices = window.speechSynthesis.getVoices();
      const saved = voices.find((v) => v.name === savedName);
      if (saved) utter.voice = saved;
    } else {
      const voices = window.speechSynthesis.getVoices();
      const ruVoice = voices.find((v) => v.lang.startsWith("ru"));
      if (ruVoice) utter.voice = ruVoice;
    }

    // Небольшая пауза после сигнала — объявление звучит после тонов
    setTimeout(() => window.speechSynthesis.speak(utter), 750);
  } catch {
    // молча игнорируем
  }
}

// Синтез звука через Web Audio API — без файлов и зависимостей
export function playCallSound() {
  try {
    const ctx = new AudioContext();

    const playTone = (freq: number, start: number, duration: number, vol = 0.4) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);

      gain.gain.setValueAtTime(0, ctx.currentTime + start);
      gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + start + 0.02);
      gain.gain.setValueAtTime(vol, ctx.currentTime + start + duration - 0.05);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + start + duration);

      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + duration);
    };

    // Три мелодичных тона — фирменный звук вызова
    playTone(880, 0.0, 0.18, 0.35);   // ля
    playTone(1108, 0.2, 0.18, 0.35);  // до#
    playTone(1320, 0.4, 0.28, 0.4);   // ми

    setTimeout(() => ctx.close(), 1500);
  } catch {
    // Браузер заблокировал AudioContext — молча игнорируем
  }
}

export function playDoneSound() {
  try {
    const ctx = new AudioContext();

    const playTone = (freq: number, start: number, duration: number, vol = 0.3) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);

      gain.gain.setValueAtTime(0, ctx.currentTime + start);
      gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + start + 0.02);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + start + duration);

      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + duration);
    };

    // Два нисходящих тона — завершение
    playTone(660, 0.0, 0.15, 0.25);
    playTone(440, 0.18, 0.2, 0.2);

    setTimeout(() => ctx.close(), 800);
  } catch {
    // молча игнорируем
  }
}
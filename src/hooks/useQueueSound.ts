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

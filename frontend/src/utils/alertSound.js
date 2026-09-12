/**
 * Plays a two-tone alert beep using the Web Audio API — no audio file
 * needed. Browsers require a prior user interaction (a click) before
 * audio can play; since alerts only fire after the user has clicked
 * "Compile & run" already, this works fine in practice.
 */
let audioCtx = null;

export default function playAlertSound() {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const now = audioCtx.currentTime;

    [880, 660].forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;

      const start = now + i * 0.18;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.28, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.16);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(start);
      osc.stop(start + 0.18);
    });
  } catch (e) {
    // AudioContext unsupported or blocked — fail silently
  }
}
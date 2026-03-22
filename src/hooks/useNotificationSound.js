import { useRef } from "react";

export const useNotificationSound = () => {
  const audioCtx = useRef(null);

  const playSound = () => {
    try {
      if (!audioCtx.current) {
        audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtx.current;

      // Create a pleasant two-tone notification sound
      const playTone = (frequency, startTime, duration, gain = 0.3) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.setValueAtTime(frequency, startTime);
        oscillator.type = "sine";

        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(gain, startTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      };

      const now = ctx.currentTime;
      playTone(880, now, 0.15, 0.25);        // First tone — high
      playTone(1100, now + 0.15, 0.2, 0.2);  // Second tone — higher

    } catch (e) {
      console.log("Audio not supported");
    }
  };

  return { playSound };
};

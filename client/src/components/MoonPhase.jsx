import { useMemo } from "react";

const getMoonPhase = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  let c = 0, e = 0, jd = 0, b = 0;
  if (month < 3) {
    c = year - 1;
    e = month + 12;
  } else {
    c = year;
    e = month;
  }
  jd = Math.floor(365.25 * (c + 4716)) + Math.floor(30.6001 * (e + 1)) + day - 1524.5;
  const daySinceNew = jd - 2451549.5;
  const newMoons = daySinceNew / 29.53058867;
  const phase = (newMoons - Math.floor(newMoons));

  return phase;
};

const moonPhases = [
  { name: "New Moon", emoji: "🌑", range: [0, 0.0625] },
  { name: "Waxing Crescent", emoji: "🌒", range: [0.0625, 0.1875] },
  { name: "First Quarter", emoji: "🌓", range: [0.1875, 0.3125] },
  { name: "Waxing Gibbous", emoji: "🌔", range: [0.3125, 0.4375] },
  { name: "Full Moon", emoji: "🌕", range: [0.4375, 0.5625] },
  { name: "Waning Gibbous", emoji: "🌖", range: [0.5625, 0.6875] },
  { name: "Last Quarter", emoji: "🌗", range: [0.6875, 0.8125] },
  { name: "Waning Crescent", emoji: "🌘", range: [0.8125, 0.9375] },
  { name: "New Moon", emoji: "🌑", range: [0.9375, 1] },
];

const getNextFullMoon = (phase) => {
  const daysToFull = phase < 0.5 ? (0.5 - phase) * 29.53 : (1.5 - phase) * 29.53;
  const nextFull = new Date();
  nextFull.setDate(nextFull.getDate() + Math.round(daysToFull));
  return nextFull.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const MoonPhase = () => {
  const moonData = useMemo(() => {
    const now = new Date();
    const phase = getMoonPhase(now);
    const currentPhase = moonPhases.find((p) => phase >= p.range[0] && phase < p.range[1]) || moonPhases[0];
    const illumination = Math.round((1 - Math.cos(phase * 2 * Math.PI)) / 2 * 100);
    const nextFull = getNextFullMoon(phase);
    const age = Math.round(phase * 29.53);

    return { ...currentPhase, illumination, nextFull, age };
  }, []);

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider mb-3">Moon Phase</h3>

      <div className="flex items-center gap-4">
        <div className="text-5xl">{moonData.emoji}</div>
        <div>
          <p className="text-white text-lg font-medium">{moonData.name}</p>
          <p className="text-white/40 text-xs">{moonData.illumination}% illuminated</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-white/30">Moon Age</span>
          <span className="text-white/60">{moonData.age} days</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-white/30">Next Full Moon</span>
          <span className="text-white/60">{moonData.nextFull}</span>
        </div>
      </div>
    </div>
  );
};

export default MoonPhase;

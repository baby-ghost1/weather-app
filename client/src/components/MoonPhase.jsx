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

    return { ...currentPhase, illumination, nextFull, age, phase };
  }, []);

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      {/* header */}
      <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider mb-4">Moon Phase</h3>

      {/* emoji + ring */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-20 h-20 shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <path d="M18 2.08 a 15.92 15.92 0 0 1 0 31.83 a 15.92 15.92 0 0 1 0 -31.83" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2.5" />
            <path d="M18 2.08 a 15.92 15.92 0 0 1 0 31.83 a 15.92 15.92 0 0 1 0 -31.83" fill="none" stroke="#c4b5fd" strokeWidth="2.5" strokeDasharray={`${moonData.illumination}, 100`} strokeLinecap="round" className="transition-all duration-1000" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-3xl">{moonData.emoji}</div>
        </div>
        <div>
          <p className="text-white text-lg font-medium">{moonData.name}</p>
          <p className="text-white/40 text-xs">{moonData.illumination}% illuminated</p>
        </div>
      </div>

      {/* phase cycle bar */}
      <div className="mb-4">
        <div className="relative w-full h-2 rounded-full bg-white/10 overflow-hidden">
          <div className="absolute h-full rounded-full bg-gradient-to-r from-slate-700 via-purple-400 to-slate-700 transition-all" style={{ width: `${moonData.phase * 100}%` }} />
          <div className="absolute w-2.5 h-2.5 bg-white rounded-full shadow -mt-[3px] transition-all" style={{ left: `calc(${moonData.phase * 100}% - 5px)` }} />
        </div>
      </div>

      {/* details */}
      <div className="grid grid-cols-2 gap-2">
        <div className="glass rounded-lg p-2.5 text-center">
          <p className="text-white text-sm font-medium">{moonData.age} days</p>
          <p className="text-white/30 text-[10px]">Moon Age</p>
        </div>
        <div className="glass rounded-lg p-2.5 text-center">
          <p className="text-white text-sm font-medium">{moonData.nextFull}</p>
          <p className="text-white/30 text-[10px]">Next Full Moon</p>
        </div>
      </div>
    </div>
  );
};

export default MoonPhase;

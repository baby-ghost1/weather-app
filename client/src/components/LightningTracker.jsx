import { useMemo } from "react";
import { FiZap, FiAlertTriangle } from "react-icons/fi";

const getLightningRisk = (weather) => {
  if (!weather) return { risk: 0, level: "None", color: "#00e400" };
  let risk = 0;
  if (weather.main === "Thunderstorm") risk += 80;
  if (weather.main === "Rain") risk += 20;
  if (weather.temp > 25 && weather.humidity > 60) risk += 15;
  if (weather.windSpeed > 20) risk += 10;
  risk = Math.min(100, risk);

  let level, color;
  if (risk >= 70) { level = "High"; color = "#ff0000"; }
  else if (risk >= 40) { level = "Moderate"; color = "#ff7e00"; }
  else if (risk > 0) { level = "Low"; color = "#ffff00"; }
  else { level = "None"; color = "#00e400"; }

  return { risk, level, color };
};

const LightningTracker = ({ weather }) => {
  if (!weather) return null;

  const { risk, level, color } = getLightningRisk(weather);

  const factors = useMemo(() => {
    if (!weather) return [];
    const f = [];
    if (weather.main === "Thunderstorm") f.push({ label: "Thunderstorm", color: "bg-red-400/10 text-red-300" });
    if (weather.main === "Rain") f.push({ label: "Rain", color: "bg-blue-400/10 text-blue-300" });
    if (weather.temp > 25 && weather.humidity > 60) f.push({ label: "Warm & humid", color: "bg-orange-400/10 text-orange-300" });
    if (weather.windSpeed > 20) f.push({ label: "Strong winds", color: "bg-cyan-400/10 text-cyan-300" });
    return f;
  }, [weather]);

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiZap className="text-white" /> Lightning Tracker
        </h3>
        <span className="text-xs font-bold px-2.5 py-1.5 rounded-lg text-black" style={{ backgroundColor: color }}>{level}</span>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-20 h-20 shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <path d="M18 2.08 a 15.92 15.92 0 0 1 0 31.83 a 15.92 15.92 0 0 1 0 -31.83" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2.5" />
            <path d="M18 2.08 a 15.92 15.92 0 0 1 0 31.83 a 15.92 15.92 0 0 1 0 -31.83" fill="none" stroke={color} strokeWidth="2.5" strokeDasharray={`${risk}, 100`} strokeLinecap="round" className="transition-all duration-1000" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-white text-xl font-bold leading-none">{risk}%</span>
            <span className="text-white/30 text-[9px] mt-0.5">risk</span>
          </div>
        </div>
        <div>
          <p className="text-white/60 text-xs font-medium mb-1">Advice</p>
          <p className="text-white/40 text-[11px] leading-relaxed">
            {risk >= 70 ? "Avoid outdoor activities & open areas" : risk >= 40 ? "Stay alert. Seek shelter if storm approaches" : "Low risk. Normal outdoor activities safe"}
          </p>
        </div>
      </div>

      {factors.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {factors.map((f, i) => (
            <span key={i} className={`text-[10px] px-2 py-1 rounded-full ${f.color}`}>
              {f.label}
            </span>
          ))}
        </div>
      )}

      <div className={`flex items-center gap-2 px-2.5 py-2 rounded-lg ${risk >= 70 ? "bg-red-400/10" : risk >= 40 ? "bg-orange-400/10" : "bg-green-400/10"}`}>
        {weather.main === "Thunderstorm" ? (
          <>
            <FiAlertTriangle className={`text-xs shrink-0 ${risk >= 70 ? "text-red-300" : "text-orange-300"}`} />
            <span className={`text-[11px] ${risk >= 70 ? "text-red-300" : "text-orange-300"}`}>
              Active thunderstorm — seek indoor shelter immediately
            </span>
          </>
        ) : (
          <span className="text-[11px] text-green-300">
            Tip: The 30-30 rule — if thunder follows lightning by 30 seconds, go inside
          </span>
        )}
      </div>
    </div>
  );
};

export default LightningTracker;

import { FiEye } from "react-icons/fi";
import { WiFog } from "react-icons/wi";

const getVisibilityInfo = (visMeters) => {
  const km = Math.round(visMeters / 1000 * 10) / 10;
  let status, color, advice, fogRisk;

  if (km >= 10) {
    status = "Excellent"; color = "#00e400"; advice = "Perfect visibility for all activities";
  } else if (km >= 5) {
    status = "Good"; color = "#8BC34A"; advice = "Good visibility. Safe for driving.";
  } else if (km >= 2) {
    status = "Moderate"; color = "#ffff00"; advice = "Reduced visibility. Use caution while driving.";
  } else if (km >= 1) {
    status = "Poor"; color = "#ff7e00"; advice = "Low visibility. Drive with headlights on.";
  } else {
    status = "Very Poor"; color = "#ff0000"; advice = "Extremely low visibility. Avoid driving if possible.";
  }

  fogRisk = km < 2;

  return { km, status, color, advice, fogRisk };
};

const VisibilityForecast = ({ weather }) => {
  if (!weather) return null;

  const vis = getVisibilityInfo(weather.visibility);
  const score = Math.min(Math.round((vis.km / 15) * 100), 100);

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      {/* header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiEye className="text-white" /> Visibility
        </h3>
        <span className="text-xs font-bold px-2.5 py-1.5 rounded-lg text-black" style={{ backgroundColor: vis.color }}>{vis.status}</span>
      </div>

      {/* ring + advice */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-20 h-20 shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2.5" />
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={vis.color} strokeWidth="2.5" strokeDasharray={`${score}, 100`} strokeLinecap="round" className="transition-all duration-1000" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <FiEye className="text-xs mb-0.5" style={{ color: vis.color }} />
            <span className="text-white text-xl font-bold leading-none">{vis.km}</span>
            <span className="text-white/30 text-[8px]">km</span>
          </div>
        </div>
        <p className="text-white/40 text-[11px] leading-relaxed">{vis.advice}</p>
      </div>

      {/* visibility bar */}
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-3">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min((vis.km / 15) * 100, 100)}%`, backgroundColor: vis.color }} />
      </div>

      {/* fog risk badge */}
      {vis.fogRisk && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-400/10 border border-yellow-400/20">
          <WiFog className="text-yellow-300 text-base shrink-0" />
          <span className="text-yellow-300 text-[11px] font-medium">Fog Risk</span>
          <span className="text-yellow-200/60 text-[11px] ml-auto">High humidity + cool temperature</span>
        </div>
      )}
    </div>
  );
};

export default VisibilityForecast;

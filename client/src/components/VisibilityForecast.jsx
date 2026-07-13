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

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiEye className="text-white" /> Visibility
        </h3>
        <span className="text-xs font-bold px-2.5 py-1.5 rounded-lg text-black" style={{ backgroundColor: vis.color }}>{vis.status}</span>
      </div>

      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl"><FiEye className="text-white" /></span>
        <div>
          <p className="text-white text-2xl font-medium">{vis.km} km</p>
          <p className="text-white/40 text-xs">{vis.advice}</p>
        </div>
      </div>

      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-2">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min((vis.km / 15) * 100, 100)}%`, backgroundColor: vis.color }} />
      </div>

      {vis.fogRisk && (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-yellow-400/10 border border-yellow-400/20">
          <span className="text-sm"><WiFog className="text-white" /></span>
          <span className="text-yellow-300 text-[11px]">Fog risk: High humidity + cool temperature</span>
        </div>
      )}
    </div>
  );
};

export default VisibilityForecast;
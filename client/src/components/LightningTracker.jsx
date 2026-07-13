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

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiZap className="text-white" /> Lightning Tracker
        </h3>
        <span className="text-xs font-bold px-2.5 py-1.5 rounded-lg text-black" style={{ backgroundColor: color }}>{level}</span>
      </div>

      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl"><FiZap className="text-white" /></span>
        <div>
          <p className="text-white text-2xl font-medium">{risk}%</p>
          <p className="text-white/40 text-xs">
            {risk >= 70 ? "Avoid outdoor activities & open areas" : risk >= 40 ? "Stay alert. Seek shelter if storm approaches" : "Low risk. Normal outdoor activities safe"}
          </p>
        </div>
      </div>

      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${risk}%`, backgroundColor: color }} />
      </div>

      <div className="mt-2 p-2 rounded-lg bg-white/5 text-[11px] text-white/30">
        {weather.main === "Thunderstorm" ? <><FiAlertTriangle className="text-white" /> Active thunderstorm — seek indoor shelter immediately</> : "Tip: The 30-30 rule — if thunder follows lightning by 30 seconds, go inside"}
      </div>
    </div>
  );
};

export default LightningTracker;
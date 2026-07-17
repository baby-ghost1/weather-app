import { useMemo } from "react";
import { FiCloudSnow, FiAlertTriangle, FiCheck, FiThermometer, FiDroplet } from "react-icons/fi";
import { TbSnowflake } from "react-icons/tb";

const getHailRisk = (weather) => {
  if (!weather) return { risk: 0, level: "None", color: "#00e400", factors: [] };
  let risk = 0;
  const factors = [];

  if (weather.main === "Thunderstorm") { risk += 60; factors.push({ label: "Thunderstorm", value: "+60", color: "#ef4444" }); }
  else { factors.push({ label: "Thunderstorm", value: "None", color: "#4ade80" }); }

  if (weather.main === "Snow") { risk += 30; factors.push({ label: "Snow", value: "+30", color: "#f97316" }); }
  else { factors.push({ label: "Snow", value: "None", color: "#4ade80" }); }

  if (weather.temp > 25 && weather.humidity > 65) { risk += 20; factors.push({ label: "Warm+Humid", value: "+20", color: "#fbbf24" }); }
  else { factors.push({ label: "Conditions", value: "OK", color: "#4ade80" }); }

  risk = Math.min(100, risk);

  let level, color;
  if (risk >= 60) { level = "High"; color = "#ff0000"; }
  else if (risk >= 30) { level = "Moderate"; color = "#ff7e00"; }
  else if (risk > 0) { level = "Low"; color = "#ffff00"; }
  else { level = "None"; color = "#00e400"; }

  return { risk, level, color, factors };
};

const getTip = (risk) => {
  if (risk >= 60) return { text: "Cover vehicles. Stay indoors during storms.", type: "danger" };
  if (risk >= 30) return { text: "Possible hail. Be alert and stay weather-aware.", type: "warning" };
  if (risk > 0) return { text: "Minor hail risk. Standard precautions apply.", type: "caution" };
  return { text: "No significant hail expected. Enjoy your day!", type: "good" };
};

const tipColorMap = {
  good: "bg-green-400/10 text-green-300",
  warning: "bg-orange-400/10 text-orange-300",
  danger: "bg-red-400/10 text-red-300",
  caution: "bg-yellow-400/10 text-yellow-300",
};

const HailRisk = ({ weather }) => {
  const data = useMemo(() => {
    if (!weather) return null;
    return getHailRisk(weather);
  }, [weather]);

  if (!weather || !data) return null;

  const { risk, level, color, factors } = data;
  const tip = getTip(risk);

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      {/* header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiCloudSnow className="text-white" /> Hail Risk
        </h3>
        <span className="text-xs font-bold px-2.5 py-1.5 rounded-lg text-black" style={{ backgroundColor: color }}>{level}</span>
      </div>

      {/* score ring + weather info */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-20 h-20 shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2.5" />
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={color} strokeWidth="2.5" strokeDasharray={`${risk}, 100`} strokeLinecap="round" className="transition-all duration-1000" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {risk > 40 ? <FiAlertTriangle className="text-xs mb-0.5" style={{ color }} /> : <FiCheck className="text-xs mb-0.5" style={{ color }} />}
            <span className="text-white text-xl font-bold leading-none">{risk}%</span>
            <span className="text-white/30 text-[9px]">risk</span>
          </div>
        </div>
        <div className="flex-1 grid grid-cols-3 gap-2">
          <div className="glass rounded-lg p-2 text-center">
            <FiThermometer className="mx-auto mb-0.5 text-orange-300" size={14} />
            <p className="text-white text-xs font-medium">{weather.temp}°</p>
            <p className="text-white/30 text-[10px]">Temp</p>
          </div>
          <div className="glass rounded-lg p-2 text-center">
            <FiDroplet className="mx-auto mb-0.5 text-blue-300" size={14} />
            <p className="text-white text-xs font-medium">{weather.humidity}%</p>
            <p className="text-white/30 text-[10px]">Humidity</p>
          </div>
          <div className="glass rounded-lg p-2 text-center">
            <FiCloudSnow className="mx-auto mb-0.5 text-white/60" size={14} />
            <p className="text-white text-xs font-medium">{weather.main}</p>
            <p className="text-white/30 text-[10px]">Condition</p>
          </div>
        </div>
      </div>

      {/* factor breakdown */}
      <div className="flex gap-2 mb-3">
        {factors.map((f) => (
          <div key={f.label} className="flex-1 glass rounded-lg p-2 text-center">
            <p className="text-xs font-medium" style={{ color: f.color }}>{f.value}</p>
            <p className="text-white/30 text-[10px]">{f.label}</p>
          </div>
        ))}
      </div>

      {/* risk bar */}
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-3">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${risk}%`, backgroundColor: color }} />
      </div>

      {/* tip badge */}
      <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg ${tipColorMap[tip.type]}`}>
        {risk > 40 ? <FiAlertTriangle size={12} /> : <FiCheck size={12} />}
        <span className="text-[11px]">{tip.text}</span>
      </div>
    </div>
  );
};

export default HailRisk;

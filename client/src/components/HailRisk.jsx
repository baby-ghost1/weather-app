import { FiCloudSnow } from "react-icons/fi";
import { TbSnowflake } from "react-icons/tb";

const getHailRisk = (weather) => {
  if (!weather) return { risk: 0, level: "None", color: "#00e400" };
  let risk = 0;
  if (weather.main === "Thunderstorm") risk += 60;
  if (weather.main === "Snow") risk += 30;
  if (weather.temp > 25 && weather.humidity > 65) risk += 20;
  risk = Math.min(100, risk);

  let level, color;
  if (risk >= 60) { level = "High"; color = "#ff0000"; }
  else if (risk >= 30) { level = "Moderate"; color = "#ff7e00"; }
  else if (risk > 0) { level = "Low"; color = "#ffff00"; }
  else { level = "None"; color = "#00e400"; }

  return { risk, level, color };
};

const HailRisk = ({ weather }) => {
  if (!weather) return null;

  const { risk, level, color } = getHailRisk(weather);

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiCloudSnow className="text-white" /> Hail Risk
        </h3>
        <span className="text-xs font-bold px-2.5 py-1.5 rounded-lg text-black" style={{ backgroundColor: color }}>{level}</span>
      </div>

      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl"><TbSnowflake className="text-white" /></span>
        <div>
          <p className="text-white text-2xl font-medium">{risk}%</p>
          <p className="text-white/40 text-xs">
            {risk >= 60 ? "Cover vehicles. Stay indoors." : risk >= 30 ? "Possible hail. Be alert." : "No significant hail expected"}
          </p>
        </div>
      </div>

      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${risk}%`, backgroundColor: color }} />
      </div>
    </div>
  );
};

export default HailRisk;
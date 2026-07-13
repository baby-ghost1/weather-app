import { useState, useEffect } from "react";
import { FiDroplet } from "react-icons/fi";

const calcDewPoint = (temp, humidity) => {
  if (!humidity || humidity <= 0) return 0;
  const a = (17.27 * temp) / (237.7 + temp) + Math.log(humidity / 100);
  if (!isFinite(a)) return 0;
  return Math.round((237.7 * a) / (17.27 - a));
};

const getComfortLevel = (dp) => {
  if (dp < 10) return { label: "Very Dry", color: "#ff9800", tip: "Use moisturizer, stay hydrated" };
  if (dp < 16) return { label: "Comfortable", color: "#00e400", tip: "Ideal comfort level" };
  if (dp < 21) return { label: "Slightly Humid", color: "#ffff00", tip: "Minor discomfort possible" };
  if (dp < 24) return { label: "Humid", color: "#ff7e00", tip: "Feels sticky & uncomfortable" };
  return { label: "Very Humid", color: "#ff0000", tip: "Oppressive heat. Limit outdoor time." };
};

const DewPoint = ({ weather }) => {
  if (!weather) return null;

  const dp = calcDewPoint(weather.temp, weather.humidity);
  const comfort = getComfortLevel(dp);

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiDroplet className="text-white" /> Dew Point
        </h3>
        <span className="text-xs font-bold px-2.5 py-1.5 rounded-lg text-black" style={{ backgroundColor: comfort.color }}>{comfort.label}</span>
      </div>

      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl"><FiDroplet className="text-white" /></span>
        <div>
          <p className="text-white text-2xl font-medium">{dp}°</p>
          <p className="text-white/40 text-xs">{comfort.tip}</p>
        </div>
      </div>

      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min((dp / 30) * 100, 100)}%`, backgroundColor: comfort.color }} />
      </div>
      <div className="flex justify-between text-[11px] text-white/20 mt-1">
        <span>Dry</span><span>Comfortable</span><span>Humid</span>
      </div>
    </div>
  );
};

export default DewPoint;
import { useState, useEffect } from "react";
import { FiHeart } from "react-icons/fi";

const getHealthScore = (weather) => {
  let score = 100;
  const factors = [];
  if (weather.temp > 40 || weather.temp < 0) { score -= 20; factors.push({ label: "Temp", impact: -20, color: "#ff7e00" }); }
  else if (weather.temp > 35 || weather.temp < 5) { score -= 5; factors.push({ label: "Temp", impact: -5, color: "#ffff00" }); }
  else { factors.push({ label: "Temp", impact: 0, color: "#00e400" }); }

  if (weather.humidity > 85 || weather.humidity < 20) { score -= 10; factors.push({ label: "Humidity", impact: -10, color: "#ff7e00" }); }
  else { factors.push({ label: "Humidity", impact: 0, color: "#00e400" }); }

  if (weather.windSpeed > 25) { score -= 10; factors.push({ label: "Wind", impact: -10, color: "#ff7e00" }); }
  else if (weather.windSpeed > 15) { score -= 3; factors.push({ label: "Wind", impact: -3, color: "#ffff00" }); }
  else { factors.push({ label: "Wind", impact: 0, color: "#00e400" }); }

  if (weather.visibility < 2000) { score -= 10; factors.push({ label: "Visibility", impact: -10, color: "#ff7e00" }); }
  else { factors.push({ label: "Visibility", impact: 0, color: "#00e400" }); }

  if (weather.pressure && weather.pressure < 1000) { score -= 5; factors.push({ label: "Pressure", impact: -5, color: "#ffff00" }); }
  else { factors.push({ label: "Pressure", impact: 0, color: "#00e400" }); }

  if (weather.main === "Clear") { score += 10; factors.push({ label: "Sky", impact: +10, color: "#00e400" }); }

  return { score: Math.max(0, Math.min(100, score)), factors };
};

const getHealthCategory = (score) => {
  if (score >= 80) return { label: "Excellent", color: "#00e400", advice: "Great conditions for all activities. Enjoy the outdoors!" };
  if (score >= 60) return { label: "Good", color: "#8BC34A", advice: "Safe for most people. Take standard precautions." };
  if (score >= 40) return { label: "Moderate", color: "#ffff00", advice: "Sensitive groups should limit prolonged outdoor exposure." };
  if (score >= 20) return { label: "Poor", color: "#ff7e00", advice: "Consider staying indoors. Monitor health symptoms." };
  return { label: "Hazardous", color: "#ff0000", advice: "Avoid outdoor activities. Stay indoors with air purification." };
};

const HealthIndex = ({ weather }) => {
  if (!weather) return null;

  const { score, factors } = getHealthScore(weather);
  const category = getHealthCategory(score);

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      {/* header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiHeart className="text-red-400 animate-pulse" /> Health Index
        </h3>
        <span className="text-xs font-bold px-2.5 py-1.5 rounded-lg text-black" style={{ backgroundColor: category.color }}>
          {category.label}
        </span>
      </div>

      {/* ring + advice */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-20 h-20 shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <path d="M18 2.08 a 15.92 15.92 0 0 1 0 31.83 a 15.92 15.92 0 0 1 0 -31.83" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2.5" />
            <path d="M18 2.08 a 15.92 15.92 0 0 1 0 31.83 a 15.92 15.92 0 0 1 0 -31.83" fill="none" stroke={category.color} strokeWidth="2.5" strokeDasharray={`${score}, 100`} strokeLinecap="round" className="transition-all duration-1000" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-white text-xl font-bold leading-none">{score}</span>
            <span className="text-white/30 text-[9px] mt-0.5">/100</span>
          </div>
        </div>
        <p className="text-white/40 text-xs leading-relaxed">{category.advice}</p>
      </div>

      {/* factor grid */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="glass rounded-lg p-2 text-center">
          <p className="text-white text-xs font-medium">{weather.temp}°</p>
          <p className="text-white/30 text-[10px]">Temp</p>
        </div>
        <div className="glass rounded-lg p-2 text-center">
          <p className="text-white text-xs font-medium">{weather.humidity}%</p>
          <p className="text-white/30 text-[10px]">Humidity</p>
        </div>
        <div className="glass rounded-lg p-2 text-center">
          <p className="text-white text-xs font-medium">{weather.windSpeed}</p>
          <p className="text-white/30 text-[10px]">Wind</p>
        </div>
        <div className="glass rounded-lg p-2 text-center">
          <p className="text-white text-xs font-medium">{weather.visibility ? `${(weather.visibility / 1000).toFixed(1)}km` : "—"}</p>
          <p className="text-white/30 text-[10px]">Visibility</p>
        </div>
        <div className="glass rounded-lg p-2 text-center">
          <p className="text-white text-xs font-medium">{weather.pressure || "—"}</p>
          <p className="text-white/30 text-[10px]">Pressure</p>
        </div>
        <div className="glass rounded-lg p-2 text-center">
          <p className="text-white text-xs font-medium">{weather.main || "—"}</p>
          <p className="text-white/30 text-[10px]">Sky</p>
        </div>
      </div>

      {/* factor contributions */}
      <div className="flex flex-wrap gap-1.5">
        {factors.reduce((acc, f) => {
          if (f.impact !== 0) acc.push(
            <div key={f.label} className="flex items-center gap-1 px-2 py-1 rounded bg-white/[0.04]">
              <span className={`text-[10px] font-bold ${f.impact > 0 ? "text-green-400" : "text-orange-400"}`}>
                {f.impact > 0 ? "+" : ""}{f.impact}
              </span>
              <span className="text-white/40 text-[10px]">{f.label}</span>
            </div>
          );
          return acc;
        }, [])}
        {factors.reduce((acc, f) => f.impact !== 0 ? acc + 1 : acc, 0) === 0 && (
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-green-400/[0.06]">
            <span className="text-green-400 text-[10px] font-medium">All factors positive</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthIndex;

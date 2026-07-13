import { useState, useEffect } from "react";
import { FiHeart } from "react-icons/fi";

const getHealthScore = (weather) => {
  let score = 100;
  if (weather.temp > 40 || weather.temp < 0) score -= 20;
  if (weather.humidity > 85 || weather.humidity < 20) score -= 10;
  if (weather.windSpeed > 25) score -= 10;
  if (weather.visibility < 2000) score -= 10;
  if (weather.pressure && weather.pressure < 1000) score -= 5;
  if (weather.main === "Clear") score += 10;
  return Math.max(0, Math.min(100, score));
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

  const score = getHealthScore(weather);
  const category = getHealthCategory(score);

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiHeart className="text-white" /> Health Index
        </h3>
        <span className="text-xs font-bold px-2.5 py-1.5 rounded-lg text-black" style={{ backgroundColor: category.color }}>
          {category.label}
        </span>
      </div>

      <div className="flex items-center gap-3 mb-3">
        <div className="relative w-16 h-16">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={category.color} strokeWidth="3" strokeDasharray={`${score}, 100`} className="transition-all duration-1000" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-lg font-bold">{score}</span>
          </div>
        </div>
        <div>
          <p className="text-white text-lg font-medium">{category.label}</p>
          <p className="text-white/40 text-xs">{category.advice}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-3">
        <div className="glass rounded-lg p-2 text-center">
          <p className="text-white text-xs font-medium">{weather.temp}°</p>
          <p className="text-white/30 text-[11px]">Temp</p>
        </div>
        <div className="glass rounded-lg p-2 text-center">
          <p className="text-white text-xs font-medium">{weather.humidity}%</p>
          <p className="text-white/30 text-[11px]">Humidity</p>
        </div>
      </div>
    </div>
  );
};

export default HealthIndex;
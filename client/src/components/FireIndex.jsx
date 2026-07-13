import { useState, useEffect } from "react";
import { FiAlertTriangle, FiCheck, FiXOctagon } from "react-icons/fi";

const getFireRisk = (weather) => {
  if (!weather) return 0;
  let risk = 0;
  if (weather.temp > 35) risk += 30;
  else if (weather.temp > 30) risk += 20;
  if (weather.humidity < 30) risk += 20;
  if (weather.windSpeed > 20) risk += 15;
  if (weather.main === "Thunderstorm") risk += 25;
  return Math.min(100, risk);
};

const getFireCategory = (risk) => {
  if (risk <= 20) return { label: "Low", color: "#00e400", icon: <FiCheck size={24} style={{ color: "#00e400" }} className="text-white" />, advice: "Minimal fire risk. Standard precautions apply." };
  if (risk <= 40) return { label: "Moderate", color: "#ffff00", icon: <FiAlertTriangle size={24} style={{ color: "#ffff00" }} className="text-white" />, advice: "Be cautious with open flames and campfires." };
  if (risk <= 60) return { label: "High", color: "#ff7e00", icon: <FiAlertTriangle size={24} style={{ color: "#ff7e00" }} className="text-white" />, advice: "Avoid outdoor burning. Keep fire extinguisher ready." };
  if (risk <= 80) return { label: "Very High", color: "#ff0000", icon: <FiXOctagon size={24} style={{ color: "#ff0000" }} className="text-white" />, advice: "Extreme fire danger! No outdoor fires allowed." };
  return { label: "Extreme", color: "#7e0023", icon: <FiXOctagon size={24} style={{ color: "#7e0023" }} className="text-white" />, advice: "DANGER! Evacuate if told. Highest fire alert level." };
};

const FireIndex = ({ weather }) => {
  if (!weather) return null;

  const risk = getFireRisk(weather);
  const category = getFireCategory(risk);

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider">Fire Risk</h3>
        <span className="text-xs font-bold px-2.5 py-1.5 rounded-lg text-black" style={{ backgroundColor: category.color }}>
          {category.label}
        </span>
      </div>

      <div className="flex items-center gap-3 mb-3">
        <div className="text-3xl">{category.icon}</div>
        <div>
          <p className="text-white text-lg font-medium">{risk}/100</p>
          <p className="text-white/40 text-xs">{category.advice}</p>
        </div>
      </div>

      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-3">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${risk}%`, backgroundColor: category.color }} />
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="glass rounded-lg p-2">
          <p className="text-white text-xs font-medium">{weather.temp}°</p>
          <p className="text-white/30 text-[11px]">Temp</p>
        </div>
        <div className="glass rounded-lg p-2">
          <p className="text-white text-xs font-medium">{weather.humidity}%</p>
          <p className="text-white/30 text-[11px]">Humidity</p>
        </div>
        <div className="glass rounded-lg p-2">
          <p className="text-white text-xs font-medium">{weather.windSpeed}</p>
          <p className="text-white/30 text-[11px]">Wind</p>
        </div>
      </div>
    </div>
  );
};

export default FireIndex;
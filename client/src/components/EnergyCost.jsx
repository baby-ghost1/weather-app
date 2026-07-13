import { useState, useEffect } from "react";
import { FiZap } from "react-icons/fi";

const calcEnergyCost = (weather) => {
  if (!weather) return { totalCost: 0, acHours: 0, heaterHours: 0, fanHours: 0, tip: "" };
  const { temp } = weather;
  let acHours = 0, heaterHours = 0, fanHours = 0;

  if (temp > 25) acHours = Math.min(Math.round((temp - 25) * 0.8), 12);
  if (temp < 15) heaterHours = Math.min(Math.round((15 - temp) * 0.6), 12);
  if (temp >= 20 && temp <= 30) fanHours = 4;

  const totalCost = Math.round(acHours * 12 + heaterHours * 8 + fanHours * 2);
  let tip = "";
  if (acHours > 8) tip = "Consider raising AC to 26°C to save energy.";
  else if (heaterHours > 8) tip = "Use layered clothing to reduce heater dependency.";
  else tip = "Moderate energy usage expected today.";

  return { totalCost, acHours, heaterHours, fanHours, tip };
};

const EnergyCost = ({ weather }) => {
  if (!weather) return null;

  const energy = calcEnergyCost(weather);

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiZap className="text-white" /> Energy Cost
        </h3>
        <span className="text-white/40 text-[11px]">Estimate</span>
      </div>

      <div className="flex items-center gap-3 mb-3">
        <div className="text-3xl"><FiZap className="text-white" /></div>
        <div>
          <p className="text-white text-lg font-medium">~₹{energy.totalCost}/day</p>
          <p className="text-white/40 text-xs">Estimated electricity cost</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="glass rounded-lg p-2 text-center">
          <p className="text-blue-300 text-xs font-medium">{energy.acHours}h</p>
          <p className="text-white/30 text-[11px]">AC Usage</p>
        </div>
        <div className="glass rounded-lg p-2 text-center">
          <p className="text-orange-300 text-xs font-medium">{energy.heaterHours}h</p>
          <p className="text-white/30 text-[11px]">Heater</p>
        </div>
        <div className="glass rounded-lg p-2 text-center">
          <p className="text-cyan-300 text-xs font-medium">{energy.fanHours}h</p>
          <p className="text-white/30 text-[11px]">Fan</p>
        </div>
      </div>

      <p className="text-white/40 text-[11px] text-center">{energy.tip}</p>
    </div>
  );
};

export default EnergyCost;
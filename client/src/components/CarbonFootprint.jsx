import { useState, useEffect } from "react";
import { FiNavigation, FiGlobe, FiCheck } from "react-icons/fi";
import { FaCar, FaCarSide, FaBus, FaTrain, FaPlane, FaMotorcycle } from "react-icons/fa";
import { TbWalk } from "react-icons/tb";
import { getCarbonData } from "../services/api";

const transportIcons = {
  "Car (Petrol)": FaCar,
  "Car (Diesel)": FaCarSide,
  "Bus": FaBus,
  "Train": FaTrain,
  "Flight": FaPlane,
  "Bike": FaMotorcycle,
  "Walking": TbWalk,
};

const CarbonFootprint = ({ weather }) => {
  const [distance, setDistance] = useState(10);
  const [transportModes, setTransportModes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!weather) return;
    setLoading(true);
    getCarbonData(weather, { distance })
      .then((res) => { setTransportModes(res.transport || []); setLoading(false); })
      .catch(() => { setError("Failed to load carbon data"); setLoading(false); });
  }, [weather, distance]);

  if (!weather) return null;
  if (loading) return <div className="glass rounded-2xl p-5 hover-lift animate-scale-in"><div className="shimmer h-4 w-24 rounded mb-3" /><div className="shimmer h-8 w-16 rounded mb-2" /><div className="shimmer h-3 w-40 rounded" /></div>;
  if (error) return <div className="glass rounded-2xl p-5 hover-lift animate-scale-in"><p className="text-red-400 text-xs">{error}</p></div>;

  const maxCO2 = Math.max(...transportModes.map((t) => t.co2), 1);
  const greenest = transportModes.reduce((min, t) => t.co2 < min.co2 ? t : min, transportModes[0] || { co2: Infinity });

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      {/* header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiNavigation className="text-white" /> Carbon Footprint
        </h3>
        <span className="text-white/30 text-[11px]">Estimate</span>
      </div>

      {/* globe + title */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative w-20 h-20 shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2.5" />
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeDasharray={`${Math.min((1 - (greenest.co2 / Math.max(maxCO2, 1))) * 100, 100)}, 100`} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <FiGlobe className="text-green-400 text-xs mb-0.5" />
            <span className="text-white text-sm font-bold leading-none">{greenest.co2}</span>
            <span className="text-white/30 text-[8px]">kg CO₂</span>
          </div>
        </div>
        <div>
          <p className="text-white text-lg font-medium">Travel Emissions</p>
          <p className="text-white/40 text-[11px]">Greenest: {greenest.name}</p>
        </div>
      </div>

      {/* distance slider */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-white/40 text-[11px]">Distance</span>
          <span className="text-white text-sm font-medium">{distance} km</span>
        </div>
        <input
          type="range"
          min="1"
          max="100"
          value={distance}
          onChange={(e) => setDistance(parseInt(e.target.value))}
          className="w-full accent-green-400/60 h-1.5"
        />
      </div>

      {/* transport list */}
      <div className="space-y-2">
        {transportModes.map((t) => {
          const Icon = transportIcons[t.name] || FaCar;
          const isGreenest = t.name === greenest.name;
          return (
            <div key={t.name} className={`flex items-center gap-2.5 p-2 rounded-lg transition-colors ${isGreenest ? "bg-green-400/[0.08] ring-1 ring-green-400/20" : "bg-white/[0.03]"}`}>
              <Icon size={16} className={isGreenest ? "text-green-400" : "text-white/40"} />
              <span className={`text-xs flex-1 ${isGreenest ? "text-green-300 font-medium" : "text-white/60"}`}>{t.name}</span>
              <div className="w-20 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${(t.co2 / maxCO2) * 100}%`, backgroundColor: isGreenest ? "#4ade80" : "#ffffff40" }} />
              </div>
              <span className="text-white text-xs font-medium w-12 text-right">{t.co2} kg</span>
              {isGreenest && <FiCheck size={12} className="text-green-400" />}
            </div>
          );
        })}
      </div>

      <p className="text-white/20 text-[10px] text-center mt-3">*Weather conditions may affect fuel efficiency</p>
    </div>
  );
};

export default CarbonFootprint;

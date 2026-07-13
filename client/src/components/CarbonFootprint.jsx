import { useState, useEffect } from "react";
import { FiNavigation, FiGlobe } from "react-icons/fi";
import { FaCar, FaCarSide, FaBus, FaTrain, FaPlane, FaMotorcycle } from "react-icons/fa";
import { TbWalk } from "react-icons/tb";
import { getCarbonData } from "../services/api";

const transportIcons = {
  "Car (Petrol)": <FaCar className="text-white" />,
  "Car (Diesel)": <FaCarSide className="text-white" />,
  "Bus": <FaBus className="text-white" />,
  "Train": <FaTrain className="text-white" />,
  "Flight": <FaPlane className="text-white" />,
  "Bike": <FaMotorcycle className="text-white" />,
  "Walking": <TbWalk className="text-white" />,
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
      .catch((err) => { setError("Failed to load carbon data"); setLoading(false); });
  }, [weather, distance]);

  if (!weather) return null;
  if (loading) return <div className="glass rounded-2xl p-5 hover-lift animate-scale-in"><p className="text-white/40 text-xs">Loading carbon data...</p></div>;
  if (error) return <div className="glass rounded-2xl p-5 hover-lift animate-scale-in"><p className="text-red-400 text-xs">{error}</p></div>;

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiNavigation className="text-white" /> Carbon Footprint
        </h3>
      </div>

      <div className="flex items-center gap-3 mb-3">
        <div className="text-3xl"><FiGlobe size={28} className="text-white" /></div>
        <div>
          <p className="text-white text-lg font-medium">Travel Emissions</p>
          <p className="text-white/40 text-xs">Estimate CO₂ for your commute</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <input
          type="range"
          min="1"
          max="100"
          value={distance}
          onChange={(e) => setDistance(parseInt(e.target.value))}
          className="flex-1 accent-white/40"
        />
        <span className="text-white text-sm font-medium w-16 text-right">{distance} km</span>
      </div>

      <div className="space-y-2">
        {transportModes.map((t) => {
          const icon = transportIcons[t.name] || <FaCar className="text-white" />;
          return (
            <div key={t.name} className="flex items-center gap-2 p-1.5 rounded-lg bg-white/5">
              <span className="text-sm">{icon}</span>
              <span className="text-white/60 text-xs flex-1">{t.name}</span>
              <span className="text-white text-xs font-medium w-12 text-right">{t.co2} kg</span>
              <span className="text-white/30 text-[11px] w-16 text-right">{t.trees > 0 ? `${t.trees} trees` : "Zero"}</span>
            </div>
          );
        })}
      </div>

      <p className="text-white/30 text-[11px] text-center mt-2">*Weather conditions may affect fuel efficiency</p>
    </div>
  );
};

export default CarbonFootprint;

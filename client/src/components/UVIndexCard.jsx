import { useState, useEffect } from "react";
import { getUVIndex } from "../services/api";

const isNighttime = (sunrise, sunset) => {
  if (!sunrise || !sunset) return false;
  const now = Date.now() / 1000;
  return now < sunrise || now > sunset;
};

const UVIndexCard = ({ lat, lon, sunrise, sunset }) => {
  const [uv, setUv] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!lat || !lon) return;
    setLoading(true);
    setError("");
    getUVIndex(lat, lon).then((res) => { if (res.success) setUv(res.data); else setError("Failed to load UV index."); setLoading(false); }).catch(() => { setError("Failed to load UV index."); setLoading(false); });
  }, [lat, lon]);

  if (loading) return <div className="glass rounded-2xl p-5 animate-scale-in"><div className="shimmer h-4 w-16 rounded mb-3" /><div className="shimmer h-8 w-12 rounded mb-2" /><div className="shimmer h-3 w-40 rounded" /></div>;
  if (error) return <div className="glass rounded-2xl p-5 animate-scale-in"><p className="text-red-300 text-xs">{error}</p></div>;
  if (!uv) return null;

  const night = isNighttime(sunrise, sunset);
  const displayValue = night ? 0 : uv.value;
  const displayLevel = night ? { level: "None", color: "#64748b" } : uv;
  const pct = Math.min((displayValue / 11) * 100, 100);

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider mb-3">UV Index</h3>

      <div className="flex items-end gap-3 mb-3">
        <span className="text-white text-4xl font-light">{displayValue}</span>
        <span className="text-sm font-medium px-2.5 py-1 rounded-full mb-1 text-black" style={{ backgroundColor: displayLevel.color }}>{displayLevel.level}</span>
      </div>

      <div className="w-full h-2 rounded-full overflow-hidden bg-white/10 mb-3">
        <div className="h-full flex">
          <div className="flex-1 bg-green-400" />
          <div className="flex-1 bg-yellow-400" />
          <div className="flex-1 bg-orange-400" />
          <div className="flex-1 bg-red-400" />
          <div className="flex-1 bg-purple-500" />
        </div>
      </div>

      <div className="relative w-full h-4 mb-3">
        <div className="absolute w-3 h-3 bg-white rounded-full shadow-lg top-0.5 transition-all duration-1000" style={{ left: `calc(${pct}% - 6px)` }} />
      </div>

      <p className="text-white/50 text-xs">{night ? "Sun is down — UV index is 0." : uv.advice}</p>
    </div>
  );
};

export default UVIndexCard;

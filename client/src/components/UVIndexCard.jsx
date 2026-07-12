import { useState, useEffect } from "react";
import { getUVIndex } from "../services/api";

const UVIndexCard = ({ lat, lon }) => {
  const [uv, setUv] = useState(null);

  useEffect(() => {
    if (!lat || !lon) return;
    getUVIndex(lat, lon).then((res) => { if (res.success) setUv(res.data); }).catch(() => {});
  }, [lat, lon]);

  if (!uv) return null;

  const pct = Math.min((uv.value / 11) * 100, 100);

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider mb-3">UV Index</h3>

      <div className="flex items-end gap-3 mb-3">
        <span className="text-white text-4xl font-light">{uv.value}</span>
        <span className="text-sm font-medium px-2.5 py-1 rounded-full mb-1 text-black" style={{ backgroundColor: uv.color }}>{uv.level}</span>
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

      <p className="text-white/50 text-xs">{uv.advice}</p>
    </div>
  );
};

export default UVIndexCard;

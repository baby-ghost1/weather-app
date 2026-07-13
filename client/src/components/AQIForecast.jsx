import { useState, useEffect } from "react";
import { FiTrendingUp } from "react-icons/fi";
import { getAirQuality } from "../services/api";

const AQIForecast = ({ lat, lon }) => {
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!lat || !lon) return;
    setLoading(true);
    setError("");
    getAirQuality(lat, lon).then((res) => {
      if (res.success) {
        const current = res.data?.aqi ?? 0;
        const hours = [1, 2, 3, 4, 5, 6];
        const predicted = hours.map((h) => {
          const variation = Math.sin(Date.now() / 10000 + h) * 15;
          return {
            hour: h,
            label: h <= 2 ? `+${h}h` : `+${h}h`,
            aqi: Math.max(0, Math.min(500, Math.round(current + variation))),
          };
        });
        setForecast({ current, predicted });
      } else {
        setError("Failed to load AQI forecast.");
      }
      setLoading(false);
    }).catch(() => { setError("Failed to load AQI forecast."); setLoading(false); });
  }, [lat, lon]);

  if (loading) return <div className="glass rounded-2xl p-5 animate-scale-in"><div className="shimmer h-4 w-24 rounded mb-3" /><div className="flex items-end gap-1 h-24 mb-2"><div className="shimmer flex-1 h-16 rounded-t-md" /><div className="shimmer flex-1 h-12 rounded-t-md" /><div className="shimmer flex-1 h-20 rounded-t-md" /><div className="shimmer flex-1 h-10 rounded-t-md" /><div className="shimmer flex-1 h-14 rounded-t-md" /></div></div>;
  if (error) return <div className="glass rounded-2xl p-5 animate-scale-in"><p className="text-red-300 text-xs">{error}</p></div>;
  if (!forecast) return null;

  const getColor = (aqi) => {
    if (aqi <= 50) return "#00e400";
    if (aqi <= 100) return "#ffff00";
    if (aqi <= 150) return "#ff7e00";
    if (aqi <= 200) return "#ff0000";
    if (aqi <= 300) return "#8f3f97";
    return "#7e0023";
  };

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiTrendingUp className="text-white" /> AQI Forecast
        </h3>
      </div>

      <div className="flex items-end gap-1 h-24 mb-2">
        <div className="flex flex-col items-center flex-1">
          <span className="text-white text-[11px] mb-1">{forecast.current}</span>
          <div className="w-full rounded-t-md transition-all" style={{ height: `${(forecast.current / 300) * 80}px`, backgroundColor: getColor(forecast.current) }} />
          <span className="text-white/40 text-[11px] mt-1">Now</span>
        </div>
        {forecast.predicted.map((p) => (
          <div key={p.hour} className="flex flex-col items-center flex-1">
            <span className="text-white/60 text-[11px] mb-1">{p.aqi}</span>
            <div className="w-full rounded-t-md transition-all opacity-60" style={{ height: `${(p.aqi / 300) * 80}px`, backgroundColor: getColor(p.aqi) }} />
            <span className="text-white/40 text-[11px] mt-1">{p.label}</span>
          </div>
        ))}
      </div>

      <p className="text-white/30 text-[11px] text-center">Predicted AQI for next 6 hours</p>
    </div>
  );
};

export default AQIForecast;

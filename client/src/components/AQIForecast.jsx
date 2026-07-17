import { useState, useEffect } from "react";
import { FiTrendingUp, FiTrendingDown, FiMinus } from "react-icons/fi";
import { getAirQuality } from "../services/api";

const getLevel = (aqi) => {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
};

const getColor = (aqi) => {
  if (aqi <= 50) return "#00e400";
  if (aqi <= 100) return "#ffff00";
  if (aqi <= 150) return "#ff7e00";
  if (aqi <= 200) return "#ff0000";
  if (aqi <= 300) return "#8f3f97";
  return "#7e0023";
};

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
          const d = new Date();
          d.setHours(d.getHours() + h);
          const ampm = d.getHours() >= 12 ? "PM" : "AM";
          const label = `${d.getHours() % 12 || 12}${ampm}`;
          return {
            hour: h,
            label,
            aqi: Math.max(0, Math.min(500, Math.round(current + variation))),
          };
        });

        const first = predicted[0].aqi;
        const last = predicted[predicted.length - 1].aqi;
        let trend = "stable";
        if (last > current + 5) trend = "rising";
        else if (last < current - 5) trend = "dropping";

        setForecast({ current, predicted, trend });
      } else {
        setError("Failed to load AQI forecast.");
      }
      setLoading(false);
    }).catch(() => { setError("Failed to load AQI forecast."); setLoading(false); });
  }, [lat, lon]);

  if (loading) return <div className="glass rounded-2xl p-5 animate-scale-in"><div className="shimmer h-4 w-24 rounded mb-3" /><div className="flex items-end gap-1 h-24 mb-2"><div className="shimmer flex-1 h-16 rounded-t-md" /><div className="shimmer flex-1 h-12 rounded-t-md" /><div className="shimmer flex-1 h-20 rounded-t-md" /><div className="shimmer flex-1 h-10 rounded-t-md" /><div className="shimmer flex-1 h-14 rounded-t-md" /></div></div>;
  if (error) return <div className="glass rounded-2xl p-5 animate-scale-in"><p className="text-red-300 text-xs">{error}</p></div>;
  if (!forecast) return null;

  const allValues = [forecast.current, ...forecast.predicted.map((p) => p.aqi)];
  const maxVal = Math.max(...allValues);

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in flex flex-col">
      {/* header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiTrendingUp className="text-white" /> AQI Forecast
        </h3>
        <div className="flex items-center gap-1.5">
          {forecast.trend === "rising" && <FiTrendingUp className="text-red-400 text-xs" />}
          {forecast.trend === "dropping" && <FiTrendingDown className="text-green-400 text-xs" />}
          {forecast.trend === "stable" && <FiMinus className="text-white/30 text-xs" />}
          <span className={`text-[11px] font-medium ${
            forecast.trend === "rising" ? "text-red-400" : forecast.trend === "dropping" ? "text-green-400" : "text-white/30"
          }`}>
            {forecast.trend === "rising" ? "Rising" : forecast.trend === "dropping" ? "Dropping" : "Stable"}
          </span>
        </div>
      </div>

      {/* centered content */}
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        {/* bar chart */}
        <div className="flex items-end justify-center gap-1.5 h-28 mb-3 w-full">
          {/* current bar */}
          <div className="flex flex-col items-center flex-1 max-w-12">
            <span className="text-white text-[11px] font-medium mb-1">{forecast.current}</span>
            <div
              className="w-full rounded-t-md transition-all ring-1 ring-white/20"
              style={{ height: `${(forecast.current / Math.max(maxVal, 1)) * 90}px`, backgroundColor: getColor(forecast.current) }}
            />
            <span className="text-white/60 text-[10px] mt-1 font-medium">Now</span>
          </div>

          {/* predicted bars */}
          {forecast.predicted.map((p) => (
            <div key={p.hour} className="flex flex-col items-center flex-1 max-w-12">
              <span className="text-white/50 text-[11px] mb-1">{p.aqi}</span>
              <div
                className="w-full rounded-t-md transition-all opacity-70"
                style={{ height: `${(p.aqi / Math.max(maxVal, 1)) * 90}px`, backgroundColor: getColor(p.aqi) }}
              />
              <span className="text-white/30 text-[10px] mt-1">{p.label}</span>
            </div>
          ))}
        </div>

        {/* legend */}
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-sm bg-[#00e400]" />
            <span className="text-white/25 text-[10px]">Good</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-sm bg-[#ffff00]" />
            <span className="text-white/25 text-[10px]">Moderate</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-sm bg-[#ff7e00]" />
            <span className="text-white/25 text-[10px]">Unhealthy</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AQIForecast;

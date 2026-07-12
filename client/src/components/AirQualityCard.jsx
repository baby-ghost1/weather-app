import { useState, useEffect } from "react";
import { getAirQuality } from "../services/api";
import { WiSmoke, WiDust, WiRaindrop, WiHumidity, WiBarometer, WiDaySunny } from "react-icons/wi";

const pollutantIcons = { "PM2.5": WiDust, "PM10": WiSmoke, "O3": WiDaySunny, "NO2": WiRaindrop, "SO2": WiHumidity, "CO": WiBarometer };

const aqiColor = (aqi) => {
  if (aqi <= 50) return "#00e400";
  if (aqi <= 100) return "#ffff00";
  if (aqi <= 150) return "#ff7e00";
  if (aqi <= 200) return "#ff0000";
  if (aqi <= 300) return "#8f3f97";
  return "#7e0023";
};

const AirQualityCard = ({ lat, lon }) => {
  const [aqi, setAqi] = useState(null);

  useEffect(() => {
    if (!lat || !lon) return;
    getAirQuality(lat, lon).then((res) => { if (res.success) setAqi(res.data); }).catch(() => {});
  }, [lat, lon]);

  if (!aqi) return null;

  const barWidth = Math.min((aqi.aqi / 500) * 100, 100);

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider">Air Quality</h3>
        <span className="text-xs font-bold px-2.5 py-1.5 rounded-lg text-black" style={{ backgroundColor: aqi.color }}>
          AQI {aqi.aqi}
        </span>
      </div>

      <p className="text-white text-lg font-medium mb-1">{aqi.level}</p>
      <p className="text-white/50 text-xs mb-4">{aqi.advice}</p>

      <div className="w-full h-3 rounded-full overflow-hidden flex mb-2">
        <div className="bg-[#00e400]" style={{ width: "10%" }} />
        <div className="bg-[#ffff00]" style={{ width: "10%" }} />
        <div className="bg-[#ff7e00]" style={{ width: "10%" }} />
        <div className="bg-[#ff0000]" style={{ width: "10%" }} />
        <div className="bg-[#8f3f97]" style={{ width: "20%" }} />
        <div className="bg-[#7e0023]" style={{ flex: 1 }} />
      </div>

      <div className="relative w-full h-4 mb-4">
        <div className="absolute w-3 h-3 bg-white rounded-full shadow-lg top-0.5 border-2 transition-all duration-700" style={{ left: `calc(${barWidth}% - 6px)`, borderColor: aqi.color }} />
      </div>

      <div className="flex justify-between text-[9px] text-white/30 mb-4 px-0.5">
        <span>0</span><span>50</span><span>100</span><span>150</span><span>200</span><span>300</span><span>500</span>
      </div>

      <p className="text-white/30 text-[10px] uppercase tracking-wider mb-3">
        Dominant: <span className="text-white/60 font-medium">{aqi.dominantPollutant}</span>
      </p>

      <div className="space-y-2">
        {aqi.pollutants.map((p) => {
          const Icon = pollutantIcons[p.name] || WiDust;
          return (
            <div key={p.name} className="flex items-center gap-2">
              <Icon className="text-white/30 text-sm shrink-0" />
              <span className="text-white/40 text-xs w-10">{p.name}</span>
              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min((p.aqi / 300) * 100, 100)}%`, backgroundColor: aqiColor(p.aqi) }} />
              </div>
              <span className="text-white/30 text-[10px] w-8 text-right">{p.aqi}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AirQualityCard;

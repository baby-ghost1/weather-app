import { useState, useEffect } from "react";
import { getAirQuality } from "../services/api";
import { WiSmoke, WiDust, WiRaindrop, WiHumidity, WiBarometer, WiDaySunny } from "react-icons/wi";

const pollutantIcons = { "PM2.5": WiDust, "PM10": WiSmoke, "O3": WiDaySunny, "NO2": WiRaindrop, "SO2": WiHumidity, "CO": WiBarometer };

const pollutantInfo = {
  "PM2.5": { fullName: "Fine Particles", health: "Penetrates deep into lungs, enters bloodstream. Most dangerous pollutant." },
  "PM10": { fullName: "Coarse Particles", health: "Irritates airways, triggers asthma and allergies." },
  "O3": { fullName: "Ozone", health: "Causes coughing, throat irritation, worsens bronchitis and emphysema." },
  "NO2": { fullName: "Nitrogen Dioxide", health: "Inflames airways, increases susceptibility to respiratory infections." },
  "SO2": { fullName: "Sulfur Dioxide", health: "Constricts airways, triggers asthma attacks. Harmful to children and elderly." },
  "CO": { fullName: "Carbon Monoxide", health: "Reduces oxygen delivery to organs. Dangerous at high levels." },
};

const AirQualityCard = ({ lat, lon }) => {
  const [aqi, setAqi] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [selectedPollutant, setSelectedPollutant] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!lat || !lon) return;
    setLoading(true);
    setError("");
    getAirQuality(lat, lon).then((res) => { if (res.success) setAqi(res.data); else setError("Failed to load air quality."); setLoading(false); }).catch(() => { setError("Failed to load air quality."); setLoading(false); });
  }, [lat, lon]);

  if (loading) return <div className="glass rounded-2xl p-5 animate-scale-in"><div className="shimmer h-4 w-24 rounded mb-3" /><div className="shimmer h-8 w-16 rounded mb-2" /><div className="shimmer h-3 w-40 rounded" /></div>;
  if (error) return <div className="glass rounded-2xl p-5 animate-scale-in"><p className="text-red-300 text-xs">{error}</p></div>;
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

      <div className="flex justify-between text-[11px] text-white/30 mb-4 px-0.5">
        <span>0</span><span>50</span><span>100</span><span>150</span><span>200</span><span>300</span><span>500</span>
      </div>

      <p className="text-white/30 text-[11px] uppercase tracking-wider mb-3">
        Dominant: <span className="text-white/60 font-medium">{aqi.dominantPollutant}</span>
      </p>

      <div className="space-y-2">
        {Array.isArray(aqi.pollutants) && aqi.pollutants.map((p) => {
          const Icon = pollutantIcons[p.name] || WiDust;
          const isSelected = selectedPollutant === p.name;
          return (
            <div key={p.name}>
              <button
                onClick={() => setSelectedPollutant(isSelected ? null : p.name)}
                className="flex items-center gap-2 w-full text-left hover:bg-white/5 rounded-lg p-1 -m-1 transition-colors"
              >
                <Icon className="text-white/30 text-sm shrink-0" />
                <span className="text-white/40 text-xs w-10">{p.name}</span>
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min((p.aqi / 300) * 100, 100)}%`, backgroundColor: p.color }} />
                </div>
                <span className="text-white/30 text-[11px] w-8 text-right">{p.aqi}</span>
                <span className="text-white/20 text-[11px] w-12 text-right">{p.level}</span>
              </button>
              {isSelected && pollutantInfo[p.name] && (
                <div className="ml-7 mt-1 mb-2 p-2 bg-white/5 rounded-lg animate-slide-down">
                  <p className="text-white/50 text-[11px] font-medium">{pollutantInfo[p.name].fullName}</p>
                  <p className="text-white/30 text-[11px] mt-0.5">{pollutantInfo[p.name].health}</p>
                  <p className="text-white/40 text-[11px] mt-1">
                    Value: <span className="text-white/60">{p.value} {p.unit}</span>
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AirQualityCard;

import { useState, useEffect } from "react";
import { getAirQuality } from "../services/api";
import { WiSmoke, WiDust, WiRaindrop, WiHumidity, WiBarometer, WiDaySunny } from "react-icons/wi";
import { FiAlertTriangle, FiInfo } from "react-icons/fi";

const pollutantIcons = { "PM2.5": WiDust, "PM10": WiSmoke, "O3": WiDaySunny, "NO2": WiRaindrop, "SO2": WiHumidity, "CO": WiBarometer };

const pollutantInfo = {
  "PM2.5": { fullName: "Fine Particles", health: "Penetrates deep into lungs, enters bloodstream. Most dangerous pollutant." },
  "PM10": { fullName: "Coarse Particles", health: "Irritates airways, triggers asthma and allergies." },
  "O3": { fullName: "Ozone", health: "Causes coughing, throat irritation, worsens bronchitis and emphysema." },
  "NO2": { fullName: "Nitrogen Dioxide", health: "Inflames airways, increases susceptibility to respiratory infections." },
  "SO2": { fullName: "Sulfur Dioxide", health: "Constricts airways, triggers asthma attacks. Harmful to children and elderly." },
  "CO": { fullName: "Carbon Monoxide", health: "Reduces oxygen delivery to organs. Dangerous at high levels." },
};

const getHealthTip = (aqi) => {
  if (aqi <= 50) return { text: "Air quality is satisfactory. Enjoy outdoor activities!", icon: <FiInfo className="text-green-300/60" /> };
  if (aqi <= 100) return { text: "Moderate air quality. Unusually sensitive people should limit prolonged outdoor exertion.", icon: <FiInfo className="text-yellow-300/60" /> };
  if (aqi <= 150) return { text: "Sensitive groups may experience health effects. Limit prolonged outdoor exertion.", icon: <FiAlertTriangle className="text-orange-300/60" /> };
  if (aqi <= 200) return { text: "Everyone may begin to experience health effects. Avoid prolonged outdoor exertion.", icon: <FiAlertTriangle className="text-red-300/60" /> };
  if (aqi <= 300) return { text: "Health alert: everyone may experience serious health effects.", icon: <FiAlertTriangle className="text-purple-300/60" /> };
  return { text: "Health emergency: avoid all outdoor physical activity.", icon: <FiAlertTriangle className="text-red-400/60" /> };
};

const AirQualityCard = ({ lat, lon }) => {
  const [aqi, setAqi] = useState(null);
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
  const healthTip = getHealthTip(aqi.aqi);

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      {/* header: title + AQI badge */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider">Air Quality</h3>
        <span className="text-xs font-bold px-2.5 py-1.5 rounded-lg text-black" style={{ backgroundColor: aqi.color }}>
          AQI {aqi.aqi}
        </span>
      </div>

      {/* big AQI number */}
      <div className="flex items-end gap-3 mb-2">
        <span className="text-5xl font-light leading-none" style={{ color: aqi.color }}>{aqi.aqi}</span>
        <div className="mb-0.5">
          <p className="text-white text-sm font-medium">{aqi.level}</p>
        </div>
      </div>

      {/* health tip */}
      <div className="flex items-start gap-2 p-2.5 rounded-lg bg-white/[0.04] mb-4">
        <span className="shrink-0 mt-0.5">{healthTip.icon}</span>
        <p className="text-white/40 text-[11px] leading-relaxed">{healthTip.text}</p>
      </div>

            {/* color bar with dot + labels */}
      <div className="mb-4">
        <div className="relative w-full h-2 rounded-full overflow-hidden">
          <div className="flex h-full">
            <div className="bg-[#00e400]" style={{ width: "10%" }} />
            <div className="bg-[#ffff00]" style={{ width: "10%" }} />
            <div className="bg-[#ff7e00]" style={{ width: "10%" }} />
            <div className="bg-[#ff0000]" style={{ width: "10%" }} />
            <div className="bg-[#8f3f97]" style={{ width: "20%" }} />
            <div className="bg-[#7e0023]" style={{ flex: 1 }} />
          </div>

          {/* Circular indicator */}
          <div
            className="absolute w-4 h-4 rounded-full bg-white border-2 shadow-lg transition-all duration-700"
            style={{
              left: `calc(${barWidth}% - 8px)`,
              top: "50%",
              transform: "translateY(-50%)",
              borderColor: aqi.color,
            }}
          />
        </div>

        <div className="flex justify-between text-[10px] text-white/25 mt-2 px-0.5">
          <span>Good</span>
          <span>Moderate</span>
          <span>Unhealthy</span>
          <span>Hazardous</span>
        </div>
      </div>

      {/* dominant pollutant */}
      <div className="flex items-center gap-2 mb-3 p-2 rounded-lg bg-white/[0.03]">
        <span className="text-white/30 text-[11px] uppercase tracking-wider">Dominant</span>
        <span className="text-white/70 text-xs font-medium px-2 py-0.5 rounded bg-white/[0.06]">{aqi.dominantPollutant}</span>
      </div>

      {/* pollutant list */}
      <div className="space-y-1">
        {Array.isArray(aqi.pollutants) && aqi.pollutants.map((p) => {
          const Icon = pollutantIcons[p.name] || WiDust;
          const isSelected = selectedPollutant === p.name;
          return (
            <div key={p.name}>
              <button
                onClick={() => setSelectedPollutant(isSelected ? null : p.name)}
                className="flex items-center gap-2 w-full text-left hover:bg-white/[0.04] rounded-lg p-1.5 -m-1.5 transition-colors"
              >
                <Icon className="text-white/25 text-sm shrink-0" />
                <span className="text-white/50 text-xs w-10 shrink-0">{p.name}</span>
                <div className="flex-1 h-1 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min((p.aqi / 300) * 100, 100)}%`, backgroundColor: p.color }} />
                </div>
                <span className="text-white/40 text-[11px] w-8 text-right shrink-0">{p.aqi}</span>
                <span className="text-white/20 text-[10px] w-12 text-right shrink-0">{p.level}</span>
              </button>
              {isSelected && pollutantInfo[p.name] && (
                <div className="ml-7 mt-1 mb-2 p-2.5 bg-white/[0.04] rounded-lg animate-slide-down border border-white/5">
                  <p className="text-white/60 text-[11px] font-medium">{pollutantInfo[p.name].fullName}</p>
                  <p className="text-white/30 text-[11px] mt-1 leading-relaxed">{pollutantInfo[p.name].health}</p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <span className="text-white/25 text-[10px]">Measured:</span>
                    <span className="text-white/50 text-[11px] font-medium">{p.value} {p.unit}</span>
                  </div>
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

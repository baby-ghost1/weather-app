import { useMemo } from "react";
import { FiWatch, FiThermometer, FiDroplet, FiWind, FiEye, FiCloudRain, FiCloudSnow, FiZap } from "react-icons/fi";
import { TbDog } from "react-icons/tb";

const getPetScore = (weather) => {
  if (!weather) return { score: 0, tips: ["No weather data available"], factors: [] };
  let score = 100;
  const tips = [];
  const factors = [];

  if (weather.temp > 35) { score -= 30; tips.push({ text: "Too hot for pets. Walk early morning or late evening.", type: "danger" }); factors.push({ label: "Extreme Heat", value: "-30", color: "#ef4444" }); }
  else if (weather.temp > 30) { score -= 15; tips.push({ text: "Warm weather. Bring water for your pet.", type: "warning" }); factors.push({ label: "Warm Temp", value: "-15", color: "#f97316" }); }
  else if (weather.temp < 5) { score -= 25; tips.push({ text: "Very cold. Consider a coat for short-haired breeds.", type: "danger" }); factors.push({ label: "Extreme Cold", value: "-25", color: "#ef4444" }); }
  else if (weather.temp < 10) { score -= 10; tips.push({ text: "Cool weather. Monitor your pet for shivering.", type: "caution" }); factors.push({ label: "Cool Temp", value: "-10", color: "#fbbf24" }); }
  else { factors.push({ label: "Temperature", value: "OK", color: "#4ade80" }); }

  if (weather.humidity > 80) { score -= 15; tips.push({ text: "High humidity. Avoid strenuous exercise.", type: "warning" }); factors.push({ label: "Humidity", value: "-15", color: "#f97316" }); }
  else { factors.push({ label: "Humidity", value: "OK", color: "#4ade80" }); }

  if (weather.windSpeed > 20) { score -= 10; tips.push({ text: "Strong winds. Keep pets on a secure leash.", type: "caution" }); factors.push({ label: "Wind", value: "-10", color: "#fbbf24" }); }
  else { factors.push({ label: "Wind", value: "OK", color: "#4ade80" }); }

  if (weather.visibility < 2000) { score -= 10; tips.push({ text: "Low visibility. Keep pets close and visible.", type: "caution" }); factors.push({ label: "Visibility", value: "-10", color: "#fbbf24" }); }
  else { factors.push({ label: "Visibility", value: "OK", color: "#4ade80" }); }

  if (weather.main === "Rain") { score -= 10; tips.push({ text: "Rainy weather. Use a pet raincoat if needed.", type: "info" }); factors.push({ label: "Rain", value: "-10", color: "#60a5fa" }); }
  if (weather.main === "Snow") { score -= 20; tips.push({ text: "Snow on ground. Check paws for ice and salt.", type: "warning" }); factors.push({ label: "Snow", value: "-20", color: "#f97316" }); }
  if (weather.main === "Thunderstorm") { score -= 25; tips.push({ text: "Thunderstorm. Keep pets indoors and calm.", type: "danger" }); factors.push({ label: "Storm", value: "-25", color: "#ef4444" }); }

  if (score >= 70 && tips.length === 0) tips.push({ text: "Great conditions for a walk! Enjoy with your pet.", type: "good" });
  if (score < 40) tips.push({ text: "Consider keeping your pet indoors today.", type: "danger" });

  return { score: Math.max(0, Math.min(100, score)), tips, factors };
};

const tipColorMap = {
  good: "bg-green-400/10 text-green-300",
  warning: "bg-orange-400/10 text-orange-300",
  danger: "bg-red-400/10 text-red-300",
  caution: "bg-yellow-400/10 text-yellow-300",
  info: "bg-blue-400/10 text-blue-300",
};

const PetWeather = ({ weather }) => {
  const data = useMemo(() => {
    if (!weather) return null;
    return getPetScore(weather);
  }, [weather]);

  if (!weather || !data) return null;

  const { score, tips, factors } = data;
  const color = score >= 70 ? "#00e400" : score >= 40 ? "#ffff00" : "#ff7e00";
  const label = score >= 70 ? "Great" : score >= 40 ? "Fair" : "Poor";

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      {/* header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiWatch className="text-white" /> Pet Weather
        </h3>
        <span className="text-xs font-bold px-2.5 py-1.5 rounded-lg text-black" style={{ backgroundColor: color }}>{label}</span>
      </div>

      {/* score ring + description */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-20 h-20 shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <path d="M18 2.08 a 15.92 15.92 0 0 1 0 31.83 a 15.92 15.92 0 0 1 0 -31.83" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2.5" />
            <path d="M18 2.08 a 15.92 15.92 0 0 1 0 31.83 a 15.92 15.92 0 0 1 0 -31.83" fill="none" stroke={color} strokeWidth="2.5" strokeDasharray={`${score}, 100`} strokeLinecap="round" className="transition-all duration-1000" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <TbDog className="text-white text-lg mb-0.5" />
            <span className="text-white text-xl font-bold leading-none">{score}</span>
            <span className="text-white/30 text-[9px]">/100</span>
          </div>
        </div>
        <div className="flex-1 grid grid-cols-3 gap-2">
          <div className="glass rounded-lg p-2 text-center">
            <p className="text-white text-sm font-medium">{weather.temp}°</p>
            <p className="text-white/30 text-[10px]">Temp</p>
          </div>
          <div className="glass rounded-lg p-2 text-center">
            <p className="text-white text-sm font-medium">{weather.humidity}%</p>
            <p className="text-white/30 text-[10px]">Humidity</p>
          </div>
          <div className="glass rounded-lg p-2 text-center">
            <p className="text-white text-sm font-medium">{weather.windSpeed}</p>
            <p className="text-white/30 text-[10px]">Wind</p>
          </div>
        </div>
      </div>

      {/* factor breakdown */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {factors.map((f) => (
          <div key={f.label} className="flex items-center gap-1 px-2 py-1 rounded bg-white/[0.04]">
            <span className="text-[10px] font-bold" style={{ color: f.color }}>{f.value}</span>
            <span className="text-white/40 text-[10px]">{f.label}</span>
          </div>
        ))}
      </div>

      {/* tips */}
      <div className="space-y-1.5">
        {tips.map((tip, i) => (
          <div key={tip.text} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg ${tipColorMap[tip.type] || tipColorMap.info}`}>
            <TbDog size={12} />
            <span className="text-[11px]">{tip.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PetWeather;

import { FiWatch } from "react-icons/fi";
import { TbDog } from "react-icons/tb";

const getPetScore = (weather) => {
  if (!weather) return { score: 0, tips: ["No weather data available"] };
  let score = 100;
  const tips = [];

  if (weather.temp > 35) { score -= 30; tips.push("Too hot for pets. Walk early morning or late evening."); }
  else if (weather.temp > 30) { score -= 15; tips.push("Warm weather. Bring water for your pet."); }
  else if (weather.temp < 5) { score -= 25; tips.push("Very cold. Consider a coat for short-haired breeds."); }
  else if (weather.temp < 10) { score -= 10; tips.push("Cool weather. Monitor your pet for shivering."); }

  if (weather.humidity > 80) { score -= 15; tips.push("High humidity. Avoid strenuous exercise."); }
  if (weather.windSpeed > 20) { score -= 10; tips.push("Strong winds. Keep pets on a secure leash."); }
  if (weather.visibility < 2000) { score -= 10; tips.push("Low visibility. Keep pets close and visible."); }
  if (weather.main === "Rain") { score -= 10; tips.push("Rainy weather. Use a pet raincoat if needed."); }
  if (weather.main === "Snow") { score -= 20; tips.push("Snow on ground. Check paws for ice and salt."); }
  if (weather.main === "Thunderstorm") { score -= 25; tips.push("Thunderstorm. Keep pets indoors and calm."); }

  if (score >= 70 && tips.length === 0) tips.push("Great conditions for a walk! Enjoy with your pet.");
  if (score < 40) tips.push("Consider keeping your pet indoors today.");

  return { score: Math.max(0, Math.min(100, score)), tips };
};

const PetWeather = ({ weather }) => {
  if (!weather) return null;

  const { score, tips } = getPetScore(weather);
  const color = score >= 70 ? "#00e400" : score >= 40 ? "#ffff00" : "#ff7e00";
  const label = score >= 70 ? "Great" : score >= 40 ? "Fair" : "Poor";

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiWatch className="text-white" /> Pet Weather
        </h3>
        <span className="text-xs font-bold px-2.5 py-1.5 rounded-lg text-black" style={{ backgroundColor: color }}>{label}</span>
      </div>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl"><TbDog className="text-white" /></span>
        <div>
          <p className="text-white text-lg font-medium">{score}/100</p>
          <p className="text-white/40 text-xs">Dog walking conditions</p>
        </div>
      </div>
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-3">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
      <div className="space-y-1">
        {tips.map((t, i) => (
          <p key={i} className="text-white/50 text-[11px]">• {t}</p>
        ))}
      </div>
    </div>
  );
};

export default PetWeather;
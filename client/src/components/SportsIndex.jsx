import { useMemo } from "react";
import { FiActivity } from "react-icons/fi";
import { TbRun, TbBike, TbWalk, TbYoga, TbSwimming } from "react-icons/tb";

const iconMap = {
  running: <TbRun size={20} className="text-white" />,
  cycling: <TbBike size={20} className="text-white" />,
  cricket: "🏏",
  walking: <TbWalk size={20} className="text-white" />,
  yoga: <TbYoga size={20} className="text-white" />,
  swimming: <TbSwimming size={20} className="text-white" />,
  gym: <FiActivity size={20} className="text-white" />,
};

const scoreColor = (s) => s >= 70 ? "#00e400" : s >= 40 ? "#ffff00" : "#ff7e00";
const scoreLabel = (s) => s >= 70 ? "Good" : s >= 40 ? "Fair" : "Poor";

const sportIcons = { Running: "running", Cycling: "cycling", Walking: "walking", Yoga: "yoga", Swimming: "swimming", Gym: "gym", Cricket: "cricket" };

const getSportsScore = (temp, humidity, windSpeed, main) => {
  let score = 70;
  if (temp >= 18 && temp <= 28) score += 10;
  else if (temp < 10 || temp > 35) score -= 15;
  else if (temp < 15 || temp > 30) score -= 8;
  if (humidity > 60) score -= 5;
  if (windSpeed > 20) score -= 10;
  else if (windSpeed > 10) score -= 3;
  if (["Rain", "Thunderstorm", "Snow"].includes(main)) score -= 30;
  return Math.max(0, Math.min(100, score));
};

const getActivities = (temp, main) => {
  if (main === "Rain" || main === "Thunderstorm" || main === "Snow" || temp > 35) {
    return ["Gym", "Yoga", "Swimming"];
  }
  const outdoor = [];
  if (temp >= 18 && temp <= 28) outdoor.push("Running", "Cycling");
  if (temp >= 15 && temp <= 30) outdoor.push("Walking");
  if (temp >= 20 && temp <= 32) outdoor.push("Cricket");
  if (temp >= 15 && temp <= 35) outdoor.push("Swimming");
  outdoor.push("Yoga");
  return outdoor.length > 0 ? outdoor : ["Yoga", "Walking"];
};

const SportsIndex = ({ weather }) => {
  const data = useMemo(() => {
    if (!weather) return null;
    const score = getSportsScore(weather.temp, weather.humidity, weather.windSpeed, weather.main);
    const issues = [];
    if (weather.temp > 35) issues.push("Extreme heat — avoid prolonged outdoor activity.");
    else if (weather.temp < 10) issues.push("Cold conditions — dress warmly.");
    if (weather.humidity > 60) issues.push("High humidity — stay hydrated.");
    if (weather.windSpeed > 20) issues.push("Strong winds — be cautious.");
    if (["Rain", "Thunderstorm", "Snow"].includes(weather.main)) issues.push(`${weather.main} — prefer indoor activities.`);
    const recommendations = getActivities(weather.temp, weather.main);
    return { score, issues, recommendations };
  }, [weather]);

  if (!weather || !data) return null;

  const { score, issues, recommendations } = data;

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiActivity className="text-white" /> Sports & Outdoor
        </h3>
        <span className="text-xs font-medium" style={{ color: scoreColor(score) }}>{scoreLabel(score)} ({score}%)</span>
      </div>

      {issues.length > 0 && (
        <div className="mb-3 space-y-1">
          {issues.map((msg, i) => <p key={i} className="text-[11px] text-white/40">{msg}</p>)}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {recommendations.map((name) => (
          <span key={name} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-full text-xs text-white/70">
            <span className="text-sm">{iconMap[sportIcons[name]] || sportIcons[name] || "🏃"}</span>
            {name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SportsIndex;

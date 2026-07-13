import { useMemo } from "react";
import { FiActivity } from "react-icons/fi";
import { TbRun, TbBike, TbYoga, TbSwimming, TbWeight, TbWalk } from "react-icons/tb";

const getWorkoutAdvice = (temp, humidity, windSpeed, main) => {
  const issues = [];
  let score = 80;
  if (main === "Thunderstorm") { score -= 40; issues.push("Thunderstorm — exercise indoors."); }
  else if (main === "Snow") { score -= 20; issues.push("Snow — dress warmly, watch for ice."); }
  else if (main === "Rain" || main === "Drizzle") { score -= 10; issues.push("Light rain — okay with waterproof gear."); }
  if (temp > 35) { score -= 25; issues.push("Extreme heat — avoid strenuous activity."); }
  else if (temp > 30) { score -= 15; issues.push("Very hot — exercise in early morning or evening."); }
  else if (temp < 10) { score -= 10; issues.push("Cold — layer up and warm up properly."); }
  if (humidity > 60) { score -= 5; issues.push("High humidity — pace yourself."); }
  if (windSpeed > 20) { score -= 8; issues.push("Strong winds — be careful of debris."); }
  const recommendations = getActivities(temp, main);
  return { score: Math.max(0, score), issues, recommendations };
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

const activityIcons = {
  Running: <TbRun size={16} className="text-white" />,
  Cycling: <TbBike size={16} className="text-white" />,
  Walking: <TbWalk size={16} className="text-white" />,
  Yoga: <TbYoga size={16} className="text-white" />,
  Swimming: <TbSwimming size={16} className="text-white" />,
  Gym: <TbWeight size={16} className="text-white" />,
  Cricket: "🏏",
};

const WorkoutScheduler = ({ weather }) => {
  const data = useMemo(() => {
    if (!weather) return null;
    return getWorkoutAdvice(weather.temp, weather.humidity, weather.windSpeed, weather.main);
  }, [weather]);

  if (!weather) return null;
  if (!data) return null;

  const { score, issues, recommendations } = data;
  const bestTime = score >= 70 ? "Now is a great time" : score >= 40 ? "Early morning or evening" : "Indoor activities recommended";
  const color = score >= 70 ? "#00e400" : score >= 40 ? "#ffff00" : "#ff7e00";

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiActivity className="text-white" /> Workout Scheduler
        </h3>
        <span className="text-xs font-bold px-2 py-1 rounded-lg text-black" style={{ backgroundColor: color }}>{score}/100</span>
      </div>

      <div className="mb-3">
        <p className="text-white/40 text-[11px] mb-1">Best workout time</p>
        <p className="text-white text-xs font-medium">{bestTime}</p>
      </div>

      <div className="space-y-1.5">
        {recommendations.map((name, i) => (
          <div key={i} className="flex items-center gap-2 p-1.5 rounded-lg bg-white/5">
            <span className="text-sm">{activityIcons[name] || <FiActivity size={16} className="text-white" />}</span>
            <span className="text-white/60 text-xs flex-1">{name}</span>
            <span className="text-[11px] px-1.5 py-0.5 rounded bg-green-400/20 text-green-300">
              ✓ Good
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutScheduler;

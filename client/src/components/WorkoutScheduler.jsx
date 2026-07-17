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
  Running: { icon: <TbRun size={16} className="text-white" />, bg: "bg-green-400/15" },
  Cycling: { icon: <TbBike size={16} className="text-white" />, bg: "bg-cyan-400/15" },
  Walking: { icon: <TbWalk size={16} className="text-white" />, bg: "bg-blue-400/15" },
  Yoga: { icon: <TbYoga size={16} className="text-white" />, bg: "bg-purple-400/15" },
  Swimming: { icon: <TbSwimming size={16} className="text-white" />, bg: "bg-blue-400/15" },
  Gym: { icon: <TbWeight size={16} className="text-white" />, bg: "bg-orange-400/15" },
  Cricket: { icon: <span className="text-sm">🏏</span>, bg: "bg-yellow-400/15" },
};

const scoreColor = (s) => s >= 70 ? "#00e400" : s >= 40 ? "#ffff00" : "#ff7e00";

const WorkoutScheduler = ({ weather }) => {
  const data = useMemo(() => {
    if (!weather) return null;
    return getWorkoutAdvice(weather.temp, weather.humidity, weather.windSpeed, weather.main);
  }, [weather]);

  if (!weather) return null;
  if (!data) return null;

  const { score, issues, recommendations } = data;
  const bestTime = score >= 70 ? "Now is a great time" : score >= 40 ? "Early morning or evening" : "Indoor activities recommended";
  const color = scoreColor(score);

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiActivity className="text-white" /> Workout Scheduler
        </h3>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-20 h-20 shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2.5" />
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={color} strokeWidth="2.5" strokeDasharray={`${score}, 100`} strokeLinecap="round" className="transition-all duration-1000" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-white text-xl font-bold leading-none">{score}</span>
            <span className="text-white/30 text-[9px] mt-0.5">/100</span>
          </div>
        </div>
        <div>
          <p className="text-white/60 text-xs font-medium mb-1">Best workout time</p>
          <p className="text-white text-sm font-medium">{bestTime}</p>
        </div>
      </div>

      {issues.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {issues.map((issue, i) => (
            <span key={i} className="text-[10px] px-2 py-1 rounded-full bg-orange-400/10 text-orange-300">
              {issue}
            </span>
          ))}
        </div>
      )}

      <div className="space-y-1.5">
        {recommendations.map((name, i) => {
          const act = activityIcons[name] || { icon: <FiActivity size={16} className="text-white" />, bg: "bg-white/10" };
          return (
            <div key={i} className="flex items-center gap-2.5 p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
              <span className={`w-8 h-8 flex items-center justify-center rounded-lg ${act.bg}`}>
                {act.icon}
              </span>
              <span className="text-white/60 text-xs flex-1">{name}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-400/15 text-green-300">
                Good
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkoutScheduler;

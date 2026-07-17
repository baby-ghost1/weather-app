import { useMemo } from "react";
import { FiActivity } from "react-icons/fi";
import { TbRun, TbBike, TbWalk, TbYoga, TbSwimming } from "react-icons/tb";

const iconMap = {
  running: TbRun,
  cycling: TbBike,
  walking: TbWalk,
  yoga: TbYoga,
  swimming: TbSwimming,
  gym: FiActivity,
  cricket: null,
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

const getActivityScore = (activity, temp, humidity, windSpeed, main) => {
  let s = 80;
  if (activity === "Running") {
    if (temp >= 15 && temp <= 25) s += 10;
    else if (temp > 30) s -= 15;
    if (humidity > 70) s -= 10;
    if (["Rain", "Thunderstorm"].includes(main)) s -= 25;
  } else if (activity === "Cycling") {
    if (temp >= 18 && temp <= 28) s += 10;
    if (windSpeed > 15) s -= 15;
    if (["Rain", "Thunderstorm", "Snow"].includes(main)) s -= 30;
  } else if (activity === "Walking") {
    if (temp >= 15 && temp <= 30) s += 5;
    if (["Thunderstorm", "Snow"].includes(main)) s -= 20;
  } else if (activity === "Cricket") {
    if (temp >= 22 && temp <= 30 && humidity < 70) s += 10;
    if (["Rain", "Thunderstorm"].includes(main)) s -= 35;
    if (windSpeed > 20) s -= 15;
  } else if (activity === "Swimming") {
    if (temp >= 25) s += 10;
    if (["Thunderstorm"].includes(main)) s -= 30;
  } else if (activity === "Yoga") {
    s += 5;
  } else if (activity === "Gym") {
    s += 10;
  }
  return Math.max(0, Math.min(100, s));
};

const getBestTime = (temp) => {
  if (temp > 30) return "Early morning or evening";
  if (temp < 10) return "Afternoon (12–3 PM)";
  return "Now — conditions are ideal";
};

const getActivities = (temp, humidity, windSpeed, main) => {
  const all = ["Running", "Cycling", "Walking", "Cricket", "Swimming", "Yoga", "Gym"];
  return all.map((name) => ({
    name,
    score: getActivityScore(name, temp, humidity, windSpeed, main),
  })).sort((a, b) => b.score - a.score);
};

const SportsIndex = ({ weather }) => {
  const data = useMemo(() => {
    if (!weather) return null;
    const score = getSportsScore(weather.temp, weather.humidity, weather.windSpeed, weather.main);
    const issues = [];
    if (weather.temp > 35) issues.push({ msg: "Extreme heat — avoid prolonged outdoor activity.", color: "bg-red-400/10 text-red-300" });
    else if (weather.temp < 10) issues.push({ msg: "Cold conditions — dress warmly.", color: "bg-blue-400/10 text-blue-300" });
    if (weather.humidity > 60) issues.push({ msg: "High humidity — stay hydrated.", color: "bg-yellow-400/10 text-yellow-300" });
    if (weather.windSpeed > 20) issues.push({ msg: "Strong winds — be cautious.", color: "bg-cyan-400/10 text-cyan-300" });
    if (["Rain", "Thunderstorm", "Snow"].includes(weather.main)) issues.push({ msg: `${weather.main} — prefer indoor activities.`, color: "bg-purple-400/10 text-purple-300" });
    const activities = getActivities(weather.temp, weather.humidity, weather.windSpeed, weather.main);
    const bestTime = getBestTime(weather.temp);
    return { score, issues, activities, bestTime };
  }, [weather]);

  if (!weather || !data) return null;

  const { score, issues, activities, bestTime } = data;

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      {/* header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiActivity className="text-white" /> Sports & Outdoor
        </h3>
        <span className="text-xs font-medium" style={{ color: scoreColor(score) }}>{scoreLabel(score)} ({score}%)</span>
      </div>

      {/* ring + best time */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-20 h-20 shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <path d="M18 2.08 a 15.92 15.92 0 0 1 0 31.83 a 15.92 15.92 0 0 1 0 -31.83" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2.5" />
            <path d="M18 2.08 a 15.92 15.92 0 0 1 0 31.83 a 15.92 15.92 0 0 1 0 -31.83" fill="none" stroke={scoreColor(score)} strokeWidth="2.5" strokeDasharray={`${score}, 100`} strokeLinecap="round" className="transition-all duration-1000" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-white text-xl font-bold leading-none">{score}</span>
            <span className="text-white/30 text-[9px] mt-0.5">/100</span>
          </div>
        </div>
        <div>
          <p className="text-white/60 text-xs font-medium mb-1">Best time to go</p>
          <p className="text-white/40 text-[11px] leading-relaxed">{bestTime}</p>
        </div>
      </div>

      {/* warnings */}
      {issues.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {issues.map((issue, i) => (
            <span key={i} className={`text-[10px] px-2 py-1 rounded-full ${issue.color}`}>
              {issue.msg}
            </span>
          ))}
        </div>
      )}

      {/* activities grid */}
      <div className="grid grid-cols-4 gap-2">
        {activities.map((a) => {
          const color = scoreColor(a.score);
          const Icon = iconMap[sportIcons[a.name]];
          return (
            <div key={a.name} className="flex flex-col items-center gap-1.5 p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
              {a.name === "Cricket" ? (
                <span className="text-lg">🏏</span>
              ) : Icon ? (
                <Icon size={18} style={{ color }} />
              ) : (
                <span className="text-lg">🏃</span>
              )}
              <span className="text-white/50 text-[10px] text-center leading-tight">{a.name}</span>
              <span className="text-[10px] font-medium" style={{ color }}>{a.score}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SportsIndex;

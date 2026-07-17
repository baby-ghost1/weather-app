import { useMemo } from "react";
import { FiBriefcase, FiAlertTriangle, FiAlertCircle, FiInfo, FiCheckCircle } from "react-icons/fi";

const getCommuteAdvice = (temp, humidity, windSpeed, visibility, clouds, main, hour) => {
  const tips = [];
  const isRushHour = (hour >= 7 && hour <= 10) || (hour >= 17 && hour <= 20);

  if (["Rain", "Drizzle"].includes(main)) {
    tips.push({ type: "warning", message: "Rain expected. Allow extra travel time." });
  }
  if (main === "Thunderstorm") {
    tips.push({ type: "danger", message: "Thunderstorm likely. Delay travel if possible." });
  }
  if (visibility < 1000) {
    tips.push({ type: "danger", message: "Very low visibility. Drive with extreme caution." });
  } else if (visibility < 5000) {
    tips.push({ type: "warning", message: "Reduced visibility. Use fog lights if needed." });
  }
  if (temp > 38) {
    tips.push({ type: "warning", message: "Extreme heat. Carry water and avoid midday travel." });
  }
  if (windSpeed > 20) {
    tips.push({ type: "warning", message: "Strong winds. Be careful on bridges and open roads." });
  }
  if (clouds > 80 && main !== "Rain" && main !== "Thunderstorm") {
    tips.push({ type: "info", message: "Overcast skies. Light conditions may be dim." });
  }
  if (isRushHour) {
    tips.push({ type: "info", message: "Rush hour traffic expected. Plan extra travel time." });
  }
  if (main !== "Rain" && main !== "Thunderstorm" && temp <= 35) {
    tips.push({ type: "good", message: "Clear conditions. Good time for travel." });
  }
  if (tips.length === 0) {
    tips.push({ type: "info", message: "Normal traffic conditions expected." });
  }
  return { tips, bestTime: isRushHour ? "Avoid 7-10 AM & 5-8 PM" : "Now is a good time", isRushHour };
};

const getCommuteScore = (temp, humidity, windSpeed, visibility, clouds, main, hour) => {
  let score = 80;
  if (main === "Thunderstorm") score -= 30;
  else if (["Rain", "Drizzle"].includes(main)) score -= 15;
  if (visibility < 1000) score -= 25;
  else if (visibility < 5000) score -= 10;
  if (temp > 38) score -= 15;
  if (windSpeed > 20) score -= 10;
  const isRushHour = (hour >= 7 && hour <= 10) || (hour >= 17 && hour <= 20);
  if (isRushHour) score -= 15;
  if (clouds > 80) score -= 5;
  if (main === "Clear" && temp <= 35 && windSpeed < 20) score += 10;
  return Math.max(0, Math.min(100, score));
};

const getCommuteCategory = (score) => {
  if (score >= 80) return { label: "Excellent", color: "#00e400" };
  if (score >= 60) return { label: "Good", color: "#8BC34A" };
  if (score >= 40) return { label: "Fair", color: "#ffff00" };
  if (score >= 20) return { label: "Poor", color: "#ff7e00" };
  return { label: "Avoid", color: "#ff0000" };
};

const tipIcon = (type) => {
  if (type === "danger") return <FiAlertCircle size={14} className="text-red-400" />;
  if (type === "warning") return <FiAlertTriangle size={14} className="text-orange-400" />;
  if (type === "good") return <FiCheckCircle size={14} className="text-green-400" />;
  return <FiInfo size={14} className="text-blue-400" />;
};

const tipColor = (type) => {
  if (type === "danger") return "bg-red-400/10 text-red-300";
  if (type === "warning") return "bg-orange-400/10 text-orange-300";
  if (type === "good") return "bg-green-400/10 text-green-300";
  return "bg-blue-400/10 text-blue-300";
};

const CommutePlanner = ({ weather }) => {
  const data = useMemo(() => {
    if (!weather) return null;
    const currentHour = new Date().getHours();
    return getCommuteAdvice(weather.temp, weather.humidity, weather.windSpeed, weather.visibility, weather.clouds || 0, weather.main, currentHour);
  }, [weather]);

  const score = useMemo(() => {
    if (!weather) return null;
    const currentHour = new Date().getHours();
    return getCommuteScore(weather.temp, weather.humidity, weather.windSpeed, weather.visibility, weather.clouds || 0, weather.main, currentHour);
  }, [weather]);

  if (!weather) return null;
  if (!data) return null;

  const { tips, bestTime, isRushHour } = data;
  const category = score !== null ? getCommuteCategory(score) : null;

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiBriefcase className="text-white" /> Commute Planner
        </h3>
        {category && (
          <span className="text-xs font-bold px-2.5 py-1.5 rounded-lg text-black" style={{ backgroundColor: category.color }}>
            {category.label}
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 mb-4">
        {score !== null && (
          <div className="relative w-20 h-20 shrink-0">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <path d="M18 2.08 a 15.92 15.92 0 0 1 0 31.83 a 15.92 15.92 0 0 1 0 -31.83" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2.5" />
              <path d="M18 2.08 a 15.92 15.92 0 0 1 0 31.83 a 15.92 15.92 0 0 1 0 -31.83" fill="none" stroke={category.color} strokeWidth="2.5" strokeDasharray={`${score}, 100`} strokeLinecap="round" className="transition-all duration-1000" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-white text-xl font-bold leading-none">{score}</span>
              <span className="text-white/30 text-[9px] mt-0.5">/100</span>
            </div>
          </div>
        )}
        <div className="flex-1">
          <p className="text-white/40 text-[11px] mb-1">Best time to leave</p>
          <p className="text-white text-sm font-medium">{bestTime}</p>
          {isRushHour && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
              <span className="text-orange-300 text-[11px] font-medium">Rush hour active</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {tips.map((tip, i) => (
          <div key={tip.message} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] ${tipColor(tip.type)}`}>
            {tipIcon(tip.type)}
            <span>{tip.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommutePlanner;

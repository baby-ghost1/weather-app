import { useMemo } from "react";
import { FiBriefcase } from "react-icons/fi";

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

const CommutePlanner = ({ weather }) => {
  const data = useMemo(() => {
    if (!weather) return null;
    const currentHour = new Date().getHours();
    return getCommuteAdvice(weather.temp, weather.humidity, weather.windSpeed, weather.visibility, weather.clouds || 0, weather.main, currentHour);
  }, [weather]);

  if (!weather) return null;
  if (!data) return null;

  const { tips, bestTime, isRushHour } = data;

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiBriefcase className="text-white" /> Commute Planner
        </h3>
        {isRushHour && <span className="text-[11px] bg-orange-400/20 text-orange-300 px-2 py-0.5 rounded-full">Rush Hour</span>}
      </div>

      <div className="mb-3">
        <p className="text-white/40 text-[11px] mb-1">Best time to leave</p>
        <p className="text-white text-sm font-medium">{bestTime}</p>
      </div>

      <div className="space-y-2">
        {tips.map((tip, i) => (
          <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
            <span className="text-white/60 text-xs">{tip.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommutePlanner;

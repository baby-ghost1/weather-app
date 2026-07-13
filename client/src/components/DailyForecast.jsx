import { WiRaindrop } from "react-icons/wi";
import { useUnit } from "../context/UnitContext";
import WeatherIcon from "./WeatherIcon";

const getDayName = (dateStr) => {
  const date = new Date(dateStr + "T00:00:00");
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
  return date.toLocaleDateString("en-US", { weekday: "short" });
};

const getDayShort = (dateStr) => {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
};

const DailyForecast = ({ daily }) => {
  const { tempUnit } = useUnit();
  if (!daily?.length) return null;

  const allTemps = daily.flatMap((d) => [d.tempMin, d.tempMax]);
  const globalMin = Math.min(...allTemps);
  const globalMax = Math.max(...allTemps);
  const padding = Math.max(5, (globalMax - globalMin) * 0.2);
  const rangeMin = globalMin - padding;
  const rangeMax = globalMax + padding;
  const range = rangeMax - rangeMin;

  const barStyle = (tempMin, tempMax) => ({
    left: `${((tempMin - rangeMin) / range) * 100}%`,
    right: `${100 - ((tempMax - rangeMin) / range) * 100}%`,
  });

  return (
    <div className="w-full animate-slide-up" style={{ animationDelay: "0.3s" }}>
      <h3 className="text-white/50 text-xs font-medium mb-3 uppercase tracking-wider">7-Day Forecast</h3>
      <div className="glass rounded-2xl overflow-hidden">
        {daily.map((day, i) => (
          <div key={i} className={`flex items-center gap-4 px-4 py-3 ${i !== daily.length - 1 ? "border-b border-white/5" : ""} hover:bg-white/5 transition-colors`}>
            <div className="w-20 shrink-0">
              <p className="text-white text-sm font-medium">{getDayName(day.date)}</p>
              <p className="text-white/30 text-[11px]">{getDayShort(day.date)}</p>
            </div>

            <WeatherIcon main={day.weather} size="text-2xl" />

            <div className="flex-1 flex items-center gap-2">
              <span className="text-white/40 text-xs w-8 text-right">{day.tempMin}°</span>
              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden relative">
                <div
                  className="absolute h-full rounded-full"
                  style={{
                    ...barStyle(day.tempMin, day.tempMax),
                    background: `linear-gradient(90deg, #60a5fa, #f97316)`,
                  }}
                />
              </div>
              <span className="text-white text-sm font-medium w-8">{day.tempMax}°</span>
            </div>

            <div className="flex items-center gap-1 w-14 shrink-0 justify-end">
              {day.pop > 0 ? (
                <>
                  <WiRaindrop className="text-blue-300 text-sm" />
                  <span className="text-blue-300 text-xs">{day.pop}%</span>
                </>
              ) : (
                <span className="text-white/20 text-xs">-</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyForecast;

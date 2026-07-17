import { WiRaindrop, WiStrongWind, WiHumidity } from "react-icons/wi";
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
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const getTempColor = (temp) => {
  if (temp <= 5) return "#60a5fa";
  if (temp <= 15) return "#38bdf8";
  if (temp <= 25) return "#34d399";
  if (temp <= 35) return "#fbbf24";
  if (temp <= 40) return "#f97316";
  return "#ef4444";
};

const DailyForecast = ({ daily }) => {
  const { tempUnit } = useUnit();
  if (!daily?.length) return null;

  const allTemps = daily.flatMap((d) => [d.tempMin, d.tempMax]);
  const globalMin = Math.min(...allTemps);
  const globalMax = Math.max(...allTemps);
  const padding = Math.max(5, (globalMax - globalMin) * 0.15);
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
        {daily.map((day, i) => {
          const isToday = getDayName(day.date) === "Today";
          const isTomorrow = getDayName(day.date) === "Tomorrow";
          const isHighlighted = isToday || isTomorrow;

          return (
            <div key={day.date} className={`px-4 py-3.5 ${i !== daily.length - 1 ? "border-b border-white/5" : ""} ${isHighlighted ? "bg-white/[0.04]" : "hover:bg-white/[0.03]"} transition-colors`}>
              {/* top row: day + icon + rain */}
              <div className="flex items-center gap-3 mb-2">
                <div className="w-24 shrink-0">
                  <p className={`text-sm font-medium ${isToday ? "text-blue-300" : isTomorrow ? "text-white/80" : "text-white/70"}`}>
                    {getDayName(day.date)}
                  </p>
                  <p className="text-white/25 text-[10px]">{getDayShort(day.date)}</p>
                </div>

                <WeatherIcon main={day.weather} size="text-xl" />

                <p className="text-white/40 text-[11px] capitalize flex-1 min-w-0 truncate">{day.description}</p>

                <div className="flex items-center gap-3 shrink-0 text-[11px]">
                  {day.pop > 0 && (
                    <span className="flex items-center gap-1 text-blue-300/80">
                      <WiRaindrop className="text-sm" />{day.pop}%
                    </span>
                  )}
                  {day.rain > 0 && (
                    <span className="text-blue-400/60">{day.rain}mm</span>
                  )}
                </div>
              </div>

              {/* bottom row: temp bar + details */}
              <div className="flex items-center gap-3 pl-0">
                <div className="w-24 shrink-0 flex items-baseline gap-1">
                  <span className="text-white/35 text-xs">{day.tempMin}°</span>
                  <span className="text-white/15 text-[10px]">—</span>
                  <span className="text-white text-sm font-medium">{day.tempMax}°</span>
                </div>

                <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden relative">
                  <div
                    className="absolute h-full rounded-full transition-all duration-500"
                    style={{
                      ...barStyle(day.tempMin, day.tempMax),
                      background: `linear-gradient(90deg, ${getTempColor(day.tempMin)}, ${getTempColor(day.tempMax)})`,
                    }}
                  />
                </div>

                <div className="w-20 shrink-0 flex items-center justify-end gap-2 text-[10px] text-white/25">
                  <span className="flex items-center gap-0.5"><WiHumidity className="text-[11px]" />{day.humidity}%</span>
                  <span className="flex items-center gap-0.5"><WiStrongWind className="text-[11px]" />{day.windSpeed}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DailyForecast;

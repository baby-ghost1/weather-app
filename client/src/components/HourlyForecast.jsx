import { WiDaySunny, WiCloud, WiRain, WiSnow, WiDayHaze, WiThunderstorm } from "react-icons/wi";
import { useUnit } from "../context/UnitContext";

const iconMap = {
  Clear: WiDaySunny, Clouds: WiCloud, Rain: WiRain, Drizzle: WiRain,
  Snow: WiSnow, Thunderstorm: WiThunderstorm, Haze: WiDayHaze,
};

const iconColors = {
  Clear: "text-yellow-300", Clouds: "text-gray-200", Rain: "text-blue-300",
  Drizzle: "text-blue-200", Snow: "text-white", Thunderstorm: "text-yellow-400",
};

const WeatherIcon = ({ main, size = "text-5xl" }) => {
  const key = ["Mist", "Haze", "Fog"].includes(main) ? "Haze" : main;
  const Icon = iconMap[key] || WiDaySunny;
  return <Icon className={`${size} ${iconColors[key] || iconColors.Clear} drop-shadow-lg`} />;
};

const getDayName = (dateStr) => {
  const date = new Date(dateStr + "T00:00:00");
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
  return date.toLocaleDateString("en-US", { weekday: "short" });
};

const HourlyForecast = ({ forecast }) => {
  const { tempUnit } = useUnit();
  if (!forecast?.length) return null;

  return (
    <div className="w-full animate-slide-up" style={{ animationDelay: "0.2s" }}>
      <h3 className="text-white/50 text-xs font-medium mb-3 uppercase tracking-wider">5-Day Forecast</h3>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {forecast.map((day, i) => (
          <div key={i} className="glass shrink-0 rounded-2xl p-4 min-w-[100px] flex flex-col items-center gap-2 hover-lift cursor-default">
            <p className="text-white/60 text-xs font-medium">{getDayName(day.date)}</p>
            <WeatherIcon main={day.weather} size="text-4xl" />
            <div className="text-center">
              <p className="text-white text-lg font-medium">{day.tempMax}{tempUnit}</p>
              <p className="text-white/40 text-xs">{day.tempMin}{tempUnit}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyForecast;

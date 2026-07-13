import { WiRaindrop } from "react-icons/wi";
import { useUnit } from "../context/UnitContext";
import WeatherIcon from "./WeatherIcon";
import { formatHour, isNow } from "../utils/format";

const HourlyForecast = ({ hourly }) => {
  const { tempUnit } = useUnit();
  if (!hourly?.length) return null;

  const upcoming = hourly.slice(0, 12);

  return (
    <div className="w-full animate-slide-up" style={{ animationDelay: "0.2s" }}>
      <h3 className="text-white/50 text-xs font-medium mb-3 uppercase tracking-wider">Hourly Forecast</h3>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {upcoming.map((h, i) => (
          <div key={i} className={`glass shrink-0 rounded-2xl p-3 min-w-[85px] flex flex-col items-center gap-1.5 hover-lift cursor-default ${isNow(h.dtTxt) ? "ring-1 ring-white/30" : ""}`}>
            <p className="text-white/60 text-[11px] font-medium">{i === 0 ? "Now" : formatHour(h.dtTxt)}</p>
            <WeatherIcon main={h.weather} />
            <p className="text-white text-sm font-medium">{h.temp}{tempUnit}</p>
            {h.pop > 0 && (
              <div className="flex items-center gap-0.5">
                <WiRaindrop className="text-blue-300 text-xs" />
                <span className="text-blue-300 text-[11px]">{h.pop}%</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyForecast;

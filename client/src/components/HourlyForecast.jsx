import { WiRaindrop } from "react-icons/wi";
import { useUnit } from "../context/UnitContext";
import WeatherIcon from "./WeatherIcon";
import { formatHour, isNow } from "../utils/format";

const HourlyForecast = ({ hourly }) => {
  const { tempUnit } = useUnit();
  if (!hourly?.length) return null;

  const upcoming = hourly.slice(0, 12);

  return (
    <div className="w-full glass rounded-2xl p-5 animate-slide-up" style={{ animationDelay: "0.2s" }}>
      <h3 className="text-white/50 text-xs font-medium mb-4 uppercase tracking-wider">Hourly Forecast</h3>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {upcoming.map((h, i) => (
          <div key={i} className={`glass shrink-0 rounded-2xl p-3 min-w-[85px] flex flex-col items-center gap-1.5 hover-lift cursor-default ${isNow(h.dtTxt) ? "ring-1 ring-white/30 bg-white/[0.06]" : ""}`}>
            <p className={`text-[11px] font-medium ${isNow(h.dtTxt) ? "text-white" : "text-white/60"}`}>{i === 0 ? "Now" : formatHour(h.dtTxt)}</p>
            <WeatherIcon main={h.weather} />
            <p className="text-white text-sm font-medium">{Math.round(h.temp)}{tempUnit}</p>
            {h.pop > 0 && (
              <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-blue-400/10">
                <WiRaindrop className="text-blue-300 text-xs" />
                <span className="text-blue-300 text-[10px]">{h.pop}%</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyForecast;

import { WiDaySunny, WiCloud, WiRain, WiSnow, WiDayHaze, WiStrongWind, WiThunderstorm, WiFog } from "react-icons/wi";
import { useUnit } from "../context/UnitContext";

const iconMap = {
  Clear: WiDaySunny, Clouds: WiCloud, Rain: WiRain, Drizzle: WiRain,
  Snow: WiSnow, Mist: WiDayHaze, Haze: WiDayHaze, Fog: WiDayHaze,
  Thunderstorm: WiThunderstorm, Smoke: WiFog, Dust: WiFog, Ash: WiFog,
  Squall: WiStrongWind, Tornado: WiStrongWind,
};

const WeatherCard = ({ weather }) => {
  const { tempUnit } = useUnit();

  if (!weather) return null;

  const Icon = iconMap[weather.main] || WiDaySunny;
  const iconColors = {
    Clear: "text-yellow-300", Clouds: "text-gray-200", Rain: "text-blue-300",
    Drizzle: "text-blue-200", Snow: "text-white", Haze: "text-gray-300",
    Thunderstorm: "text-yellow-400", default: "text-yellow-300",
  };
  const iconColor = iconColors[weather.main] || iconColors.default;

  return (
    <div className="text-white text-center animate-fade-in">
      <div className="animate-float">
        <Icon className={`${iconColor} text-[140px] drop-shadow-2xl leading-none`} />
      </div>
      <h1 className="text-8xl font-light tracking-tight mt-2 gradient-text">
        {weather.temp}{tempUnit}
      </h1>
      <p className="text-white/50 text-sm mt-1">Feels like {weather.feelsLike}{tempUnit}</p>
      <h2 className="text-2xl font-normal mt-2 text-white/90">{weather.city}, {weather.country}</h2>
      <div className="inline-block mt-3">
        <span className="glass rounded-full px-4 py-1.5 text-sm text-white/80 capitalize">{weather.description}</span>
      </div>
    </div>
  );
};

export default WeatherCard;

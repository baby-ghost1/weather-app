import { useUnit } from "../context/UnitContext";
import { iconMap, iconColors } from "../constants/weatherIcons";

const WeatherCard = ({ weather }) => {
  const { tempUnit } = useUnit();

  if (!weather) return null;

  const Icon = iconMap[weather.main] || iconMap.Clear;
  const iconColor = iconColors[weather.main] || iconColors.Clear;

  return (
    <div className="text-white text-center animate-fade-in">
      <div className="animate-float">
        <Icon className={`${iconColor} text-[140px] drop-shadow-2xl leading-none`} />
      </div>
      <h1 className="text-8xl font-light tracking-tight mt-2 text-gradient-animated">
        {weather.temp}{tempUnit}
      </h1>
      <p className="text-white/50 text-sm mt-1">Feels like {weather.feelsLike}{tempUnit}</p>
      <h2 className="text-2xl font-normal mt-2 text-white/90">{weather.city}, {weather.country}</h2>
      <div className="inline-block mt-3">
        <span className="glass rounded-full px-4 py-1.5 text-sm text-white/80 capitalize pulse-glow">{weather.description}</span>
      </div>
    </div>
  );
};

export default WeatherCard;

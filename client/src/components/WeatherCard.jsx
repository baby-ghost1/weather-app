import { useUnit } from "../context/UnitContext";
import { iconMap, iconColors } from "../constants/weatherIcons";

const animMap = {
  Clear: "floatSlow 8s ease-in-out infinite",
  Clouds: "float 6s ease-in-out infinite",
  Rain: "rainShake 1.5s ease-in-out infinite",
  Drizzle: "rainShake 2s ease-in-out infinite",
  Snow: "snowDrift 6s ease-in-out infinite",
  Thunderstorm: "thunderFlash 3s ease-in-out infinite",
  Mist: "floatSlow 10s ease-in-out infinite",
  Haze: "floatSlow 10s ease-in-out infinite",
  Fog: "floatSlow 10s ease-in-out infinite",
  Wind: "windSway 3s ease-in-out infinite",
  Squall: "windSway 2s ease-in-out infinite",
  Tornado: "windSway 1.5s ease-in-out infinite",
};

const WeatherCard = ({ weather }) => {
  const { tempUnit } = useUnit();

  if (!weather) return null;

  const Icon = iconMap[weather.main] || iconMap.Clear;
  const iconColor = iconColors[weather.main] || iconColors.Clear;
  const anim = animMap[weather.main] || "float 6s ease-in-out infinite";

  return (
    <div className="text-white text-center animate-fade-in">
      <div style={{ animation: anim }}>
        <Icon className={`${iconColor} text-[140px] drop-shadow-2xl leading-none`} />
      </div>
      <h1 className="text-8xl font-light tracking-tight mt-2 text-gradient-animated">
        {weather.temp}{tempUnit}
      </h1>
      <p className="text-white/50 text-sm mt-1">Feels like {weather.feelsLike}{tempUnit}</p>
      <h2 className="text-2xl font-normal mt-2 text-white/90">
        {weather.city}{weather.state ? `, ${weather.state}` : ""}, {weather.country}
      </h2>
      <div className="inline-block mt-3">
        <span className="glass rounded-full px-4 py-1.5 text-sm text-white/80 capitalize pulse-glow">{weather.description}</span>
      </div>
    </div>
  );
};

export default WeatherCard;

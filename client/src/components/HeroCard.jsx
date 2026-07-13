import { useState, useEffect } from "react";
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

const HeroCard = ({ weather, isFavorite, onToggleFavorite }) => {
  const { tempUnit } = useUnit();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!weather) return null;

  const Icon = iconMap[weather.main] || iconMap.Clear;
  const iconColor = iconColors[weather.main] || iconColors.Clear;
  const anim = animMap[weather.main] || "float 6s ease-in-out infinite";

  const glowColor =
    weather.main === "Clear" ? "#fbbf24" :
    weather.main === "Rain" || weather.main === "Drizzle" ? "#3b82f6" :
    weather.main === "Thunderstorm" ? "#a855f7" :
    weather.main === "Snow" ? "#e2e8f0" :
    "#94a3b8";

  return (
    <div className="glass rounded-3xl p-8 sm:p-10 animate-fade-in relative overflow-hidden max-w-xl w-full mx-auto">
      {/* ambient glow */}
      <div
        className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full opacity-[0.07] blur-3xl pointer-events-none"
        style={{ background: `radial-gradient(circle, ${glowColor}, transparent)` }}
      />

      {/* top row: time + favorite */}
      <div className="flex items-start justify-between mb-8 relative z-10">
        <div>
          <p className="text-4xl sm:text-5xl font-extralight tracking-wider text-white">
            {time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}
          </p>
          <p className="text-xs text-white/40 mt-1 tracking-wide">
            {time.toLocaleDateString("en-US", { weekday: "long" })} · {time.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </p>
        </div>
        <button
          onClick={onToggleFavorite}
          className="p-2.5 rounded-2xl hover:bg-white/10 transition-all group -mt-1 -mr-1"
          title={isFavorite ? "Remove from favorites" : "Save to favorites"}
        >
          <span className={`text-3xl block transition-all group-hover:scale-110 ${isFavorite ? "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]" : "text-white/25"}`}>
            {isFavorite ? "★" : "☆"}
          </span>
        </button>
      </div>

      {/* center: icon + temp */}
      <div className="flex flex-col items-center gap-2 mb-6 relative z-10">
        <div style={{ animation: anim }} className="mb-1">
          <Icon className={`${iconColor} text-[100px] sm:text-[130px] drop-shadow-2xl leading-none`} />
        </div>
        <h1 className="text-8xl sm:text-9xl font-extralight tracking-tighter text-white leading-none">
          {weather.temp}<span className="text-8xl sm:text-9xl text-white/30 font-extralight -translate-y-3 inline-block ml-1">{tempUnit}</span>
        </h1>
        <p className="text-white/40 text-sm font-light">
          Feels like {weather.feelsLike}{tempUnit}
        </p>
      </div>

      {/* divider */}
      <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto mb-5 relative z-10" />

      {/* location + description */}
      <div className="text-center relative z-10">
        <h2 className="text-base sm:text-lg font-medium text-white/85 tracking-wide">
          {weather.city}{weather.state ? <>, <span className="text-white/60">{weather.state}</span></> : ""}, <span className="text-white/50">{weather.country}</span>
        </h2>
        <div className="inline-block mt-2.5">
          <span className="glass rounded-full px-5 py-1.5 text-xs text-white/60 capitalize tracking-wider">
            {weather.description}
          </span>
        </div>
      </div>
    </div>
  );
};

export default HeroCard;

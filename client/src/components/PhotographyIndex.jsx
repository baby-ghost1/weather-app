import { useMemo } from "react";
import { FiCamera, FiSunrise, FiSunset, FiSun, FiMoon, FiCloud } from "react-icons/fi";
import { formatTime } from "../utils/format";

const getPhotographyAdvice = (clouds, main) => {
  if (clouds > 70) return { rating: "good", tip: "Overcast — great for soft, diffused light and portraits." };
  if (clouds > 40) return { rating: "great", tip: "Partial clouds — dramatic skies possible." };
  return { rating: "fair", tip: "Clear sky — harsh light, use ND filters. Best at golden hour." };
};

const PhotographyIndex = ({ weather }) => {
  const data = useMemo(() => {
    if (!weather?.sunrise || !weather?.sunset) return null;
    const now = Date.now() / 1000;
    const sunrise = weather.sunrise;
    const sunset = weather.sunset;
    const daylight = sunset - sunrise;
    const goldenHourDuration = daylight * 0.1;
    const blueHourDuration = daylight * 0.05;

    const goldenHourMorning = sunrise + blueHourDuration;
    const blueHourMorning = sunrise;
    const solarNoon = (sunrise + sunset) / 2;
    const goldenHourEvening = sunset - goldenHourDuration;
    const blueHourEvening = sunset - blueHourDuration;

    const times = {
      goldenHourMorning: goldenHourMorning * 1000,
      blueHourMorning: blueHourMorning * 1000,
      solarNoon: solarNoon * 1000,
      goldenHourEvening: goldenHourEvening * 1000,
      blueHourEvening: blueHourEvening * 1000,
    };

    const advice = getPhotographyAdvice(weather.clouds || 0, weather.main);
    return { times, lightAdvice: advice.tip };
  }, [weather]);

  if (!weather?.sunrise || !weather?.sunset) return null;
  if (!data) return null;

  const now = new Date();

  const getTimeStatus = (time) => {
    const diff = new Date(time) - now;
    if (diff > 0 && diff < 60 * 60 * 1000) return { label: "Starting Soon", color: "#ff9800" };
    if (diff > 0) return { label: `In ${Math.round(diff / 60000)} min`, color: "#4caf50" };
    return { label: "Passed", color: "#666" };
  };

  const { times, lightAdvice } = data;

  const shots = [
    { name: "Golden Hour (AM)", time: times.goldenHourMorning, icon: <FiSunrise size={20} className="text-white" /> },
    { name: "Blue Hour (AM)", time: times.blueHourMorning, icon: <FiSunset size={20} className="text-white" /> },
    { name: "Solar Noon", time: times.solarNoon, icon: <FiSun size={20} className="text-white" /> },
    { name: "Golden Hour (PM)", time: times.goldenHourEvening, icon: <FiSunset size={20} className="text-white" /> },
    { name: "Blue Hour (PM)", time: times.blueHourEvening, icon: <FiMoon size={20} className="text-white" /> },
  ];

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiCamera className="text-white" /> Photography
        </h3>
      </div>

      <div className="space-y-2">
        {shots.map((shot) => {
          const status = getTimeStatus(shot.time);
          const isNear = (shot.time - now) > 0 && (shot.time - now) < 60 * 60 * 1000;

          return (
            <div key={shot.name} className={`flex items-center gap-3 p-2 rounded-lg ${isNear ? "bg-white/10" : ""}`}>
              <span className="text-lg">{shot.icon}</span>
              <div className="flex-1">
                <p className="text-white/70 text-xs">{shot.name}</p>
                <p className="text-white text-sm font-medium">{formatTime(shot.time)}</p>
              </div>
              <span className="text-[11px] font-medium" style={{ color: status.color }}>{status.label}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-3 p-2 glass rounded-lg">
        <p className="text-white/30 text-[11px] text-center">{lightAdvice}</p>
      </div>
    </div>
  );
};

export default PhotographyIndex;

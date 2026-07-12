import { useMemo } from "react";

const bgMap = {
  Clear: "bg-weather-clear", Clouds: "bg-weather-clouds",
  Rain: "bg-weather-rain", Drizzle: "bg-weather-drizzle",
  Snow: "bg-weather-snow", Thunderstorm: "bg-weather-thunderstorm",
  Mist: "bg-weather-mist", Haze: "bg-weather-mist", Fog: "bg-weather-mist",
};

const WeatherBackground = ({ weatherMain }) => {
  const bgClass = bgMap[weatherMain] || "bg-weather-clear";

  const rainDrops = useMemo(() =>
    Array.from({ length: 80 }, (_, i) => ({
      id: i, left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 2}s`,
      duration: `${0.5 + Math.random() * 0.5}s`,
      height: `${15 + Math.random() * 20}px`,
    })), []
  );

  const snowFlakes = useMemo(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i, left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${3 + Math.random() * 4}s`,
      size: `${4 + Math.random() * 6}px`,
    })), []
  );

  const clouds = useMemo(() => [
    { size: "text-8xl", top: "top-[10%]", delay: "0s", dur: "25s" },
    { size: "text-6xl", top: "top-[30%]", delay: "-10s", dur: "35s" },
    { size: "text-7xl", top: "top-[60%]", delay: "-20s", dur: "30s" },
  ], []);

  return (
    <div className={`fixed inset-0 transition-all duration-1000 ${bgClass}`}>
      {weatherMain === "Clear" && <div className="sun-glow" />}

      {(weatherMain === "Rain" || weatherMain === "Drizzle") && (
        <div className="rain-container">
          {rainDrops.map((d) => (
            <div key={d.id} className="rain-drop" style={{ left: d.left, height: d.height, animationDuration: d.duration, animationDelay: d.delay }} />
          ))}
        </div>
      )}

      {weatherMain === "Snow" && (
        <div className="snow-container">
          {snowFlakes.map((f) => (
            <div key={f.id} className="snow-flake" style={{ left: f.left, width: f.size, height: f.size, animationDuration: f.duration, animationDelay: f.delay }} />
          ))}
        </div>
      )}

      {weatherMain === "Clouds" && clouds.map((c, i) => (
        <div key={i} className={`floating-cloud ${c.size} ${c.top}`} style={{ animation: `cloudDrift ${c.dur} linear infinite`, animationDelay: c.delay }}>☁</div>
      ))}

      {weatherMain === "Thunderstorm" && (
        <div className="fixed inset-0 bg-white/5 animate-[flash_4s_ease-in-out_infinite] pointer-events-none z-1" />
      )}

      <div className="fixed inset-0 bg-black/10 z-0" />
    </div>
  );
};

export default WeatherBackground;

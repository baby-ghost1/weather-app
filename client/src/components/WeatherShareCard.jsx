import { useState, useEffect } from "react";
import { FiShare2, FiDownload } from "react-icons/fi";
import { getAirQuality } from "../services/api";
import { formatTime } from "../utils/format";

const WeatherShareCard = ({ weather }) => {
  const [generating, setGenerating] = useState(false);
  const [aqi, setAqi] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!weather?.lat || !weather?.lon) return;
    setError("");
    getAirQuality(weather.lat, weather.lon)
      .then((res) => { if (res.success) setAqi(res.data); else setError("Failed to load AQI."); })
      .catch(() => setError("Failed to load AQI."));
  }, [weather?.lat, weather?.lon]);

  if (!weather) return null;

  const handleDownload = async () => {
    setGenerating(true);
    const canvas = document.createElement("canvas");
    canvas.width = 900;
    canvas.height = 560;
    const ctx = canvas.getContext("2d");

    const grad = ctx.createLinearGradient(0, 0, 900, 560);
    grad.addColorStop(0, "#0f2027");
    grad.addColorStop(0.5, "#203a43");
    grad.addColorStop(1, "#2c5364");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 900, 560);

    ctx.fillStyle = "rgba(255,255,255,0.04)";
    ctx.beginPath();
    ctx.arc(700, 440, 280, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(255,255,255,0.03)";
    ctx.beginPath();
    ctx.arc(150, 100, 150, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = "bold 14px system-ui";
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.fillText("WEATHER REPORT", 60, 40);

    ctx.font = "bold 38px system-ui";
    ctx.fillStyle = "white";
    ctx.fillText(weather.city || "Unknown", 60, 80);

    ctx.font = "18px system-ui";
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.fillText(weather.country || "", 60, 108);

    ctx.font = "bold 110px system-ui";
    ctx.fillStyle = "white";
    ctx.fillText(`${Math.round(weather.temp)}°`, 60, 240);

    ctx.font = "22px system-ui";
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    const desc = (weather.description || "").replace(/\b\w/g, (c) => c.toUpperCase());
    ctx.fillText(desc, 60, 280);

    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(60, 300);
    ctx.lineTo(440, 300);
    ctx.stroke();

    const leftCol = [
      { label: "Feels Like", value: `${Math.round(weather.feelsLike)}°` },
      { label: "Humidity", value: `${weather.humidity}%` },
      { label: "Wind", value: `${Math.round(weather.windSpeed)} km/h` },
      { label: "Pressure", value: `${weather.pressure} hPa` },
    ];
    const rightCol = [
      { label: "Cloudiness", value: `${weather.clouds || 0}%` },
      { label: "Visibility", value: `${((weather.visibility || 10000) / 1000).toFixed(1)} km` },
      { label: "Sunrise", value: formatTime(weather.sunrise) },
      { label: "Sunset", value: formatTime(weather.sunset) },
    ];

    let y = 330;
    leftCol.forEach((item) => {
      ctx.font = "11px system-ui";
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.fillText(item.label, 60, y);
      ctx.font = "bold 13px system-ui";
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.fillText(item.value, 160, y);
      y += 22;
    });

    y = 330;
    rightCol.forEach((item) => {
      ctx.font = "11px system-ui";
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.fillText(item.label, 280, y);
      ctx.font = "bold 13px system-ui";
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.fillText(item.value, 380, y);
      y += 22;
    });

    if (weather.windDeg != null) {
      const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
      const dir = dirs[Math.round(weather.windDeg / 45) % 8];
      ctx.font = "11px system-ui";
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.fillText("Wind Dir", 60, 422);
      ctx.font = "bold 13px system-ui";
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.fillText(`${weather.windDeg}° ${dir}`, 160, 422);
    }

    if (weather.windGust) {
      ctx.font = "11px system-ui";
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.fillText("Gust", 280, 422);
      ctx.font = "bold 13px system-ui";
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.fillText(`${Math.round(weather.windGust)} km/h`, 380, 422);
    }

    if (weather.rain) {
      ctx.font = "11px system-ui";
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.fillText("Rain (1h)", 60, 444);
      ctx.font = "bold 13px system-ui";
      ctx.fillStyle = "rgba(100,200,255,0.8)";
      ctx.fillText(`${weather.rain} mm`, 160, 444);
    }

    if (weather.snow) {
      ctx.font = "11px system-ui";
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.fillText("Snow (1h)", 280, 444);
      ctx.font = "bold 13px system-ui";
      ctx.fillStyle = "rgba(200,220,255,0.8)";
      ctx.fillText(`${weather.snow} mm`, 380, 444);
    }

    if (aqi) {
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(500, 310);
      ctx.lineTo(500, 455);
      ctx.stroke();

      ctx.font = "bold 12px system-ui";
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.fillText("AIR QUALITY", 530, 330);

      ctx.font = "bold 48px system-ui";
      ctx.fillStyle = aqi.color || "white";
      ctx.fillText(`${aqi.aqi}`, 530, 385);

      ctx.font = "14px system-ui";
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.fillText(aqi.level || "", 530, 408);

      ctx.font = "11px system-ui";
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.fillText(`Dominant: ${aqi.dominantPollutant || "N/A"}`, 530, 430);

      if (aqi.pollutants && aqi.pollutants.length > 0) {
        let px = 530;
        aqi.pollutants.slice(0, 3).forEach((p) => {
          ctx.font = "10px system-ui";
          ctx.fillStyle = "rgba(255,255,255,0.25)";
          ctx.fillText(p.name, px, 450);
          ctx.font = "bold 11px system-ui";
          ctx.fillStyle = p.color || "rgba(255,255,255,0.5)";
          ctx.fillText(`${p.aqi}`, px, 464);
          px += 70;
        });
      }
    }

    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(60, 478);
    ctx.lineTo(840, 478);
    ctx.stroke();

    ctx.font = "11px system-ui";
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.fillText(`Generated by WeatherFlow • ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} • ${new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}`, 60, 505);

    const link = document.createElement("a");
    link.download = `weather-${(weather.city || "unknown").replace(/\s+/g, "-")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    setGenerating(false);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `Weather in ${weather.city}`,
        text: `${weather.city}: ${Math.round(weather.temp)}°, ${weather.description}. Feels like ${Math.round(weather.feelsLike)}°`,
      });
    } else {
      await navigator.clipboard.writeText(
        `Weather in ${weather.city}\n${Math.round(weather.temp)}° (feels ${Math.round(weather.feelsLike)}°)\n${weather.description}\nHumidity: ${weather.humidity}%\nWind: ${Math.round(weather.windSpeed)} km/h`
      );
    }
  };

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiShare2 className="text-white" /> Share Weather
        </h3>
      </div>

      <div className="rounded-xl overflow-hidden mb-3 bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-white font-medium text-sm">{weather.city}</p>
            <p className="text-white/40 text-[11px]">{weather.country}</p>
          </div>
          <p className="text-white/20 text-[10px]">WEATHER REPORT</p>
        </div>
        <p className="text-white text-4xl font-bold mt-2">{Math.round(weather.temp)}°</p>
        <p className="text-white/60 text-xs capitalize">{weather.description}</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-3 text-[11px]">
          <p className="text-white/30">Feels: <span className="text-white/60">{Math.round(weather.feelsLike)}°</span></p>
          <p className="text-white/30">Humidity: <span className="text-white/60">{weather.humidity}%</span></p>
          <p className="text-white/30">Wind: <span className="text-white/60">{Math.round(weather.windSpeed)} km/h</span></p>
          <p className="text-white/30">Pressure: <span className="text-white/60">{weather.pressure} hPa</span></p>
          <p className="text-white/30">Clouds: <span className="text-white/60">{weather.clouds || 0}%</span></p>
          <p className="text-white/30">Visibility: <span className="text-white/60">{((weather.visibility || 10000) / 1000).toFixed(1)} km</span></p>
          <p className="text-white/30">Sunrise: <span className="text-white/60">{formatTime(weather.sunrise)}</span></p>
          <p className="text-white/30">Sunset: <span className="text-white/60">{formatTime(weather.sunset)}</span></p>
        </div>
        {aqi && (
          <div className="mt-3 pt-3 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold" style={{ color: aqi.color }}>{aqi.aqi}</div>
              <div>
                <p className="text-white/60 text-[11px] font-medium">{aqi.level}</p>
                <p className="text-white/30 text-[10px]">Dominant: {aqi.dominantPollutant}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button onClick={handleShare} className="flex-1 glass rounded-xl py-2.5 flex items-center justify-center gap-2 text-white/60 hover:text-white text-xs transition-all hover:bg-white/10">
          <FiShare2 className="text-white" /> Share
        </button>
        <button onClick={handleDownload} disabled={generating} className="flex-1 glass rounded-xl py-2.5 flex items-center justify-center gap-2 text-white/60 hover:text-white text-xs transition-all hover:bg-white/10 disabled:opacity-50">
          <FiDownload className="text-white" /> {generating ? "Generating..." : "Download PNG"}
        </button>
      </div>
    </div>
  );
};

export default WeatherShareCard;

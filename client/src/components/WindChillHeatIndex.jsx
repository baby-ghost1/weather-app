import { useState, useEffect } from "react";
import { FiThermometer } from "react-icons/fi";

const calcWindChill = (temp, windSpeed) => {
  if (temp > 10 || windSpeed < 4.8) return null;
  const v = windSpeed * 3.6;
  return Math.round(13.12 + 0.6215 * temp - 11.37 * Math.pow(v, 0.16) + 0.3965 * temp * Math.pow(v, 0.16));
};

const calcHeatIndex = (temp, humidity) => {
  if (temp < 27 || humidity < 40) return null;
  const hi = -8.784695 + 1.61139411 * temp + 2.338549 * humidity
    - 0.14611605 * temp * humidity - 0.00650035 * temp * temp
    - 0.05046068 * humidity * humidity + 0.00122874 * temp * temp * humidity
    + 0.00085282 * temp * humidity * humidity - 0.00000199 * temp * temp * humidity * humidity;
  return Math.round(hi);
};

const WindChillHeatIndex = ({ weather }) => {
  if (!weather) return null;

  const windChill = calcWindChill(weather.temp, weather.windSpeed);
  const heatIndex = calcHeatIndex(weather.temp, weather.humidity);

  if (!windChill && !heatIndex) return null;

  const wcCategory = windChill ? (windChill < -10 ? "Dangerous" : windChill < 0 ? "Cold" : "Cool") : null;
  const hiCategory = heatIndex ? (heatIndex > 45 ? "Dangerous" : heatIndex > 40 ? "Extreme" : heatIndex > 35 ? "Very Hot" : "Hot") : null;

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiThermometer className="text-white" /> Feels Like
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {windChill && (
          <div className="glass rounded-xl p-3 text-center">
            <p className="text-white/40 text-[11px] mb-1">Wind Chill</p>
            <p className="text-white text-xl font-medium">{windChill}°</p>
            <p className="text-blue-300 text-[11px]">{wcCategory}</p>
          </div>
        )}
        {heatIndex && (
          <div className="glass rounded-xl p-3 text-center">
            <p className="text-white/40 text-[11px] mb-1">Heat Index</p>
            <p className="text-white text-xl font-medium">{heatIndex}°</p>
            <p className="text-orange-300 text-[11px]">{hiCategory}</p>
          </div>
        )}
      </div>

      <p className="text-white/30 text-[11px] text-center mt-2">
        {windChill ? "Wind makes it feel colder than actual temperature" : "Humidity makes it feel hotter than actual temperature"}
      </p>
    </div>
  );
};

export default WindChillHeatIndex;
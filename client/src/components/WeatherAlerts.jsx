import { useState, useEffect } from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";

const getAlerts = (weather) => {
  if (!weather) return [];
  const alerts = [];
  const { main, temp, humidity, windSpeed, visibility, pressure, rain, snow, windGust } = weather;

  if (main === "Thunderstorm") {
    alerts.push({ type: "warning", message: "Thunderstorm warning: Seek shelter immediately. Avoid open areas and water bodies." });
  }
  if (main === "Snow" || snow) {
    alerts.push({ type: "warning", message: "Snow alert: Roads may be slippery. Drive cautiously." });
  }
  if (windSpeed > 25) {
    alerts.push({ type: "warning", message: `High wind alert: ${windSpeed} km/h winds. Secure loose objects.` });
  }
  if (visibility < 1000) {
    alerts.push({ type: "caution", message: "Low visibility: Drive with fog lights. Reduce speed." });
  }
  if (humidity > 90) {
    alerts.push({ type: "caution", message: "Very high humidity: Stay hydrated. Limit outdoor exertion." });
  }
  if (temp > 42) {
    alerts.push({ type: "warning", message: "Extreme heat: Avoid prolonged sun exposure. Drink plenty of water." });
  }
  if (temp < 0) {
    alerts.push({ type: "caution", message: "Freezing temperatures: Watch for icy conditions. Layer up." });
  }
  if (pressure && pressure < 990) {
    alerts.push({ type: "info", message: "Low pressure system: Weather may change rapidly." });
  }
  if (rain) {
    alerts.push({ type: "info", message: "Rain detected: Carry an umbrella if heading out." });
  }
  if (windGust && windGust > 40) {
    alerts.push({ type: "warning", message: `Wind gusts up to ${windGust} km/h. Avoid high-profile vehicles.` });
  }
  return alerts;
};

const WeatherAlerts = ({ weather }) => {
  const [dismissed, setDismissed] = useState(new Set());

  if (!weather) return null;

  const alerts = getAlerts(weather);
  if (alerts.length === 0) return null;

  const borderColor = { warning: "border-orange-400/30", caution: "border-yellow-400/30", info: "border-blue-400/30" };
  const iconColor = { warning: "text-orange-400", caution: "text-yellow-400", info: "text-blue-400" };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-2 animate-slide-down">
      {alerts.map((alert, i) =>
        dismissed.has(i) ? null : (
          <div key={i} className={`glass rounded-xl px-4 py-3 flex items-center gap-3 border ${borderColor[alert.type]}`}>
            <FiAlertTriangle className={`shrink-0 ${iconColor[alert.type]}`} />
            <p className="text-white/80 text-sm flex-1">{alert.message}</p>
            <button onClick={() => setDismissed(new Set([...dismissed, i]))} aria-label="Dismiss alert" className="text-white/30 hover:text-white/60 transition-colors">
              <FiX />
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default WeatherAlerts;
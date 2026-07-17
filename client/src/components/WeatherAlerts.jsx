import { useState } from "react";
import { FiAlertTriangle, FiInfo, FiX } from "react-icons/fi";

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

const typeStyles = {
  warning: {
    bg: "bg-red-400/10",
    border: "border-red-400/30",
    iconBg: "bg-red-400/15",
    badge: "bg-red-400/20 text-red-300",
    icon: "text-red-400",
    label: "Warning",
  },
  caution: {
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/30",
    iconBg: "bg-yellow-400/15",
    badge: "bg-yellow-400/20 text-yellow-300",
    icon: "text-yellow-400",
    label: "Caution",
  },
  info: {
    bg: "bg-blue-400/10",
    border: "border-blue-400/30",
    iconBg: "bg-blue-400/15",
    badge: "bg-blue-400/20 text-blue-300",
    icon: "text-blue-400",
    label: "Info",
  },
};

const WeatherAlerts = ({ weather }) => {
  const [dismissed, setDismissed] = useState(new Set());

  if (!weather) return null;

  const alerts = getAlerts(weather);
  if (alerts.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-2 animate-slide-down">
      {alerts.map((alert, i) =>
        dismissed.has(i) ? null : (
          <div key={i} className={`rounded-xl px-4 py-3 flex items-center gap-3 border ${typeStyles[alert.type].bg} ${typeStyles[alert.type].border}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${typeStyles[alert.type].iconBg}`}>
              {alert.type === "info" ? (
                <FiInfo className={typeStyles[alert.type].icon} />
              ) : (
                <FiAlertTriangle className={typeStyles[alert.type].icon} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${typeStyles[alert.type].badge}`}>
                  {typeStyles[alert.type].label}
                </span>
              </div>
              <p className="text-white/80 text-sm">{alert.message}</p>
            </div>
            <button onClick={() => setDismissed(new Set([...dismissed, i]))} aria-label="Dismiss alert" className="text-white/20 hover:text-white/50 transition-colors shrink-0">
              <FiX size={16} />
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default WeatherAlerts;

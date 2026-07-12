import { useState } from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";

const WeatherAlerts = ({ weather }) => {
  const [dismissed, setDismissed] = useState(new Set());

  if (!weather) return null;

  const alerts = [];
  if (weather.main === "Thunderstorm") alerts.push({ type: "warning", message: "Thunderstorm warning — stay indoors and avoid open areas." });
  if (weather.main === "Snow" && weather.temp <= -5) alerts.push({ type: "warning", message: "Severe cold warning — frostbite risk. Limit outdoor exposure." });
  if (weather.windSpeed > 15) alerts.push({ type: "warning", message: "High winds — secure loose objects and be cautious outside." });
  if (weather.visibility && weather.visibility < 500) alerts.push({ type: "caution", message: "Low visibility — drive carefully and use fog lights." });
  if (weather.humidity > 90) alerts.push({ type: "info", message: "Very high humidity — stay hydrated." });

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
            <button onClick={() => setDismissed(new Set([...dismissed, i]))} className="text-white/30 hover:text-white/60 transition-colors">
              <FiX />
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default WeatherAlerts;

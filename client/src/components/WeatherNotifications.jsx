import { useState, useEffect } from "react";
import { FiBell, FiBellOff, FiAlertTriangle, FiInfo } from "react-icons/fi";

const WeatherNotifications = ({ weather }) => {
  const [enabled, setEnabled] = useState(false);
  const [permission, setPermission] = useState("default");

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!("Notification" in window)) return;
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === "granted") {
      setEnabled(true);
      new Notification("WeatherFlow", { body: "Notifications enabled! You'll be alerted about weather changes.", icon: "/icons/icon-192.svg" });
    }
  };

  const toggle = () => {
    if (permission === "denied") return;
    if (enabled) {
      setEnabled(false);
    } else {
      requestPermission();
    }
  };

  const alerts = [];
  if (weather) {
    if (weather.main === "Thunderstorm") alerts.push({ type: "warning", text: "Thunderstorm active — stay indoors" });
    if (weather.temp >= 42) alerts.push({ type: "warning", text: "Extreme heat — avoid outdoor activity" });
    if (weather.temp <= 0) alerts.push({ type: "warning", text: "Freezing temps — roads may be icy" });
    if (weather.windSpeed > 20) alerts.push({ type: "caution", text: "High winds — secure loose objects" });
    if (weather.rain > 5) alerts.push({ type: "caution", text: "Heavy rainfall — avoid travel" });
    if (weather.visibility < 500) alerts.push({ type: "caution", text: "Low visibility — drive carefully" });
  }

  return (
    <div className="glass rounded-2xl p-4 hover-lift animate-scale-in min-w-[220px]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiBell className="text-white" /> Notifications
        </h3>
        <button
          onClick={toggle}
          disabled={permission === "denied"}
          className={`p-1.5 rounded-lg transition-all ${
            enabled
              ? "bg-green-400/20 text-green-400"
              : permission === "denied"
              ? "bg-white/5 text-white/15 cursor-not-allowed"
              : "bg-white/10 text-white/40 hover:text-white/60"
          }`}
        >
          {enabled ? <FiBell className="text-sm" /> : <FiBellOff className="text-sm" />}
        </button>
      </div>

      {permission === "denied" ? (
        <div className="flex items-start gap-2 p-2 rounded-lg bg-orange-400/10">
          <FiInfo className="text-orange-400/60 text-sm shrink-0 mt-0.5" />
          <p className="text-orange-300/70 text-[11px] leading-relaxed">
            Notifications blocked. Enable them in your browser's site settings.
          </p>
        </div>
      ) : enabled && alerts.length > 0 ? (
        <div className="space-y-1.5">
          {alerts.map((a, i) => (
            <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-white/5">
              <FiAlertTriangle className={`text-sm shrink-0 mt-0.5 ${a.type === "warning" ? "text-red-400/70" : "text-orange-400/60"}`} />
              <p className="text-white/50 text-[11px] leading-relaxed">{a.text}</p>
            </div>
          ))}
        </div>
      ) : enabled ? (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-green-400/5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <p className="text-green-300/60 text-[11px]">All clear — you'll be notified if conditions change</p>
        </div>
      ) : (
        <p className="text-white/30 text-[11px]">Enable to get weather alerts</p>
      )}
    </div>
  );
};

export default WeatherNotifications;

import { useState, useEffect } from "react";
import { FiBell, FiBellOff, FiAlertTriangle, FiCheck } from "react-icons/fi";

const WeatherNotifications = ({ weather }) => {
  const [enabled, setEnabled] = useState(false);
  const [permission, setPermission] = useState("default");
  const [lastAlert, setLastAlert] = useState(null);

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

  useEffect(() => {
    if (!enabled || !weather || permission !== "granted") return;

    const alerts = [];
    if (weather.main === "Thunderstorm") alerts.push("Thunderstorm approaching! Stay indoors.");
    if (weather.temp >= 42) alerts.push("Extreme heat alert! Stay hydrated.");
    if (weather.temp <= 0) alerts.push("Freezing temperatures! Roads may be icy.");
    if (weather.windSpeed > 20) alerts.push("High winds detected! Secure loose objects.");
    if (weather.rain > 5) alerts.push("Heavy rainfall expected. Avoid travel if possible.");

    if (alerts.length > 0) {
      const now = Date.now();
      if (!lastAlert || now - lastAlert > 30 * 60 * 1000) {
        new Notification("WeatherFlow Alert", { body: alerts[0], icon: "/icons/icon-192.svg" });
        setLastAlert(now);
      }
    }
  }, [weather, enabled, permission]);

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiBell className="text-white" /> Notifications
        </h3>
        <button
          onClick={enabled ? () => setEnabled(false) : requestPermission}
          className={`p-1.5 rounded-lg transition-all ${enabled ? "bg-green-400/20 text-green-400" : "bg-white/10 text-white/40 hover:text-white/60"}`}
        >
          {enabled ? <FiCheck className="text-sm" /> : <FiBellOff className="text-sm" />}
        </button>
      </div>

      {permission === "denied" ? (
        <p className="text-white/30 text-xs">Notifications blocked. Enable in browser settings.</p>
      ) : enabled ? (
        <div className="space-y-1.5">
          <p className="text-green-400 text-xs">Active - You'll receive alerts for:</p>
          <p className="text-white/40 text-[11px]">• Thunderstorms & extreme weather</p>
          <p className="text-white/40 text-[11px]">• Heat/cold wave warnings</p>
          <p className="text-white/40 text-[11px]">• Heavy rain & high winds</p>
        </div>
      ) : (
        <p className="text-white/30 text-xs">Enable to get weather change alerts.</p>
      )}
    </div>
  );
};

export default WeatherNotifications;

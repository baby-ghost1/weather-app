import { useState, useEffect } from "react";
import { FiAlertTriangle, FiExternalLink, FiActivity } from "react-icons/fi";

const colorMap = { major: "#ef4444", moderate: "#f97316", minor: "#facc15" };
const borderMap = { major: "border-red-400/30", moderate: "border-orange-400/30", minor: "border-yellow-400/20" };
const bgMap = { major: "bg-red-400/[0.06]", moderate: "bg-orange-400/[0.06]", minor: "bg-yellow-400/[0.06]" };

const EarthquakeAlerts = ({ lat, lon }) => {
  const [earthquakes, setEarthquakes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!lat || !lon) return;
    setLoading(true);
    setError("");
    fetch(`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&latitude=${lat}&longitude=${lon}&maxradiuskm=1000&limit=5&orderby=magnitude`)
      .then((res) => res.json())
      .then((data) => {
        if (data.features) {
          setEarthquakes(data.features.map((f) => ({
            id: f.id,
            mag: f.properties.mag,
            place: f.properties.place,
            time: f.properties.time,
            url: f.properties.url,
            severity: f.properties.mag >= 5 ? "major" : f.properties.mag >= 3 ? "moderate" : "minor",
          })));
        }
      })
      .catch(() => setError("Failed to load earthquake data."))
      .finally(() => setLoading(false));
  }, [lat, lon]);

  if (error) return <div className="glass rounded-2xl p-5 animate-scale-in"><p className="text-red-300 text-xs">{error}</p></div>;
  if (loading) return <div className="glass rounded-2xl p-5 animate-scale-in"><div className="shimmer h-4 w-40 rounded mb-3" /><div className="shimmer h-12 w-full rounded mb-2" /><div className="shimmer h-12 w-full rounded" /></div>;
  if (earthquakes.length === 0) return null;

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      {/* header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiActivity className="text-white" /> Earthquake Activity
        </h3>
        <span className="text-white/30 text-[11px]">{earthquakes.length} recent · 1000km</span>
      </div>

      {/* list */}
      <div className="space-y-2">
        {earthquakes.slice(0, 5).map((eq) => (
          <a
            key={eq.id}
            href={eq.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-3 p-3 rounded-xl border ${borderMap[eq.severity]} ${bgMap[eq.severity]} hover:bg-white/[0.08] transition-colors`}
          >
            <div className="relative w-10 h-10 shrink-0 flex items-center justify-center rounded-lg" style={{ backgroundColor: `${colorMap[eq.severity]}15` }}>
              <span className="text-lg font-bold" style={{ color: colorMap[eq.severity] }}>{eq.mag.toFixed(1)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white/80 text-xs truncate">{eq.place}</p>
              <p className="text-white/30 text-[11px]">
                {new Date(eq.time).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {new Date(eq.time).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full capitalize" style={{ backgroundColor: `${colorMap[eq.severity]}20`, color: colorMap[eq.severity] }}>
              {eq.severity}
            </span>
            <FiExternalLink className="text-white/20 text-xs shrink-0" />
          </a>
        ))}
      </div>
    </div>
  );
};

export default EarthquakeAlerts;

import { useState, useEffect } from "react";
import { FiAlertTriangle, FiExternalLink } from "react-icons/fi";

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

  const colorMap = { major: "text-red-400", moderate: "text-orange-400", minor: "text-yellow-300" };
  const borderMap = { major: "border-red-400/30", moderate: "border-orange-400/30", minor: "border-yellow-400/20" };

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider">Earthquake Activity (1000km)</h3>
        <span className="text-white/30 text-[11px]">{earthquakes.length} recent</span>
      </div>

      <div className="space-y-2">
        {earthquakes.slice(0, 5).map((eq) => (
          <a
            key={eq.id}
            href={eq.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-3 p-2.5 rounded-xl border ${borderMap[eq.severity]} bg-white/5 hover:bg-white/10 transition-colors`}
          >
            <div className={`text-xl font-bold ${colorMap[eq.severity]}`}>
              {eq.mag.toFixed(1)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white/80 text-xs truncate">{eq.place}</p>
              <p className="text-white/30 text-[11px]">
                {new Date(eq.time).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {new Date(eq.time).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
            <FiExternalLink className="text-white/20 text-xs shrink-0" />
          </a>
        ))}
      </div>
    </div>
  );
};

export default EarthquakeAlerts;

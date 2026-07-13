import { useState, useEffect, useRef } from "react";
import { FiMap, FiCloud, FiDroplet, FiThermometer, FiWind } from "react-icons/fi";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useUnit } from "../context/UnitContext";

const OWM_API_KEY = import.meta.env.VITE_OWM_API_KEY;

const escapeHtml = (str) =>
  str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const layers = [
  { id: "precipitation", name: "Precipitation", icon: FiDroplet, color: "text-blue-300" },
  { id: "temperature", name: "Temperature", icon: FiThermometer, color: "text-orange-300" },
  { id: "clouds", name: "Clouds", icon: FiCloud, color: "text-gray-300" },
  { id: "wind", name: "Wind", icon: FiWind, color: "text-cyan-300" },
];

const getRadarTimestamps = async () => {
  try {
    const res = await fetch("https://api.rainviewer.com/public/weather-maps.json");
    const data = await res.json();
    return data.radar?.past || [];
  } catch {
    return [];
  }
};

const WeatherMap = ({ weather }) => {
  const [activeLayer, setActiveLayer] = useState("precipitation");
  const [isOpen, setIsOpen] = useState(false);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const overlayLayer = useRef(null);
  const { tempUnit } = useUnit();

  const lat = weather?.lat;
  const lon = weather?.lon;

  const addOverlay = async (layerId) => {
    if (!mapInstance.current) return;
    if (overlayLayer.current) {
      mapInstance.current.removeLayer(overlayLayer.current);
      overlayLayer.current = null;
    }

    if (layerId === "precipitation") {
      const timestamps = await getRadarTimestamps();
      if (timestamps.length > 0) {
        const latest = timestamps[timestamps.length - 1].time;
        overlayLayer.current = L.tileLayer(
          `https://tilecache.rainviewer.com/v2/radar/${latest}/512/{z}/{x}/{y}/2/1_1.png`,
          { opacity: 0.6, maxZoom: 18 }
        ).addTo(mapInstance.current);
      }
    } else if (layerId === "temperature") {
      overlayLayer.current = L.tileLayer(
        `https://tile.openweathermap.org/temp_new/{z}/{x}/{y}.png?appid=${OWM_API_KEY}`,
        { opacity: 0.5, maxZoom: 18 }
      ).addTo(mapInstance.current);
    } else if (layerId === "clouds") {
      overlayLayer.current = L.tileLayer(
        `https://tile.openweathermap.org/clouds_new/{z}/{x}/{y}.png?appid=${OWM_API_KEY}`,
        { opacity: 0.5, maxZoom: 18 }
      ).addTo(mapInstance.current);
    } else if (layerId === "wind") {
      overlayLayer.current = L.tileLayer(
        `https://tile.openweathermap.org/wind_new/{z}/{x}/{y}.png?appid=${OWM_API_KEY}`,
        { opacity: 0.5, maxZoom: 18 }
      ).addTo(mapInstance.current);
    }
  };

  const initMap = () => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [lat, lon],
      zoom: 7,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://osm.org/copyright">OSM</a>',
      maxZoom: 18,
    }).addTo(map);

    L.marker([lat, lon])
      .bindPopup(`<div style="text-align:center;padding:4px"><b>${escapeHtml(weather.city)}</b><br/>${escapeHtml(String(weather.temp) + tempUnit)} · ${escapeHtml(weather.description)}</div>`)
      .addTo(map);

    mapInstance.current = map;
    setTimeout(() => map.invalidateSize(), 100);
    addOverlay(activeLayer);
  };

  useEffect(() => {
    if (isOpen && mapRef.current && !mapInstance.current) {
      setTimeout(initMap, 200);
    }
    return () => {
      if (!isOpen && mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
        overlayLayer.current = null;
      }
    };
  }, [isOpen]);

  useEffect(() => {
    addOverlay(activeLayer);
  }, [activeLayer]);

  useEffect(() => {
    if (mapInstance.current && isOpen) {
      setTimeout(() => mapInstance.current.invalidateSize(), 300);
    }
  }, [isOpen]);

  if (!weather) return null;

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass rounded-full px-4 py-2 text-white/50 hover:text-white text-xs font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2"
      >
        <FiMap className="text-white" /><span>Weather Map</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-gray-900/95 backdrop-blur-xl rounded-3xl p-6 w-full max-w-4xl flex flex-col" style={{ height: "85vh" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-lg font-medium">Weather Map</h3>
              <button onClick={() => { setIsOpen(false); }} aria-label="Close map" className="text-white/40 hover:text-white text-2xl">×</button>
            </div>

            <div className="flex gap-2 mb-4 flex-wrap">
              {layers.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setActiveLayer(l.id)}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all ${
                    activeLayer === l.id ? "bg-white/20 text-white" : "text-white/40 hover:text-white/60"
                  }`}
                >
                  <l.icon className={l.color} />
                  <span>{l.name}</span>
                </button>
              ))}
            </div>

            <div
              ref={mapRef}
              className="flex-1 rounded-xl overflow-hidden"
              style={{ minHeight: "400px", background: "#1a1a2e" }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherMap;

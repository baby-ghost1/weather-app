import { useState, useEffect } from "react";
import { FiCalendar, FiSun } from "react-icons/fi";
import { TbFlower, TbLeaf, TbSnowflake } from "react-icons/tb";
import { getContent } from "../services/api";

const getCurrentSeason = () => {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return { name: "Spring", icon: <TbFlower className="text-white" />, color: "#e91e63" };
  if (month >= 5 && month <= 7) return { name: "Summer", icon: <FiSun className="text-white" />, color: "#ff9800" };
  if (month >= 8 && month <= 10) return { name: "Autumn", icon: <TbLeaf className="text-white" />, color: "#795548" };
  return { name: "Winter", icon: <TbSnowflake className="text-white" />, color: "#2196f3" };
};

const parseEventDate = (dateStr) => {
  if (!dateStr) return null;
  const now = new Date();
  const year = now.getFullYear();
  const parsed = new Date(`${dateStr} ${year}`);
  if (isNaN(parsed)) {
    const tryYear = year + 1;
    const p2 = new Date(`${dateStr} ${tryYear}`);
    return isNaN(p2) ? null : p2;
  }
  if (parsed < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
    parsed.setFullYear(year + 1);
  }
  return parsed;
};

const getSeasonIcon = (type) => {
  const icons = { astronomical: "🌟", festival: "🎉", national: "🇮🇳" };
  return icons[type] || "📅";
};

const SeasonalCalendar = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getContent("events")
      .then((res) => { setAllEvents(Array.isArray(res) ? res : [...(res.astronomical || []), ...(res.festivals || [])]); setLoading(false); })
      .catch(() => { setError("Failed to load events"); setLoading(false); });
  }, []);

  if (loading) return <div className="glass rounded-2xl p-5 hover-lift animate-scale-in"><p className="text-white/40 text-xs">Loading events...</p></div>;
  if (error) return <div className="glass rounded-2xl p-5 hover-lift animate-scale-in"><p className="text-red-400 text-xs">{error}</p></div>;

  const season = getCurrentSeason();
  const now = new Date();

  const processed = allEvents.reduce((acc, e) => {
    const eventDate = parseEventDate(e.date);
    const daysUntil = eventDate ? Math.ceil((eventDate - now) / (1000 * 60 * 60 * 24)) : 0;
    const isPast = eventDate ? eventDate < now : false;
    if (!isPast && acc.length < 5) acc.push({ ...e, eventDate, daysUntil, isPast });
    return acc;
  }, []);

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiCalendar className="text-white" /> Seasonal Calendar
        </h3>
        <span className="text-xs font-medium px-2.5 py-1 rounded-lg text-black" style={{ backgroundColor: season.color }}>
          {season.icon} {season.name}
        </span>
      </div>

      <div className="space-y-2">
        {processed.map((event, i) => (
          <div key={event.name} className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
            <span className="text-lg">{event.icon || getSeasonIcon(event.type)}</span>
            <div className="flex-1">
              <p className="text-white/70 text-xs">{event.name}</p>
              <p className="text-white/30 text-[11px]">
                {event.date}
              </p>
            </div>
            <span className="text-[11px] text-white/40">
              {event.daysUntil <= 0 ? "Today!" : `${event.daysUntil} days`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeasonalCalendar;

import { useState, useEffect } from "react";
import { FiMusic } from "react-icons/fi";
import { getContent } from "../services/api";

const WeatherPlaylist = ({ weather }) => {
  const [showAll, setShowAll] = useState(false);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!weather) return;
    setLoading(true);
    const isHot = weather.temp > 30;
    const isCold = weather.temp < 10;
    const condition = isHot ? "hot" : isCold ? "cold" : weather.main || "default";

    getContent("playlists", { condition })
      .then((res) => { setSongs(Array.isArray(res) ? res : []); setLoading(false); })
      .catch((err) => { setError("Failed to load playlist"); setLoading(false); });
  }, [weather]);

  if (!weather) return null;
  if (loading) return <div className="glass rounded-2xl p-5 hover-lift animate-scale-in"><p className="text-white/40 text-xs">Loading playlist...</p></div>;
  if (error) return <div className="glass rounded-2xl p-5 hover-lift animate-scale-in"><p className="text-red-400 text-xs">{error}</p></div>;

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiMusic className="text-white" /> Weather Playlist
        </h3>
        <span className="text-[11px] text-white/30">{weather.main}</span>
      </div>

      <p className="text-white text-sm font-medium mb-2">Songs for {weather.main} weather</p>

      <div className="space-y-1.5">
        {songs.slice(0, showAll ? 5 : 3).map((song, i) => (
          <div key={song.title} className="flex items-center gap-2 p-1.5 rounded-lg bg-white/5">
            <span className="text-white/20 text-[11px] w-4">{i + 1}</span>
            <span className="text-white/60 text-xs">{song.title} — {song.artist}</span>
          </div>
        ))}
      </div>

      <p className="text-white/20 text-[11px] text-center mt-2">
        Based on {weather.main} weather & {weather.temp}° temperature
      </p>
    </div>
  );
};

export default WeatherPlaylist;

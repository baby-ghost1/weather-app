import { useState, useEffect } from "react";
import { FiBookOpen } from "react-icons/fi";
import { getContent } from "../services/api";

const WeatherStories = ({ weather }) => {
  const [index, setIndex] = useState(0);
  const [weatherFacts, setWeatherFacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getContent("facts")
      .then((res) => { setWeatherFacts(res); setLoading(false); })
      .catch((err) => { setError("Failed to load facts"); setLoading(false); });
  }, []);

  useEffect(() => {
    if (weatherFacts.length === 0) return;
    const i = Math.floor(Math.random() * weatherFacts.length);
    setIndex(i);
  }, [weather?.city, weatherFacts]);

  if (loading) return <div className="glass rounded-2xl p-5 hover-lift animate-scale-in"><p className="text-white/40 text-xs">Loading facts...</p></div>;
  if (error || !weatherFacts.length) return null;

  const current = weatherFacts[index];

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiBookOpen className="text-white" /> Weather Facts
        </h3>
        <button
          onClick={() => setIndex((prev) => (prev + 1) % weatherFacts.length)}
          className="text-white/30 hover:text-white/60 text-[11px] transition-colors"
        >
          Next →
        </button>
      </div>

      <div className="flex items-start gap-3">
        <span className="text-2xl text-white/30">💡</span>
        <div>
          <p className="text-white text-xs font-medium mb-1">{current.title}</p>
          <p className="text-white/50 text-[11px] leading-relaxed">{current.fact}</p>
        </div>
      </div>

      <div className="flex justify-center gap-1 mt-3">
        {weatherFacts.map((_, i) => (
          <button key={i} onClick={() => setIndex(i)} aria-label={`Go to fact ${i + 1}`} className={`w-1 h-1 rounded-full transition-all ${i === index ? "bg-white w-3" : "bg-white/20"}`} />
        ))}
      </div>
    </div>
  );
};

export default WeatherStories;

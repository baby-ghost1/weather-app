import { useState, useEffect } from "react";
import { FiInfo, FiChevronDown } from "react-icons/fi";
import { getContent } from "../services/api";

const WeatherFacts = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [startIndex, setStartIndex] = useState(0);
  const [facts, setFacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getContent("facts")
      .then((res) => { setFacts(res); setLoading(false); })
      .catch((err) => { setError("Failed to load facts"); setLoading(false); });
  }, []);

  if (loading) return <div className="glass rounded-2xl p-5 hover-lift animate-scale-in"><p className="text-white/40 text-xs">Loading facts...</p></div>;
  if (error) return <div className="glass rounded-2xl p-5 hover-lift animate-scale-in"><p className="text-red-400 text-xs">{error}</p></div>;
  if (!facts.length) return null;

  const visible = facts.slice(startIndex, startIndex + 5);

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiInfo className="text-white" /> Weather Q&A
        </h3>
        <div className="flex gap-1">
          <button onClick={() => setStartIndex(Math.max(0, startIndex - 5))} disabled={startIndex === 0} className="text-[11px] text-white/20 hover:text-white/40 disabled:opacity-20">← Prev</button>
          <button onClick={() => setStartIndex(Math.min(Math.max(0, facts.length - 5), startIndex + 5))} disabled={startIndex >= facts.length - 5} className="text-[11px] text-white/20 hover:text-white/40 disabled:opacity-20">Next →</button>
        </div>
      </div>

      <div className="space-y-1.5">
        {visible.map((fact, i) => {
          const globalIndex = startIndex + i;
          return (
            <div key={globalIndex} className="rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === globalIndex ? null : globalIndex)}
                className="w-full flex items-center gap-2 p-2.5 bg-white/5 hover:bg-white/8 text-left transition-all"
              >
                <span className="text-sm text-white/30">💡</span>
                <span className="text-white/60 text-[11px] flex-1">{fact.title}</span>
                <span className={`text-[11px] text-white/20 transition-transform ${openIndex === globalIndex ? "rotate-180" : ""}`}><FiChevronDown className="text-white" /></span>
              </button>
              {openIndex === globalIndex && (
                <div className="px-3 py-2 bg-white/3">
                  <p className="text-white/40 text-[11px] leading-relaxed">{fact.fact}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeatherFacts;

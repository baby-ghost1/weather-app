import { useState, useEffect } from "react";
import { FiInfo, FiChevronDown, FiChevronRight } from "react-icons/fi";
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
      .catch(() => { setError("Failed to load facts"); setLoading(false); });
  }, []);

  if (loading) return <div className="glass rounded-2xl p-5 hover-lift animate-scale-in"><div className="shimmer h-4 w-32 rounded mb-3" /><div className="shimmer h-10 w-full rounded mb-2" /><div className="shimmer h-10 w-full rounded" /></div>;
  if (error) return <div className="glass rounded-2xl p-5 hover-lift animate-scale-in"><p className="text-red-400 text-xs">{error}</p></div>;
  if (!facts.length) return null;

  const visible = facts.slice(startIndex, startIndex + 5);
  const totalPages = Math.ceil(facts.length / 5);
  const currentPage = Math.floor(startIndex / 5) + 1;

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      {/* header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiInfo className="text-white" /> Weather Q&A
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-white/20 text-[10px]">{currentPage}/{totalPages}</span>
          <div className="flex gap-1">
            <button onClick={() => setStartIndex(Math.max(0, startIndex - 5))} disabled={startIndex === 0} className="w-6 h-6 rounded-lg bg-white/[0.04] flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/[0.08] disabled:opacity-20 disabled:hover:bg-transparent transition-all">
              <FiChevronRight className="rotate-180 text-[11px]" />
            </button>
            <button onClick={() => setStartIndex(Math.min(Math.max(0, facts.length - 5), startIndex + 5))} disabled={startIndex >= facts.length - 5} className="w-6 h-6 rounded-lg bg-white/[0.04] flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/[0.08] disabled:opacity-20 disabled:hover:bg-transparent transition-all">
              <FiChevronRight className="text-[11px]" />
            </button>
          </div>
        </div>
      </div>

      {/* facts list */}
      <div className="space-y-1.5">
        {visible.map((fact, i) => {
          const globalIndex = startIndex + i;
          const isOpen = openIndex === globalIndex;
          return (
            <div key={globalIndex} className={`rounded-xl overflow-hidden transition-all ${isOpen ? "bg-white/[0.06]" : "bg-white/[0.02]"}`}>
              <button
                onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                className="w-full flex items-center gap-2.5 p-3 text-left transition-all hover:bg-white/[0.04]"
              >
                <div className="w-6 h-6 rounded-lg bg-purple-400/10 flex items-center justify-center shrink-0">
                  <span className="text-[10px] text-purple-300 font-medium">{globalIndex + 1}</span>
                </div>
                <span className="text-white/70 text-[11px] flex-1 leading-relaxed">{fact.title}</span>
                <FiChevronDown className={`text-white/20 text-[11px] shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && (
                <div className="px-3 pb-3 pt-0">
                  <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                    <p className="text-white/40 text-[11px] leading-relaxed">{fact.fact}</p>
                  </div>
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

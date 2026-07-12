import { useState, useEffect } from "react";
import { FiClock, FiTrash2, FiX, FiChevronDown } from "react-icons/fi";
import { getHistory, clearHistory, deleteHistory } from "../services/api";

const SearchHistory = ({ onSelectCity }) => {
  const [history, setHistory] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const fetchHistory = async () => {
    try { const res = await getHistory(); if (res.success) setHistory(res.data); } catch { /* silent */ }
  };

  useEffect(() => { fetchHistory(); }, []);

  if (history.length === 0) return null;

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 text-white/40 hover:text-white/70 text-xs transition-colors mx-auto">
        <FiClock className="text-sm" />
        <span>Recent</span>
        <FiChevronDown className={`text-xs transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-80 glass-strong rounded-2xl shadow-2xl z-50 overflow-hidden animate-slide-down">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <span className="text-white/80 font-medium text-sm">Search History</span>
            <div className="flex items-center gap-3">
              <button onClick={async () => { try { await clearHistory(); setHistory([]); setIsOpen(false); } catch { /* silent */ } }}
                className="text-red-400 hover:text-red-300 text-xs transition-colors">Clear all</button>
              <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white/70 transition-colors"><FiX /></button>
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {history.map((item) => (
              <div key={item._id} onClick={() => { onSelectCity(item.city); setIsOpen(false); }}
                className="flex items-center justify-between px-4 py-3 hover:bg-white/10 cursor-pointer transition-colors border-b border-white/5 last:border-b-0"
              >
                <div>
                  <p className="text-white text-sm font-medium">{item.city}, {item.country}</p>
                  <p className="text-white/40 text-xs">{item.temp}° · {item.weather}</p>
                </div>
                <button onClick={async (e) => { e.stopPropagation(); try { await deleteHistory(item._id); setHistory((p) => p.filter((h) => h._id !== item._id)); } catch { /* silent */ } }}
                  className="text-white/20 hover:text-red-400 transition-colors"><FiTrash2 className="text-sm" /></button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchHistory;

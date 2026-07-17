import { useState, useRef, useEffect, useCallback } from "react";
import { FiSearch, FiMapPin, FiX } from "react-icons/fi";

let debounceTimer = null;

const SearchBar = ({ onSearch, onLocation, loading }) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [fetching, setFetching] = useState(false);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "/" && !e.ctrlKey && !e.metaKey && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        inputRef.current?.blur();
        setIsFocused(false);
        setSuggestions([]);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setSuggestions([]);
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = useCallback((value) => {
    clearTimeout(debounceTimer);
    if (value.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    setFetching(true);
    debounceTimer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&limit=8&addressdetails=1`,
          { headers: { "User-Agent": "WeatherFlow/1.0" } }
        );
        const data = await res.json();
        const places = data.reduce((acc, d) => {
          if (!(d.type === "city" || d.type === "town" || d.type === "village" || d.type === "hamlet" || d.type === "administrative" || d.class === "place")) return acc;
          const addr = d.address || {};
          const parts = [];
          if (addr.state) parts.push(addr.state);
          if (addr.country) parts.push(addr.country);
          acc.push({
            name: d.display_name.split(",")[0],
            fullName: d.display_name,
            state: addr.state || "",
            country: addr.country || "",
            country_code: addr.country_code?.toUpperCase() || "",
            display: parts.join(", "),
            lat: parseFloat(d.lat),
            lon: parseFloat(d.lon),
            type: d.type,
          });
          return acc;
        }, []);
        setSuggestions(places.slice(0, 6));
      } catch {
        setSuggestions([]);
      } finally {
        setFetching(false);
      }
    }, 300);
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    fetchSuggestions(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && suggestions.length > 0) {
      handleSuggestionClick(suggestions[0]);
    }
  };

  const handleSuggestionClick = (s) => {
    setQuery(`${s.name}${s.display ? ", " + s.display : ""}`);
    onSearch(s.name, s.lat, s.lon);
    setIsFocused(false);
    setSuggestions([]);
  };

  const handleBlur = () => {
    setTimeout(() => setIsFocused(false), 200);
  };

  return (
    <div ref={wrapperRef} className="w-full relative">
      <form onSubmit={handleSubmit}>
        <div
          className={`glass-strong rounded-2xl flex items-center gap-3 px-5 py-3 transition-all duration-300 ${
            isFocused ? "ring-2 ring-white/30 shadow-lg shadow-white/10" : ""
          }`}
        >
          <FiSearch className="text-white/60 text-lg shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            placeholder="Search city, town or village... (press / to focus)"
            className="flex-1 bg-transparent text-white placeholder:text-white/40 outline-none text-lg"
            autoComplete="off"
          />
          {query && (
            <button type="button" onClick={() => { setQuery(""); setSuggestions([]); inputRef.current?.focus(); }} aria-label="Clear search" className="text-white/40 hover:text-white transition-colors">
              <FiX className="text-lg" />
            </button>
          )}
          <div className="w-px h-6 bg-white/20" />
          <button type="submit" disabled={loading || !query.trim()} aria-label="Search" className="text-white/60 hover:text-white transition-colors disabled:opacity-30">
            <FiSearch className="text-xl" />
          </button>
          <button type="button" onClick={onLocation} disabled={loading} aria-label="Use my location" className="text-white/60 hover:text-white transition-colors disabled:opacity-30" title="Use my location">
            <FiMapPin className="text-xl" />
          </button>
        </div>
      </form>

      {suggestions.length > 0 && (
        <div className="absolute w-full mt-2 glass-strong rounded-xl shadow-2xl z-50 overflow-hidden animate-slide-down max-h-80 overflow-y-auto">
          {suggestions.map((s, i) => (
            <button
              key={s.fullName}
              onMouseDown={() => handleSuggestionClick(s)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-left border-b border-white/5 last:border-b-0"
            >
              <FiMapPin className="text-white/30 text-sm shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-white text-sm font-medium">{s.name}</p>
                <p className="text-white/40 text-[11px] truncate">
                  {s.state && <span>{s.state}, </span>}
                  {s.country}
                  <span className="text-white/20 ml-1.5 capitalize">({s.type})</span>
                </p>
              </div>
              {s.country_code && (
                <span className="text-white/20 text-[11px] shrink-0">{s.country_code}</span>
              )}
            </button>
          ))}
        </div>
      )}

      {isFocused && suggestions.length === 0 && (
        <p className="absolute right-4 top-full mt-2 text-white/30 text-xs animate-fade-in">
          {fetching ? "Searching..." : "Press Enter to search · Esc to close"}
        </p>
      )}
    </div>
  );
};

export default SearchBar;

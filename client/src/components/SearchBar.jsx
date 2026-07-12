import { useState, useRef, useEffect } from "react";
import { FiSearch, FiMapPin, FiX } from "react-icons/fi";

const SearchBar = ({ onSearch, onLocation, loading }) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "/" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        inputRef.current?.blur();
        setIsFocused(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setIsFocused(false);
    }
  };

  const handleBlur = () => {
    setTimeout(() => setIsFocused(false), 200);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full relative">
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
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          placeholder="Search city... (press / to focus)"
          className="flex-1 bg-transparent text-white placeholder:text-white/40 outline-none text-lg"
        />
        {query && (
          <button type="button" onClick={() => { setQuery(""); inputRef.current?.focus(); }} className="text-white/40 hover:text-white transition-colors">
            <FiX className="text-lg" />
          </button>
        )}
        <div className="w-px h-6 bg-white/20" />
        <button type="submit" disabled={loading || !query.trim()} className="text-white/60 hover:text-white transition-colors disabled:opacity-30">
          <FiSearch className="text-xl" />
        </button>
        <button type="button" onClick={onLocation} disabled={loading} className="text-white/60 hover:text-white transition-colors disabled:opacity-30" title="Use my location">
          <FiMapPin className="text-xl" />
        </button>
      </div>
      {isFocused && (
        <p className="absolute right-4 top-full mt-2 text-white/30 text-xs animate-fade-in">
          Press Enter to search · Esc to close
        </p>
      )}
    </form>
  );
};

export default SearchBar;

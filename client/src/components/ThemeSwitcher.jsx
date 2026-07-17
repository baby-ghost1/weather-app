import { useState, useEffect } from "react";
import { FiDroplet } from "react-icons/fi";
import { getContent } from "../services/api";

const ThemeSwitcher = () => {
  const [themes, setThemes] = useState([]);
  const [activeTheme, setActiveTheme] = useState("Ocean");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getContent("themes")
      .then((res) => { setThemes(res || []); setLoading(false); })
      .catch((err) => { setLoading(false); });
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("weather_theme");
    if (stored) {
      setActiveTheme(stored);
    }
    applyTheme(stored || "Ocean");
  }, [themes]);

  const applyTheme = (name) => {
    const theme = themes.find((t) => t.name === name);
    if (theme && theme.colors?.length) {
      document.documentElement.style.setProperty("--custom-bg", `linear-gradient(135deg, ${theme.colors.join(", ")})`);
    } else {
      document.documentElement.style.removeProperty("--custom-bg");
    }
  };

  const selectTheme = (name) => {
    setActiveTheme(name);
    localStorage.setItem("weather_theme", name);
    applyTheme(name);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass rounded-full px-3 py-2 text-white/50 hover:text-white text-xs font-medium transition-all duration-300 hover:scale-105"
        title="Change theme"
      >
        <FiDroplet className="text-white" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 glass-strong rounded-xl p-3 w-48 z-50 animate-slide-down">
            <p className="text-white/30 text-[11px] mb-2 uppercase tracking-wider">Themes</p>
            <div className="grid grid-cols-3 gap-2">
              {(!loading ? themes : []).map((t) => (
                <button
                  key={t.name}
                  onClick={() => selectTheme(t.name)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                    activeTheme === t.name ? "bg-white/20" : "hover:bg-white/10"
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-full border-2"
                    style={{
                      background: t.colors?.length ? `linear-gradient(135deg, ${t.colors.join(", ")})` : "linear-gradient(135deg, #1a9fff, #6dd5fa, #ffecd2)",
                      borderColor: activeTheme === t.name ? "white" : "rgba(255,255,255,0.2)",
                    }}
                  />
                  <span className="text-white/50 text-[11px]">{t.name}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSwitcher;

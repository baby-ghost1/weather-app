import { useState, useEffect } from "react";
import { FiCoffee } from "react-icons/fi";
import { getContent } from "../services/api";

const WeatherRecipe = ({ weather }) => {
  const [recipeList, setRecipeList] = useState([]);
  const [category, setCategory] = useState("Everyday");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!weather) return;
    setLoading(true);
    const isHot = weather.temp > 30;
    const isCold = weather.temp < 15;
    const isRainy = ["Rain", "Drizzle", "Thunderstorm"].includes(weather.main);
    const cat = isRainy ? "rainy" : isHot ? "hot" : isCold ? "cold" : "default";
    setCategory(isRainy ? "Rainy Day" : isHot ? "Summer Cool" : isCold ? "Winter Warm" : "Everyday");

    getContent("recipes", { category: cat })
      .then((res) => { setRecipeList(res); setLoading(false); })
      .catch((err) => { setError("Failed to load recipes"); setLoading(false); });
  }, [weather]);

  if (!weather) return null;

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiCoffee className="text-white" /> Weather Recipe
        </h3>
        <span className="text-[11px] text-white/30">{category}</span>
      </div>

      <p className="text-white/40 text-xs mb-2">What to cook in {weather.main} weather ({weather.temp}°)</p>

      <div className="space-y-1.5">
        {recipeList.map((r, i) => (
          <div key={r.name} className="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
            <span className="text-lg">{r.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-white/80 text-xs">{r.name}</p>
              <p className="text-white/30 text-[11px]">{r.desc}</p>
            </div>
            <span className="text-white/20 text-[11px]">{r.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherRecipe;

import { useState, useEffect } from "react";
import { FiStar, FiTrash2 } from "react-icons/fi";

const Favorites = ({ onSelectCity }) => {
  const [favorites, setFavorites] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("weather_favorites");
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  const save = (favs) => {
    setFavorites(favs);
    localStorage.setItem("weather_favorites", JSON.stringify(favs));
  };

  const addFavorite = (city) => {
    if (!city || favorites.some((f) => f.city === city)) return;
    save([...favorites, { city, addedAt: Date.now() }]);
  };

  const removeFavorite = (city, e) => {
    e.stopPropagation();
    save(favorites.filter((f) => f.city !== city));
  };

  return { favorites, addFavorite, removeFavorite, isOpen, setIsOpen, FavoritesUI: () => (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 text-white/40 hover:text-white/70 text-xs transition-colors mx-auto">
        <FiStar className="text-sm" />
        <span>Favorites ({favorites.length})</span>
      </button>

      {isOpen && favorites.length > 0 && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-72 glass-strong rounded-2xl shadow-2xl z-50 overflow-hidden animate-slide-down">
          <div className="px-4 py-3 border-b border-white/10">
            <span className="text-white/80 font-medium text-sm">Favorite Cities</span>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {favorites.map((fav) => (
              <div key={fav.city} onClick={() => { onSelectCity(fav.city); setIsOpen(false); }}
                className="flex items-center justify-between px-4 py-3 hover:bg-white/10 cursor-pointer transition-colors border-b border-white/5 last:border-b-0"
              >
                <span className="text-white text-sm">{fav.city}</span>
                <button onClick={(e) => removeFavorite(fav.city, e)} className="text-white/20 hover:text-red-400 transition-colors">
                  <FiTrash2 className="text-sm" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )};
};

export default Favorites;

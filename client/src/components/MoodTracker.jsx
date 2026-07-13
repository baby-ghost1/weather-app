import { useMemo } from "react";
import { FiSmile, FiCloud, FiHeart, FiAlertTriangle, FiMoon, FiXOctagon, FiMeh } from "react-icons/fi";

const moodIconMap = {
  Happy: <FiSmile color="#00e400" />,
  "Energetic but hot": <FiSmile color="#ff9800" />,
  Calm: <FiCloud color="#60a5fa" />,
  Cozy: <FiHeart color="#a78bfa" />,
  Anxious: <FiAlertTriangle color="#f87171" />,
  Lazy: <FiMoon color="#94a3b8" />,
  Sluggish: <FiXOctagon color="#fb923c" />,
  Neutral: <FiMeh color="#9ca3af" />,
};

const getMoodIcon = (moodName) => moodIconMap[moodName] || <FiMeh color="#9ca3af" />;

const getMoodFromWeather = (main, temp) => {
  if (main === "Clear" && temp >= 20 && temp <= 30) return { mood: "Happy", emoji: "😊", score: 85 };
  if (main === "Clear" && temp > 30) return { mood: "Energetic", emoji: "🥵", score: 65 };
  if (main === "Clouds") return { mood: "Calm", emoji: "😌", score: 70 };
  if (["Rain", "Drizzle"].includes(main)) return { mood: "Cozy", emoji: "🥰", score: 60 };
  if (main === "Thunderstorm") return { mood: "Anxious", emoji: "😰", score: 35 };
  if (temp < 10) return { mood: "Lazy", emoji: "🥱", score: 45 };
  if (temp > 35) return { mood: "Sluggish", emoji: "🥴", score: 30 };
  return { mood: "Neutral", emoji: "😐", score: 50 };
};

const MoodTracker = ({ weather }) => {
  const currentMood = useMemo(() => {
    if (!weather) return null;
    return getMoodFromWeather(weather.main, weather.temp);
  }, [weather]);

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiSmile className="text-white" /> Mood Tracker
        </h3>
      </div>

      {currentMood && (
        <>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl">{getMoodIcon(currentMood.mood)}</span>
            <div>
              <p className="text-white text-base font-semibold">{currentMood.mood}</p>
              <p className="text-white/40 text-[11px]">Weather influence: {currentMood.score}%</p>
            </div>
          </div>

          <div className="flex justify-center items-center mt-8 mb-4">
            <span className="text-8xl drop-shadow-2xl">
              {currentMood.emoji || "😐"}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default MoodTracker;
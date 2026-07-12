import { useState } from "react";
import { FiShare2, FiCheck } from "react-icons/fi";
import { useUnit } from "../context/UnitContext";

const ShareWeather = ({ weather }) => {
  const [copied, setCopied] = useState(false);
  const { tempUnit, speedUnit } = useUnit();

  if (!weather) return null;

  const shareText = [
    `🌤 ${weather.city}, ${weather.country}`,
    `🌡 ${weather.temp}${tempUnit} (Feels like ${weather.feelsLike}${tempUnit})`,
    `💧 Humidity: ${weather.humidity}%`,
    `💨 Wind: ${weather.windSpeed} ${speedUnit}`,
    `☁ ${weather.description}`,
    ``,
    `— via WeatherFlow`,
  ].join("\n");

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: `Weather in ${weather.city}`, text: shareText }); } catch { /* cancel */ }
    } else {
      try { await navigator.clipboard.writeText(shareText); } catch { /* fallback handled below */ }
      try {
        const ta = document.createElement("textarea");
        ta.value = shareText;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      } catch { /* ignore */ }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button onClick={handleShare} className="glass rounded-full px-4 py-2 text-white/50 hover:text-white text-xs font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2" title="Share weather">
      {copied ? <><FiCheck className="text-green-400" /><span className="text-green-400">Copied!</span></> : <><FiShare2 /><span>Share</span></>}
    </button>
  );
};

export default ShareWeather;

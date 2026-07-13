import { useMemo } from "react";
import { FiRss, FiAlertTriangle, FiInfo, FiSun, FiCloudRain, FiWind, FiThermometer } from "react-icons/fi";

const getWeatherNews = (weather, forecast) => {
  if (!weather) return [];
  const news = [];
  const { temp, main, humidity, windSpeed, visibility, pressure } = weather;

  if (temp > 40) {
    news.push({ type: "warning", icon: <FiThermometer className="text-white" />, title: "Extreme Heat Alert", text: `Temperature at ${temp}° — stay hydrated, avoid outdoor activities between 12–4 PM.`, time: "Now" });
  } else if (temp > 35) {
    news.push({ type: "caution", icon: <FiSun className="text-white" />, title: "Heat Advisory", text: `It's ${temp}° outside. Wear light clothing and carry water if going out.`, time: "Now" });
  } else if (temp < 5) {
    news.push({ type: "warning", icon: <FiWind className="text-white" />, title: "Cold Wave Warning", text: `Temperature dropped to ${temp}°. Layer up and limit outdoor exposure.`, time: "Now" });
  }

  if (main === "Thunderstorm") {
    news.push({ type: "warning", icon: <FiAlertTriangle className="text-white" />, title: "Thunderstorm Active", text: "Stay indoors, unplug electronics, and avoid open areas. Power outages possible.", time: "Now" });
  }

  if (main === "Rain" || main === "Drizzle") {
    news.push({ type: "info", icon: <FiCloudRain className="text-white" />, title: "Rainfall Update", text: `Ongoing ${main.toLowerCase()} expected. Roads may be slippery — drive carefully.`, time: "Now" });
  }

  if (humidity > 85) {
    news.push({ type: "caution", icon: <FiInfo className="text-white" />, title: "High Humidity Alert", text: `Humidity at ${humidity}%. Expect muggy conditions. Use dehumidifier indoors.`, time: "Now" });
  }

  if (windSpeed > 20) {
    news.push({ type: "warning", icon: <FiWind className="text-white" />, title: "High Wind Advisory", text: `Wind speeds at ${windSpeed} m/s. Secure loose objects and avoid tree-lined roads.`, time: "Now" });
  }

  if (visibility < 1000) {
    news.push({ type: "warning", icon: <FiAlertTriangle className="text-white" />, title: "Low Visibility Warning", text: `Visibility below ${(visibility / 1000).toFixed(1)} km. Use fog lights while driving.`, time: "Now" });
  }

  if (forecast?.daily?.length > 0) {
    const tomorrow = forecast.daily[1];
    if (tomorrow) {
      const diff = tomorrow.tempMax - temp;
      if (diff > 5) {
        news.push({ type: "info", icon: <FiSun className="text-white" />, title: "Tomorrow: Getting Warmer", text: `Temperature expected to rise to ${tomorrow.tempMax}°. Plan accordingly.`, time: "Tomorrow" });
      } else if (diff < -5) {
        news.push({ type: "info", icon: <FiWind className="text-white" />, title: "Tomorrow: Temperature Drop", text: `Temperature expected to drop to ${tomorrow.tempMax}°. Keep warm clothes ready.`, time: "Tomorrow" });
      }
      if (tomorrow.pop > 60) {
        news.push({ type: "info", icon: <FiCloudRain className="text-white" />, title: "Rain Expected Tomorrow", text: `${tomorrow.pop}% chance of rain. Carry an umbrella.`, time: "Tomorrow" });
      }
    }
  }

  if (pressure < 1000) {
    news.push({ type: "info", icon: <FiInfo className="text-white" />, title: "Low Pressure System", text: "Barometric pressure is low — weather may change rapidly. Stay updated.", time: "Now" });
  }

  if (news.length === 0) {
    news.push({ type: "info", icon: <FiSun className="text-white" />, title: "Pleasant Weather", text: `Current conditions are comfortable at ${temp}° with ${weather.description}. Enjoy your day!`, time: "Now" });
  }

  return news.slice(0, 4);
};

const typeStyles = {
  warning: "border-l-red-400/60",
  caution: "border-l-orange-400/60",
  info: "border-l-blue-400/60",
};

const WeatherNews = ({ weather, forecast }) => {
  const news = useMemo(() => getWeatherNews(weather, forecast), [weather, forecast]);

  if (!weather) return null;

  return (
    <div className="glass rounded-2xl p-5 hover-lift animate-scale-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
          <FiRss className="text-white" /> Weather News
        </h3>
        <span className="text-white/30 text-[11px]">{weather.city}</span>
      </div>

      <div className="space-y-2">
        {news.map((item, i) => (
          <div key={i} className={`p-2.5 rounded-lg bg-white/5 border-l-2 ${typeStyles[item.type] || typeStyles.info}`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-white/30">{item.icon}</span>
              <span className="text-white/70 text-xs font-medium">{item.title}</span>
              <span className="text-white/20 text-[11px] ml-auto">{item.time}</span>
            </div>
            <p className="text-white/40 text-[11px] leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherNews;

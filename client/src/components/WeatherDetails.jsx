import { WiSunrise, WiSunset, WiBarometer, WiHumidity, WiThermometer, WiStrongWind, WiRaindrop, WiDayFog, WiRain, WiSnow } from "react-icons/wi";
import { useUnit } from "../context/UnitContext";
import { formatTime, getWindDirection } from "../utils/format";

const DetailItem = ({ icon, label, value, color }) => (
  <div className="glass rounded-2xl p-4 flex flex-col items-center justify-center gap-1 hover-lift animate-scale-in">
    <div className={`text-3xl ${color}`}>{icon}</div>
    <p className="text-white text-lg font-medium">{value}</p>
    <p className="text-white/50 text-xs">{label}</p>
  </div>
);

const WeatherDetails = ({ weather }) => {
  const { tempUnit, speedUnit } = useUnit();
  if (!weather) return null;

  const items = [
    { icon: <WiThermometer className="text-white" />, label: "Feels Like", value: `${weather.feelsLike}${tempUnit}`, color: "text-orange-300" },
    { icon: <WiHumidity className="text-white" />, label: "Humidity", value: `${weather.humidity}%`, color: "text-blue-300" },
    { icon: <WiStrongWind className="text-white" />, label: "Wind", value: `${weather.windSpeed} ${speedUnit}`, color: "text-cyan-300" },
    { icon: <WiBarometer className="text-white" />, label: "Pressure", value: `${weather.pressure} hPa`, color: "text-purple-300" },
    { icon: <WiDayFog className="text-white" />, label: "Visibility", value: `${weather.visibility ? (weather.visibility / 1000).toFixed(1) : "N/A"} km`, color: "text-gray-300" },
    { icon: <WiRaindrop className="text-white" />, label: "Clouds", value: `${weather.clouds || 0}%`, color: "text-sky-300" },
  ];

  if (weather.rain > 0) {
    items.push({ icon: <WiRain className="text-white" />, label: "Rain (1h)", value: `${weather.rain} mm`, color: "text-blue-400" });
  }
  if (weather.snow > 0) {
    items.push({ icon: <WiSnow className="text-white" />, label: "Snow (1h)", value: `${weather.snow} mm`, color: "text-white" });
  }
  if (weather.windGust) {
    items.push({ icon: <WiStrongWind className="text-white" />, label: "Wind Gust", value: `${weather.windGust} ${speedUnit}`, color: "text-cyan-400" });
  }

  items.push({ icon: <WiStrongWind className="text-white" />, label: "Wind Dir", value: getWindDirection(weather.windDeg), color: "text-teal-300" });

  if (weather.sunrise) {
    items.push({ icon: <WiSunrise className="text-white" />, label: "Sunrise", value: formatTime(weather.sunrise), color: "text-yellow-300" });
  }
  if (weather.sunset) {
    items.push({ icon: <WiSunset className="text-white" />, label: "Sunset", value: formatTime(weather.sunset), color: "text-orange-400" });
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-slide-up">
      {items.map((item, i) => <DetailItem key={i} {...item} />)}
    </div>
  );
};

export default WeatherDetails;

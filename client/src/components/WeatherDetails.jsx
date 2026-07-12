import { WiSunrise, WiSunset, WiBarometer, WiHumidity, WiThermometer, WiStrongWind, WiRaindrop, WiDayFog } from "react-icons/wi";
import { useUnit } from "../context/UnitContext";

const DetailItem = ({ icon, label, value, color }) => (
  <div className="glass rounded-2xl p-4 flex flex-col items-center justify-center gap-1 hover-lift animate-scale-in">
    <div className={`text-3xl ${color}`}>{icon}</div>
    <p className="text-white text-lg font-medium">{value}</p>
    <p className="text-white/50 text-xs">{label}</p>
  </div>
);

const formatTime = (ts) =>
  new Date(ts * 1000).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

const WeatherDetails = ({ weather }) => {
  const { tempUnit, speedUnit } = useUnit();
  if (!weather) return null;

  const items = [
    { icon: <WiThermometer />, label: "Feels Like", value: `${weather.feelsLike}${tempUnit}`, color: "text-orange-300" },
    { icon: <WiHumidity />, label: "Humidity", value: `${weather.humidity}%`, color: "text-blue-300" },
    { icon: <WiStrongWind />, label: "Wind", value: `${weather.windSpeed} ${speedUnit}`, color: "text-cyan-300" },
    { icon: <WiBarometer />, label: "Pressure", value: `${weather.pressure} hPa`, color: "text-purple-300" },
    ...(weather.sunrise ? [{ icon: <WiSunrise />, label: "Sunrise", value: formatTime(weather.sunrise), color: "text-yellow-300" }] : []),
    ...(weather.sunset ? [{ icon: <WiSunset />, label: "Sunset", value: formatTime(weather.sunset), color: "text-orange-400" }] : []),
    { icon: <WiDayFog />, label: "Visibility", value: `${weather.visibility ? (weather.visibility / 1000).toFixed(1) : "N/A"} km`, color: "text-gray-300" },
    { icon: <WiRaindrop />, label: "Clouds", value: `${weather.clouds || 0}%`, color: "text-sky-300" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-slide-up">
      {items.map((item, i) => <DetailItem key={i} {...item} />)}
    </div>
  );
};

export default WeatherDetails;

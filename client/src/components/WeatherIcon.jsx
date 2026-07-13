import { iconMap, iconColors } from "../constants/weatherIcons";
import { WiDaySunny } from "react-icons/wi";

const WeatherIcon = ({ main, size = "text-3xl" }) => {
  const key = ["Mist", "Haze", "Fog"].includes(main) ? "Haze" : main;
  const Icon = iconMap[key] || WiDaySunny;
  return <Icon className={`${size} ${iconColors[key] || iconColors.Clear}`} />;
};

export default WeatherIcon;

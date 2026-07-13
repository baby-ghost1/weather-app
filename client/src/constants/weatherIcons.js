import { WiDaySunny, WiCloud, WiRain, WiSnow, WiDayHaze, WiStrongWind, WiThunderstorm, WiFog } from "react-icons/wi";

export const iconMap = {
  Clear: WiDaySunny, Clouds: WiCloud, Rain: WiRain, Drizzle: WiRain,
  Snow: WiSnow, Mist: WiDayHaze, Haze: WiDayHaze, Fog: WiDayHaze,
  Thunderstorm: WiThunderstorm, Smoke: WiFog, Dust: WiFog, Ash: WiFog,
  Squall: WiStrongWind, Tornado: WiStrongWind,
};

export const iconColors = {
  Clear: "text-yellow-300", Clouds: "text-gray-200", Rain: "text-blue-300",
  Drizzle: "text-blue-200", Snow: "text-white", Haze: "text-gray-300",
  Thunderstorm: "text-yellow-400", Mist: "text-gray-300", Fog: "text-gray-300",
  Smoke: "text-gray-300", Dust: "text-gray-300", Ash: "text-gray-300",
  Squall: "text-cyan-300", Tornado: "text-gray-400",
};

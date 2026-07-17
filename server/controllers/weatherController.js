const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const GEO_URL = "https://api.openweathermap.org/geo/1.0/reverse";

const fetchWithRetry = async (url, retries = 2) => {
  for (let i = 0; i <= retries; i++) {
    try {
      return await fetch(url);
    } catch (err) {
      if (i === retries) throw err;
      await new Promise((r) => setTimeout(r, 300 * (i + 1)));
    }
  }
};

export const formatWeatherData = (data, stateName) => ({
  city: data.name,
  country: data.sys.country,
  state: stateName || "",
  temp: Math.round(data.main.temp),
  feelsLike: Math.round(data.main.feels_like),
  humidity: data.main.humidity,
  windSpeed: data.wind.speed,
  windDeg: data.wind.deg,
  windGust: data.wind.gust || null,
  description: data.weather[0].description,
  main: data.weather[0].main,
  icon: data.weather[0].icon,
  weatherId: data.weather[0].id,
  pressure: data.main.pressure,
  visibility: data.visibility,
  lat: data.coord.lat,
  lon: data.coord.lon,
  sunrise: data.sys.sunrise,
  sunset: data.sys.sunset,
  clouds: data.clouds.all,
  timezone: data.timezone,
  rain: data.rain?.["1h"] || 0,
  snow: data.snow?.["1h"] || 0,
  dt: data.dt,
});

const getStateName = async (lat, lon) => {
  try {
    const url = `${GEO_URL}?lat=${lat}&lon=${lon}&limit=1&appid=${process.env.OPENWEATHER_API_KEY}`;
    const response = await fetchWithRetry(url);
    if (!response.ok) return "";
    const data = await response.json();
    return data[0]?.state || "";
  } catch {
    return "";
  }
};

export const fetchWeatherByCity = async (city, units = "metric") => {
  const url = `${BASE_URL}?q=${encodeURIComponent(city)}&units=${units}&appid=${process.env.OPENWEATHER_API_KEY}`;
  const response = await fetchWithRetry(url);
  if (!response.ok) return { success: false, message: "Error fetching weather" };
  const data = await response.json();
  const [stateName] = await Promise.all([getStateName(data.coord.lat, data.coord.lon)]);
  return { success: true, data: formatWeatherData(data, stateName) };
};

export const fetchWeatherByCoords = async (lat, lon, units = "metric") => {
  const url = `${BASE_URL}?lat=${lat}&lon=${lon}&units=${units}&appid=${process.env.OPENWEATHER_API_KEY}`;
  const response = await fetchWithRetry(url);
  if (!response.ok) return { success: false, message: "Error fetching weather" };
  const data = await response.json();
  const [stateName] = await Promise.all([getStateName(lat, lon)]);
  return { success: true, data: formatWeatherData(data, stateName) };
};

export const getWeatherByCity = async (req, res, next) => {
  try {
    const { city } = req.params;
    const { units = "metric" } = req.query;

    if (!city || city.trim() === "") {
      return res.status(400).json({ success: false, message: "City name is required" });
    }

    const result = await fetchWeatherByCity(city, units);
    if (!result.success) return res.status(500).json(result);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getWeatherByCoords = async (req, res, next) => {
  try {
    const { lat, lon } = req.params;
    const { units = "metric" } = req.query;

    const result = await fetchWeatherByCoords(lat, lon, units);
    if (!result.success) return res.status(500).json(result);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

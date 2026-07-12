const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

const formatWeatherData = (data) => ({
  city: data.name,
  country: data.sys.country,
  temp: Math.round(data.main.temp),
  feelsLike: Math.round(data.main.feels_like),
  humidity: data.main.humidity,
  windSpeed: data.wind.speed,
  windDeg: data.wind.deg,
  description: data.weather[0].description,
  main: data.weather[0].main,
  icon: data.weather[0].icon,
  pressure: data.main.pressure,
  visibility: data.visibility,
  lat: data.coord.lat,
  lon: data.coord.lon,
  sunrise: data.sys.sunrise,
  sunset: data.sys.sunset,
  clouds: data.clouds.all,
  timezone: data.timezone,
});

export const getWeatherByCity = async (req, res, next) => {
  try {
    const { city } = req.params;
    const { units = "metric" } = req.query;

    if (!city || city.trim() === "") {
      return res.status(400).json({ success: false, message: "City name is required" });
    }

    const url = `${BASE_URL}?q=${encodeURIComponent(city)}&units=${units}&appid=${process.env.OPENWEATHER_API_KEY}`;
    const response = await fetch(url);

    if (response.status === 404) {
      return res.status(404).json({ success: false, message: "City not found. Please check spelling." });
    }
    if (response.status === 401) {
      return res.status(401).json({ success: false, message: "Invalid API key" });
    }
    if (!response.ok) {
      return res.status(response.status).json({ success: false, message: "Error fetching weather data" });
    }

    const data = await response.json();
    res.json({ success: true, data: formatWeatherData(data) });
  } catch (error) {
    next(error);
  }
};

export const getWeatherByCoords = async (req, res, next) => {
  try {
    const { lat, lon } = req.params;
    const { units = "metric" } = req.query;

    const url = `${BASE_URL}?lat=${lat}&lon=${lon}&units=${units}&appid=${process.env.OPENWEATHER_API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({ success: false, message: "Error fetching weather data" });
    }

    const data = await response.json();
    res.json({ success: true, data: formatWeatherData(data) });
  } catch (error) {
    next(error);
  }
};

const BASE_URL = "https://api.openweathermap.org/data/2.5/forecast";

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

const formatHourlyItem = (item) => ({
  dt: item.dt,
  dtTxt: item.dt_txt,
  temp: Math.round(item.main.temp),
  feelsLike: Math.round(item.main.feels_like),
  humidity: item.main.humidity,
  pressure: item.main.pressure,
  weather: item.weather[0].main,
  icon: item.weather[0].icon,
  description: item.weather[0].description,
  windSpeed: item.wind.speed,
  windDeg: item.wind.deg,
  clouds: item.clouds.all,
  pop: Math.round((item.pop || 0) * 100),
  rain: item.rain?.["3h"] || 0,
  snow: item.snow?.["3h"] || 0,
  visibility: item.visibility || 10000,
});

const buildForecast = (data) => {
  const hourly = data.list.map(formatHourlyItem);

  const dailyForecast = {};
  data.list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];
    if (!dailyForecast[date]) {
      dailyForecast[date] = {
        date,
        temps: [],
        weather: item.weather[0].main,
        icon: item.weather[0].icon,
        description: item.weather[0].description,
        humidity: item.main.humidity,
        windSpeed: item.wind.speed,
        windDeg: item.wind.deg,
        clouds: item.clouds.all,
        pops: [],
        rain: 0,
        snow: 0,
      };
    }
    dailyForecast[date].temps.push(item.main.temp);
    dailyForecast[date].pops.push(Math.round((item.pop || 0) * 100));
    dailyForecast[date].rain += item.rain?.["3h"] || 0;
    dailyForecast[date].snow += item.snow?.["3h"] || 0;
  });

  const forecast = Object.values(dailyForecast)
    .slice(0, 7)
    .map((day) => ({
      date: day.date,
      weather: day.weather,
      icon: day.icon,
      description: day.description,
      humidity: day.humidity,
      windSpeed: day.windSpeed,
      windDeg: day.windDeg,
      clouds: day.clouds,
      tempMin: Math.round(Math.min(...day.temps)),
      tempMax: Math.round(Math.max(...day.temps)),
      pop: Math.max(...day.pops),
      rain: Math.round(day.rain * 10) / 10,
      snow: Math.round(day.snow * 10) / 10,
    }));

  return { hourly, daily: forecast };
};

export const fetchForecastByCity = async (city, units = "metric") => {
  const url = `${BASE_URL}?q=${encodeURIComponent(city)}&units=${units}&appid=${process.env.OPENWEATHER_API_KEY}`;
  const response = await fetchWithRetry(url);
  if (!response.ok) return { success: false, message: "Error fetching forecast" };
  const data = await response.json();
  return { success: true, data: buildForecast(data) };
};

export const fetchForecastByCoords = async (lat, lon, units = "metric") => {
  const url = `${BASE_URL}?lat=${lat}&lon=${lon}&units=${units}&appid=${process.env.OPENWEATHER_API_KEY}`;
  const response = await fetchWithRetry(url);
  if (!response.ok) return { success: false, message: "Error fetching forecast" };
  const data = await response.json();
  return { success: true, data: buildForecast(data) };
};

export const getForecastByCity = async (req, res, next) => {
  try {
    const { city } = req.params;
    const { units = "metric" } = req.query;

    if (!city || city.trim() === "") {
      return res.status(400).json({ success: false, message: "City name is required" });
    }

    const result = await fetchForecastByCity(city, units);
    if (!result.success) return res.status(500).json(result);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getForecastByCoords = async (req, res, next) => {
  try {
    const { lat, lon } = req.params;
    const { units = "metric" } = req.query;

    const result = await fetchForecastByCoords(lat, lon, units);
    if (!result.success) return res.status(500).json(result);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

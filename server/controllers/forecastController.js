const BASE_URL = "https://api.openweathermap.org/data/2.5/forecast";

export const getForecastByCity = async (req, res, next) => {
  try {
    const { city } = req.params;
    const { units = "metric" } = req.query;

    if (!city || city.trim() === "") {
      return res.status(400).json({ success: false, message: "City name is required" });
    }

    const url = `${BASE_URL}?q=${encodeURIComponent(city)}&units=${units}&appid=${process.env.OPENWEATHER_API_KEY}`;
    const response = await fetch(url);

    if (response.status === 404) {
      return res.status(404).json({ success: false, message: "City not found" });
    }
    if (!response.ok) {
      return res.status(response.status).json({ success: false, message: "Error fetching forecast" });
    }

    const data = await response.json();

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
        };
      }
      dailyForecast[date].temps.push(item.main.temp);
    });

    const forecast = Object.values(dailyForecast)
      .slice(0, 5)
      .map((day) => ({
        ...day,
        tempMin: Math.round(Math.min(...day.temps)),
        tempMax: Math.round(Math.max(...day.temps)),
        temps: undefined,
      }));

    res.json({ success: true, data: forecast });
  } catch (error) {
    next(error);
  }
};

export const getForecastByCoords = async (req, res, next) => {
  try {
    const { lat, lon } = req.params;
    const { units = "metric" } = req.query;

    const url = `${BASE_URL}?lat=${lat}&lon=${lon}&units=${units}&appid=${process.env.OPENWEATHER_API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({ success: false, message: "Error fetching forecast" });
    }

    const data = await response.json();

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
        };
      }
      dailyForecast[date].temps.push(item.main.temp);
    });

    const forecast = Object.values(dailyForecast)
      .slice(0, 5)
      .map((day) => ({
        ...day,
        tempMin: Math.round(Math.min(...day.temps)),
        tempMax: Math.round(Math.max(...day.temps)),
        temps: undefined,
      }));

    res.json({ success: true, data: forecast });
  } catch (error) {
    next(error);
  }
};

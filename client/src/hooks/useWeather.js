import { useState } from "react";
import {
  getWeatherByCity,
  getWeatherByCoords,
  getForecastByCity,
  getForecastByCoords,
  addHistory,
} from "../services/api";
import { useUnit } from "../context/UnitContext";

export const useWeather = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { units } = useUnit();

  const fetchByCity = async (city) => {
    if (!city || city.trim() === "") {
      setError("Please enter a city name.");
      return;
    }

    if (!/^[a-zA-Z\s]+$/.test(city.trim())) {
      setError("City name should only contain letters.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [weatherRes, forecastRes] = await Promise.all([
        getWeatherByCity(city, units),
        getForecastByCity(city, units),
      ]);

      if (weatherRes.success) {
        setWeather(weatherRes.data);
        addHistory({
          city: weatherRes.data.city,
          country: weatherRes.data.country,
          lat: weatherRes.data.lat,
          lon: weatherRes.data.lon,
          temp: weatherRes.data.temp,
          weather: weatherRes.data.main,
        }).catch(() => {});
      }

      if (forecastRes.success) {
        setForecast(forecastRes.data);
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to fetch weather data. Check your connection.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const fetchByCoords = async (lat, lon) => {
    try {
      setLoading(true);
      setError("");

      const [weatherRes, forecastRes] = await Promise.all([
        getWeatherByCoords(lat, lon, units),
        getForecastByCoords(lat, lon, units),
      ]);

      if (weatherRes.success) {
        setWeather(weatherRes.data);
        addHistory({
          city: weatherRes.data.city,
          country: weatherRes.data.country,
          lat: weatherRes.data.lat,
          lon: weatherRes.data.lon,
          temp: weatherRes.data.temp,
          weather: weatherRes.data.main,
        }).catch(() => {});
      }

      if (forecastRes.success) {
        setForecast(forecastRes.data);
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to fetch weather data.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    weather,
    forecast,
    loading,
    error,
    setError,
    fetchByCity,
    fetchByCoords,
  };
};

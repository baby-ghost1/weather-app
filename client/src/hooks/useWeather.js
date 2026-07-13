import { useState, useEffect, useRef, useCallback } from "react";
import {
  getAppInit, getWeatherByCity, getWeatherByCoords,
  getForecastByCity, getForecastByCoords, addHistory,
} from "../services/api";
import { useUnit } from "../context/UnitContext";

export const useWeather = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState({ hourly: [], daily: [] });
  const [loading, setLoading] = useState(true);
  const [unitLoading, setUnitLoading] = useState(false);
  const [error, setError] = useState("");
  const { units } = useUnit();

  const lastSearch = useRef({ type: null, value: null });
  const unitsRef = useRef(units);
  const booted = useRef(false);

  useEffect(() => {
    unitsRef.current = units;
  }, [units]);

  const fetchData = useCallback(async (city, lat, lon, isUnitChange = false) => {
    try {
      if (isUnitChange) setUnitLoading(true);
      else setLoading(true);
      setError("");

      const currentUnits = unitsRef.current;

      if (!booted.current) {
        booted.current = true;
        try {
          const initData = await getAppInit(city, lat, lon, currentUnits);
          if (initData?.weather) {
            setWeather(initData.weather);
            setForecast(initData.forecast || { hourly: [], daily: [] });
            addHistory({
              city: initData.weather.city, country: initData.weather.country,
              lat: initData.weather.lat, lon: initData.weather.lon,
              temp: initData.weather.temp, weather: initData.weather.main,
            }).catch(() => {});
            return;
          }
        } catch {
          booted.current = false;
        }
      }

      const [weatherRes, forecastRes] = await Promise.all([
        city ? getWeatherByCity(city, currentUnits) : getWeatherByCoords(lat, lon, currentUnits),
        city ? getForecastByCity(city, currentUnits) : getForecastByCoords(lat, lon, currentUnits),
      ]);

      if (weatherRes.success) {
        setWeather(weatherRes.data);
        if (!isUnitChange) {
          addHistory({
            city: weatherRes.data.city, country: weatherRes.data.country,
            lat: weatherRes.data.lat, lon: weatherRes.data.lon,
            temp: weatherRes.data.temp, weather: weatherRes.data.main,
          }).catch(() => {});
        }
      }
      if (forecastRes.success) setForecast(forecastRes.data);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to fetch weather data. Check your connection.";
      setError(message);
    } finally {
      setLoading(false);
      setUnitLoading(false);
    }
  }, []);

  const fetchByCity = useCallback((city) => {
    if (!city || city.trim() === "") {
      setError("Please enter a city name.");
      return;
    }
    if (!/^[a-zA-Z\s]+$/.test(city.trim())) {
      setError("City name should only contain letters.");
      return;
    }
    lastSearch.current = { type: "city", value: city.trim() };
    booted.current = false;
    fetchData(city.trim(), null, null, false);
  }, [fetchData]);

  const fetchByCoords = useCallback((lat, lon) => {
    lastSearch.current = { type: "coords", value: { lat, lon } };
    booted.current = false;
    fetchData(null, lat, lon, false);
  }, [fetchData]);

  useEffect(() => {
    if (!lastSearch.current.type) return;
    const { type, value } = lastSearch.current;
    if (type === "city") fetchData(value, null, null, true);
    else if (type === "coords") fetchData(null, value.lat, value.lon, true);
  }, [units, fetchData]);

  return {
    weather,
    forecast,
    loading,
    unitLoading,
    error,
    setError,
    fetchByCity,
    fetchByCoords,
  };
};

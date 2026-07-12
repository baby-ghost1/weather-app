import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
});

export const getWeatherByCity = async (city, units = "metric") => {
  const { data } = await api.get(`/weather/city/${encodeURIComponent(city)}?units=${units}`);
  return data;
};

export const getWeatherByCoords = async (lat, lon, units = "metric") => {
  const { data } = await api.get(`/weather/coords/${lat}/${lon}?units=${units}`);
  return data;
};

export const getForecastByCity = async (city, units = "metric") => {
  const { data } = await api.get(`/forecast/city/${encodeURIComponent(city)}?units=${units}`);
  return data;
};

export const getForecastByCoords = async (lat, lon, units = "metric") => {
  const { data } = await api.get(`/forecast/coords/${lat}/${lon}?units=${units}`);
  return data;
};

export const getHistory = async () => {
  const { data } = await api.get("/history");
  return data;
};

export const addHistory = async (entry) => {
  const { data } = await api.post("/history", entry);
  return data;
};

export const deleteHistory = async (id) => {
  const { data } = await api.delete(`/history/${id}`);
  return data;
};

export const clearHistory = async () => {
  const { data } = await api.delete("/history");
  return data;
};

export const getAirQuality = async (lat, lon) => {
  const { data } = await api.get(`/environment/aqi/${lat}/${lon}`);
  return data;
};

export const getUVIndex = async (lat, lon) => {
  const { data } = await api.get(`/environment/uv/${lat}/${lon}`);
  return data;
};

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 10000,
});

let appCache = null;
let appCacheKey = "";
let appCachePromise = null;

export const getAppInit = (city, lat, lon, units) => {
  const key = `${city || ""}_${lat || ""}_${lon || ""}_${units || ""}`;
  if (appCache && appCacheKey === key) return Promise.resolve(appCache);
  appCache = null;
  if (appCachePromise) return appCachePromise;
  const params = { city, lat, lon, units };
  appCachePromise = api.post("/app/init", params).then(({ data }) => {
    if (data.success) {
      appCache = data.data;
      appCacheKey = key;
      setTimeout(() => { appCache = null; appCacheKey = ""; }, 10 * 60 * 1000);
    }
    return appCache;
  }).finally(() => { appCachePromise = null; });
  return appCachePromise;
};

export const getWeatherByCity = async (city, units = "metric") => {
  if (appCache?.weather?.city?.toLowerCase() === city?.toLowerCase()) return { success: true, data: appCache.weather };
  const { data } = await api.get(`/weather/city/${encodeURIComponent(city)}?units=${units}`);
  return data;
};

export const getWeatherByCoords = async (lat, lon, units = "metric") => {
  if (appCache?.weather?.lat === lat && appCache?.weather?.lon === lon) return { success: true, data: appCache.weather };
  const { data } = await api.get(`/weather/coords/${lat}/${lon}?units=${units}`);
  return data;
};

export const getForecastByCity = async (city, units = "metric") => {
  if (appCache?.weather?.city?.toLowerCase() === city?.toLowerCase()) return { success: true, data: appCache.forecast };
  const { data } = await api.get(`/forecast/city/${encodeURIComponent(city)}?units=${units}`);
  return data;
};

export const getForecastByCoords = async (lat, lon, units = "metric") => {
  if (appCache?.weather?.lat === lat && appCache?.weather?.lon === lon) return { success: true, data: appCache.forecast };
  const { data } = await api.get(`/forecast/coords/${lat}/${lon}?units=${units}`);
  return data;
};

export const getHistory = async () => {
  if (appCache?.history) return { success: true, data: appCache.history };
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
  const cacheKey = `aqi_${lat}_${lon}`;
  if (appCache?.[cacheKey]) return appCache[cacheKey];
  const { data } = await api.get(`/environment/aqi/${lat}/${lon}`);
  if (data.success) {
    if (!appCache) appCache = {};
    appCache[cacheKey] = data;
    setTimeout(() => { if (appCache) delete appCache[cacheKey]; }, 10 * 60 * 1000);
  }
  return data;
};

export const getUVIndex = async (lat, lon) => {
  const cacheKey = `uv_${lat}_${lon}`;
  if (appCache?.[cacheKey]) return appCache[cacheKey];
  const { data } = await api.get(`/environment/uv/${lat}/${lon}`);
  if (data.success) {
    if (!appCache) appCache = {};
    appCache[cacheKey] = data;
    setTimeout(() => { if (appCache) delete appCache[cacheKey]; }, 10 * 60 * 1000);
  }
  return data;
};

export const getCarbonData = async (weather, distances) => {
  const { data } = await api.post("/indices/carbon", { weather, distances });
  return data.data;
};

export const getContent = async (type, params = {}) => {
  if (appCache?.content?.[type] && Object.keys(params).length === 0) return appCache.content[type];
  const query = new URLSearchParams(params).toString();
  const { data } = await api.get(`/content/${type}${query ? `?${query}` : ""}`);
  return data.data;
};

export const getUnits = async () => {
  if (appCache?.units) return appCache.units;
  const { data } = await api.get("/convert/units");
  return data.data;
};

export const convertUnit = async (value, from, to, type) => {
  const { data } = await api.post("/convert/convert", { value, from, to, type });
  return data.data;
};

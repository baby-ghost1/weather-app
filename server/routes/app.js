import { Router } from "express";
import { fetchWeatherByCity, fetchWeatherByCoords } from "../controllers/weatherController.js";
import { fetchForecastByCity, fetchForecastByCoords } from "../controllers/forecastController.js";
import {
  calcWindChill, calcHeatIndex, calcDewPoint,
  getHealthScore, getHealthCategory, getFireRisk, getFireCategory,
  getTravelScore, getTravelAdvice, getSleepScore, getSleepCategory,
  getPetScore, getPetAdvice, getSportsScore,
  getLightningRisk, getHailRisk,
  getFlightRisk, getFlightCategory, getMoodFromWeather,
  getSurfInfo, getEnergyCost,
  getPollenRisk, getPollenCategory,
} from "../services/indices.js";
import { getGardenAdvice, getCommuteAdvice, getAgricultureAdvice, getWorkoutAdvice, getPhotographyAdvice } from "../services/advice.js";
import {
  weatherFacts, quizQuestions, recipes, playlists, sounds,
  seasonalEvents, festivals, themes,
} from "../services/content.js";
import History from "../models/SearchHistory.js";

const router = Router();

router.post("/init", async (req, res) => {
  try {
    const { city, lat, lon, units } = req.body;

    let weatherRes, forecastRes;
    if (city) {
      weatherRes = await fetchWeatherByCity(city, units || "metric");
      forecastRes = await fetchForecastByCity(city, units || "metric");
    } else if (lat != null && lon != null) {
      weatherRes = await fetchWeatherByCoords(lat, lon, units || "metric");
      forecastRes = await fetchForecastByCoords(lat, lon, units || "metric");
    } else {
      return res.status(400).json({ success: false, message: "city or lat/lon required" });
    }

    if (!weatherRes.success) {
      return res.status(500).json({ success: false, message: "Failed to fetch weather" });
    }

    const weather = weatherRes.data;
    const w = weather;
    const currentHour = new Date().getHours();
    const currentMonth = new Date().getMonth() + 1;

    const windChill = calcWindChill(w.temp, w.windSpeed);
    const heatIndex = calcHeatIndex(w.temp, w.humidity);
    const dewPoint = calcDewPoint(w.temp, w.humidity);
    const healthScore = getHealthScore(w.temp, w.humidity, w.windSpeed, w.visibility, w.pressure, w.main, w.aqi || 50, w.uv || 3);
    const fireRisk = getFireRisk(w.temp, w.humidity, w.windSpeed, w.main, currentMonth);
    const travelScore = getTravelScore(w.temp, w.humidity, w.windSpeed, w.visibility, w.main);
    const sleepScore = getSleepScore(w.temp, w.humidity, w.windSpeed, w.main, currentHour);
    const petScore = getPetScore(w.temp, w.humidity, w.windSpeed, w.visibility, w.main);
    const sportsScore = getSportsScore(w.temp, w.humidity, w.windSpeed, w.main);
    const lightningRisk = getLightningRisk(w.temp, w.humidity, w.windSpeed, w.clouds, w.main);
    const hailRisk = getHailRisk(w.temp, w.humidity, w.windSpeed, w.main);
    const flightRisk = getFlightRisk(w.windSpeed, w.visibility, w.clouds, w.pressure, w.main);
    const surfInfo = getSurfInfo(w.windSpeed, w.windDeg, w.main, w.temp);
    const energyCost = getEnergyCost(w.temp);
    const pollenRisk = getPollenRisk(w.temp, w.humidity, w.windSpeed, w.main, currentMonth);

    const sunrise = w.sunrise || 0;
    const sunset = w.sunset || 0;
    const now = Date.now() / 1000;
    const isDaytime = now >= sunrise && now <= sunset;
    const daylight = sunset - sunrise;
    const elapsed = now - sunrise;
    const sunProgress = daylight > 0 ? Math.max(0, Math.min(1, elapsed / daylight)) : 0;
    const sunAltitude = isDaytime ? Math.sin(sunProgress * Math.PI) * 65 * (1 - Math.abs(w.lat || 0) / 90) : -10;
    const solarNoon = (sunrise + sunset) / 2;

    const alerts = [];
    if (w.main === "Thunderstorm") alerts.push({ type: "warning", message: "Thunderstorm warning — stay indoors." });
    if (w.main === "Snow" && w.temp <= -5) alerts.push({ type: "warning", message: "Severe cold warning — frostbite risk." });
    if (w.windSpeed > 15) alerts.push({ type: "warning", message: "High winds — secure loose objects." });
    if (w.visibility < 500) alerts.push({ type: "caution", message: "Low visibility — drive carefully." });
    if (w.humidity > 90) alerts.push({ type: "info", message: "Very high humidity — stay hydrated." });
    if (w.humidity < 20) alerts.push({ type: "info", message: "Very low humidity — use moisturizer." });
    if (w.temp >= 42) alerts.push({ type: "warning", message: "Extreme heat alert — avoid outdoor activities." });
    if (w.temp <= 0) alerts.push({ type: "caution", message: "Freezing temperature — roads may be icy." });
    if (w.pressure < 1000) alerts.push({ type: "info", message: "Low pressure system — weather may change suddenly." });
    if ((w.rain || 0) > 5) alerts.push({ type: "caution", message: "Heavy rainfall — possible waterlogging." });
    if ((w.snow || 0) > 2) alerts.push({ type: "caution", message: "Heavy snowfall — slippery roads." });
    if ((w.windGust || 0) > 20) alerts.push({ type: "warning", message: "Strong wind gusts." });

    const visKm = (w.visibility || 10000) / 1000;
    let visLabel, visColor, visAdvice;
    if (visKm >= 10) { visLabel = "Clear"; visColor = "#00e400"; visAdvice = "Excellent visibility."; }
    else if (visKm >= 5) { visLabel = "Good"; visColor = "#ffff00"; visAdvice = "Good visibility."; }
    else if (visKm >= 2) { visLabel = "Moderate"; visColor = "#ff7e00"; visAdvice = "Moderate visibility."; }
    else if (visKm >= 1) { visLabel = "Poor"; visColor = "#ff0000"; visAdvice = "Poor visibility."; }
    else { visLabel = "Very Poor"; visColor = "#7e0023"; visAdvice = "Very poor visibility."; }

    const uvLevels = [];
    const uv = w.uv || 3;
    for (let i = 0; i < 8; i++) {
      const h = i * 3;
      const estUv = Math.max(0, uv * Math.sin(((h + 6) / 18) * Math.PI));
      let lvl, col;
      if (estUv <= 2) { lvl = "Low"; col = "#00e400"; }
      else if (estUv <= 5) { lvl = "Moderate"; col = "#ffff00"; }
      else if (estUv <= 7) { lvl = "High"; col = "#ff7e00"; }
      else if (estUv <= 10) { lvl = "Very High"; col = "#ff0000"; }
      else { lvl = "Extreme"; col = "#7e0023"; }
      uvLevels.push({ hour: h, label: `${h}h`, value: Math.round(estUv * 10) / 10, level: lvl, color: col });
    }

    const allergens = [
      { name: "Tree Pollen", months: [2, 3, 4, 5], peak: [3, 4] },
      { name: "Grass Pollen", months: [4, 5, 6, 7, 8], peak: [5, 6] },
      { name: "Weed Pollen", months: [7, 8, 9, 10], peak: [8, 9] },
      { name: "Dust Mites", months: [5, 6, 7, 8, 9], peak: [7, 8] },
      { name: "Mold Spores", months: [6, 7, 8, 9, 10], peak: [8, 9] },
      { name: "Ragweed", months: [8, 9, 10], peak: [9] },
    ];

    const heatmap = [];
    for (let i = 0; i < 12; i++) {
      const estTemp = w.temp + Math.sin(((i - currentMonth) / 12) * Math.PI * 2) * 8;
      const estPrecip = 30 + Math.sin(((i + 2) / 12) * Math.PI * 2) * 40;
      let col = "#00e400";
      if (estTemp > 35) col = "#ff0000";
      else if (estTemp > 30) col = "#ff7e00";
      else if (estTemp > 20) col = "#ffff00";
      else if (estTemp > 10) col = "#60a5fa";
      heatmap.push({ month: i + 1, temp: Math.round(estTemp), precip: Math.max(0, Math.round(estPrecip)), color: col });
    }

    const indices = {
      windChill, heatIndex, dewPoint,
      feelsLike: { windChill, heatIndex },
      health: { score: healthScore, ...getHealthCategory(healthScore) },
      fire: { risk: fireRisk, ...getFireCategory(fireRisk) },
      travel: { score: travelScore, advice: getTravelAdvice(travelScore, w.main, w.temp) },
      sleep: { score: sleepScore, ...getSleepCategory(sleepScore) },
      pet: { score: petScore, advice: getPetAdvice(petScore, w.main, w.temp) },
      sports: getWorkoutAdvice(w.temp, w.humidity, w.windSpeed, w.main),
      lightning: { risk: lightningRisk },
      hail: { risk: hailRisk },
      flight: { risk: flightRisk, ...getFlightCategory(flightRisk) },
      mood: getMoodFromWeather(w.main, w.temp),
      surf: surfInfo,
      energy: energyCost,
      pollen: { risk: pollenRisk, ...getPollenCategory(pollenRisk) },
      garden: getGardenAdvice(w.temp, w.humidity, w.windSpeed, w.clouds, w.main, currentMonth),
      commute: getCommuteAdvice(w.temp, w.humidity, w.windSpeed, w.visibility, w.clouds, w.main, currentHour),
      agriculture: getAgricultureAdvice(w.temp, w.humidity, w.windSpeed, w.clouds, w.main, currentMonth),
      photography: getPhotographyAdvice(w.clouds, w.main),
      sunPosition: { progress: sunProgress, isDaytime, altitude: Math.round(sunAltitude), azimuth: isDaytime ? 90 + (sunProgress - 0.5) * 180 : 210, solarNoon: Math.round(solarNoon) },
      alerts, visibility: { km: visKm, label: visLabel, color: visColor, advice: visAdvice },
      uv: { hourly: uvLevels }, allergy: { allergens }, heatmap,
    };

    const history = await History.find().sort({ createdAt: -1 }).limit(10).lean().catch(() => []);

    res.json({
      success: true,
      data: {
        weather: weatherRes.data,
        forecast: forecastRes.success ? forecastRes.data : { hourly: [], daily: [] },
        indices,
        content: {
          facts: weatherFacts.slice(0, 5),
          quiz: quizQuestions,
          recipes,
          playlists,
          sounds,
          events: { astronomical: seasonalEvents, festivals },
          themes,
        },
        units: {
          temperature: [
            { id: "celsius", label: "Celsius", symbol: "°C" },
            { id: "fahrenheit", label: "Fahrenheit", symbol: "°F" },
            { id: "kelvin", label: "Kelvin", symbol: "K" },
          ],
          speed: [
            { id: "kmh", label: "km/h", symbol: "km/h" },
            { id: "mph", label: "mph", symbol: "mph" },
            { id: "ms", label: "m/s", symbol: "m/s" },
          ],
          pressure: [
            { id: "hpa", label: "hPa", symbol: "hPa" },
            { id: "inhg", label: "inHg", symbol: "inHg" },
            { id: "mmhg", label: "mmHg", symbol: "mmHg" },
          ],
          distance: [
            { id: "km", label: "Kilometers", symbol: "km" },
            { id: "miles", label: "Miles", symbol: "mi" },
          ],
        },
        history,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

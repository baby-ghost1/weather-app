import { Router } from "express";
import {
  calcWindChill, calcHeatIndex, calcDewPoint,
  getHealthScore, getHealthCategory, getFireRisk, getFireCategory,
  getTravelScore, getTravelAdvice, getSleepScore, getSleepCategory,
  getPetScore, getPetAdvice, getSportsScore,
  getLightningRisk, getHailRisk,
  getFlightRisk, getFlightCategory, getMoodFromWeather,
  getSurfInfo, getEnergyCost, getCarbonFootprint,
  getPollenRisk, getPollenCategory,
} from "../services/indices.js";
import { getGardenAdvice, getCommuteAdvice, getAgricultureAdvice, getWorkoutAdvice, getPhotographyAdvice } from "../services/advice.js";

const router = Router();

router.post("/all", (req, res) => {
  try {
    const { weather, aqi, uv, distances, month } = req.body;
    if (!weather) return res.status(400).json({ success: false, message: "Weather data required" });

    const { temp, humidity, windSpeed, windDeg, visibility, pressure, clouds, main } = weather;
    const currentHour = new Date().getHours();
    const currentMonth = month ?? new Date().getMonth() + 1;

    const windChill = calcWindChill(temp, windSpeed);
    const heatIndex = calcHeatIndex(temp, humidity);
    const dewPoint = calcDewPoint(temp, humidity);
    const healthScore = getHealthScore(temp, humidity, windSpeed, visibility, pressure, main, aqi || 50, uv || 3);
    const fireRisk = getFireRisk(temp, humidity, windSpeed, main, currentMonth);
    const travelScore = getTravelScore(temp, humidity, windSpeed, visibility, main);
    const sleepScore = getSleepScore(temp, humidity, windSpeed, main, currentHour);
    const petScore = getPetScore(temp, humidity, windSpeed, visibility, main);
    const sportsScore = getSportsScore(temp, humidity, windSpeed, main);
    const lightningRisk = getLightningRisk(temp, humidity, windSpeed, clouds, main);
    const hailRisk = getHailRisk(temp, humidity, windSpeed, main);
    const flightRisk = getFlightRisk(windSpeed, visibility, clouds, pressure, main);
    const surfInfo = getSurfInfo(windSpeed, windDeg, main, temp);
    const energyCost = getEnergyCost(temp);
    const pollenRisk = getPollenRisk(temp, humidity, windSpeed, main, currentMonth);

    const sunrise = weather.sunrise || 0;
    const sunset = weather.sunset || 0;
    const now = Date.now() / 1000;
    const isDaytime = now >= sunrise && now <= sunset;
    const daylight = sunset - sunrise;
    const elapsed = now - sunrise;
    const sunProgress = daylight > 0 ? Math.max(0, Math.min(1, elapsed / daylight)) : 0;
    const sunAltitude = isDaytime ? Math.sin(sunProgress * Math.PI) * 65 * (1 - Math.abs(weather.lat || 0) / 90) : -10;
    const solarNoon = (sunrise + sunset) / 2;

    const alerts = [];
    if (main === "Thunderstorm") alerts.push({ type: "warning", message: "Thunderstorm warning — stay indoors and avoid open areas." });
    if (main === "Snow" && temp <= -5) alerts.push({ type: "warning", message: "Severe cold warning — frostbite risk." });
    if (windSpeed > 15) alerts.push({ type: "warning", message: "High winds — secure loose objects." });
    if (visibility < 500) alerts.push({ type: "caution", message: "Low visibility — drive carefully." });
    if (humidity > 90) alerts.push({ type: "info", message: "Very high humidity — stay hydrated." });
    if (humidity < 20) alerts.push({ type: "info", message: "Very low humidity — use moisturizer." });
    if (temp >= 42) alerts.push({ type: "warning", message: "Extreme heat alert — avoid outdoor activities." });
    if (temp <= 0) alerts.push({ type: "caution", message: "Freezing temperature — roads may be icy." });
    if (pressure < 1000) alerts.push({ type: "info", message: "Low pressure system — weather may change suddenly." });
    if ((weather.rain || 0) > 5) alerts.push({ type: "caution", message: "Heavy rainfall — possible waterlogging." });
    if ((weather.snow || 0) > 2) alerts.push({ type: "caution", message: "Heavy snowfall — slippery roads." });
    if ((weather.windGust || 0) > 20) alerts.push({ type: "warning", message: "Strong wind gusts — secure outdoor furniture." });

    const visKm = (visibility || 10000) / 1000;
    let visLabel, visColor, visAdvice;
    if (visKm >= 10) { visLabel = "Clear"; visColor = "#00e400"; visAdvice = "Excellent visibility."; }
    else if (visKm >= 5) { visLabel = "Good"; visColor = "#ffff00"; visAdvice = "Good visibility."; }
    else if (visKm >= 2) { visLabel = "Moderate"; visColor = "#ff7e00"; visAdvice = "Moderate visibility. Drive with caution."; }
    else if (visKm >= 1) { visLabel = "Poor"; visColor = "#ff0000"; visAdvice = "Poor visibility. Use low beam headlights."; }
    else { visLabel = "Very Poor"; visColor = "#7e0023"; visAdvice = "Very poor visibility. Avoid driving if possible."; }

    const uvLevels = [];
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
      const estTemp = temp + Math.sin(((i - currentMonth) / 12) * Math.PI * 2) * 8;
      const estPrecip = 30 + Math.sin(((i + 2) / 12) * Math.PI * 2) * 40;
      let col = "#00e400";
      if (estTemp > 35) col = "#ff0000";
      else if (estTemp > 30) col = "#ff7e00";
      else if (estTemp > 20) col = "#ffff00";
      else if (estTemp > 10) col = "#60a5fa";
      heatmap.push({ month: i + 1, temp: Math.round(estTemp), precip: Math.max(0, Math.round(estPrecip)), color: col });
    }

    res.json({ success: true, data: {
      windChill,
      heatIndex,
      dewPoint,
      feelsLike: { windChill, heatIndex },
      health: { score: healthScore, ...getHealthCategory(healthScore) },
      fire: { risk: fireRisk, ...getFireCategory(fireRisk) },
      travel: { score: travelScore, advice: getTravelAdvice(travelScore, main, temp) },
      sleep: { score: sleepScore, ...getSleepCategory(sleepScore) },
      pet: { score: petScore, advice: getPetAdvice(petScore, main, temp) },
      sports: getWorkoutAdvice(temp, humidity, windSpeed, main),
      lightning: { risk: lightningRisk },
      hail: { risk: hailRisk },
      flight: { risk: flightRisk, ...getFlightCategory(flightRisk) },
      mood: getMoodFromWeather(main, temp),
      surf: surfInfo,
      energy: energyCost,
      pollen: { risk: pollenRisk, ...getPollenCategory(pollenRisk) },
      garden: getGardenAdvice(temp, humidity, windSpeed, clouds, main, currentMonth),
      commute: getCommuteAdvice(temp, humidity, windSpeed, visibility, clouds, main, currentHour),
      agriculture: getAgricultureAdvice(temp, humidity, windSpeed, clouds, main, currentMonth),
      photography: getPhotographyAdvice(clouds, main),
      sunPosition: { progress: sunProgress, isDaytime, altitude: Math.round(sunAltitude), azimuth: isDaytime ? 90 + (sunProgress - 0.5) * 180 : 210, solarNoon: Math.round(solarNoon) },
      alerts,
      visibility: { km: visKm, label: visLabel, color: visColor, advice: visAdvice },
      uv: { hourly: uvLevels },
      allergy: { allergens },
      heatmap,
    }});
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/carbon", (req, res) => {
  try {
    const { weather, distances } = req.body;
    if (!weather) return res.status(400).json({ success: false, message: "Weather data required" });
    const { temp, windSpeed, main } = weather;
    const result = getCarbonFootprint(["car-petrol","car-diesel","bus","train","flight","bike","walking"], distances || {}, temp, windSpeed, main);
    res.json({ success: true, data: { ...result, transport: result.details } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

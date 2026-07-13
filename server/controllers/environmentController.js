const AIR_POLLUTION_URL = "https://api.openweathermap.org/data/2.5/air_pollution";
const UV_URL = "https://api.openweathermap.org/data/2.5/uvi";
import fetchWithRetry from "../utils/fetchWithRetry.js";

function calcAQI(Cp, BPLo, BPHi, ILo, IHi) {
  return Math.round(((IHi - ILo) / (BPHi - BPLo)) * (Cp - BPLo) + ILo);
}

function pm25AQI(c) {
  const Cp = Math.floor(c * 10) / 10;
  if (Cp <= 9.0) return calcAQI(Cp, 0.0, 9.0, 0, 50);
  if (Cp <= 35.4) return calcAQI(Cp, 9.1, 35.4, 51, 100);
  if (Cp <= 55.4) return calcAQI(Cp, 35.5, 55.4, 101, 150);
  if (Cp <= 125.4) return calcAQI(Cp, 55.5, 125.4, 151, 200);
  if (Cp <= 225.4) return calcAQI(Cp, 125.5, 225.4, 201, 300);
  if (Cp <= 325.4) return calcAQI(Cp, 225.5, 325.4, 301, 500);
  return 500;
}

function pm10AQI(c) {
  const Cp = Math.floor(c);
  if (Cp <= 54) return calcAQI(Cp, 0, 54, 0, 50);
  if (Cp <= 154) return calcAQI(Cp, 55, 154, 51, 100);
  if (Cp <= 254) return calcAQI(Cp, 155, 254, 101, 150);
  if (Cp <= 354) return calcAQI(Cp, 255, 354, 151, 200);
  if (Cp <= 424) return calcAQI(Cp, 355, 424, 201, 300);
  if (Cp <= 604) return calcAQI(Cp, 425, 604, 301, 500);
  return 500;
}

function o3AQI(ugm3) {
  const ppb = ugm3 * 0.4899;
  const Cp = Math.round(ppb);
  if (Cp <= 54) return calcAQI(Cp, 0, 54, 0, 50);
  if (Cp <= 70) return calcAQI(Cp, 55, 70, 51, 100);
  if (Cp <= 85) return calcAQI(Cp, 71, 85, 101, 150);
  if (Cp <= 105) return calcAQI(Cp, 86, 105, 151, 200);
  if (Cp <= 200) return calcAQI(Cp, 106, 200, 201, 300);
  return 300;
}

function no2AQI(ugm3) {
  const ppb = ugm3 * 0.5317;
  const Cp = Math.round(ppb);
  if (Cp <= 53) return calcAQI(Cp, 0, 53, 0, 50);
  if (Cp <= 100) return calcAQI(Cp, 54, 100, 51, 100);
  if (Cp <= 360) return calcAQI(Cp, 101, 360, 101, 150);
  if (Cp <= 649) return calcAQI(Cp, 361, 649, 151, 200);
  if (Cp <= 1249) return calcAQI(Cp, 650, 1249, 201, 300);
  if (Cp <= 1649) return calcAQI(Cp, 1250, 1649, 301, 400);
  if (Cp <= 2049) return calcAQI(Cp, 1650, 2049, 401, 500);
  return 500;
}

function so2AQI(ugm3) {
  const ppb = ugm3 * 0.3831;
  const Cp = Math.round(ppb);
  if (Cp <= 35) return calcAQI(Cp, 0, 35, 0, 50);
  if (Cp <= 75) return calcAQI(Cp, 36, 75, 51, 100);
  if (Cp <= 185) return calcAQI(Cp, 76, 185, 101, 150);
  if (Cp <= 304) return calcAQI(Cp, 186, 304, 151, 200);
  if (Cp <= 604) return calcAQI(Cp, 305, 604, 201, 300);
  if (Cp <= 804) return calcAQI(Cp, 605, 804, 301, 400);
  if (Cp <= 1004) return calcAQI(Cp, 805, 1004, 401, 500);
  return 500;
}

function coAQI(ugm3) {
  const ppm = ugm3 * 0.001;
  const Cp = Math.round(ppm * 10) / 10;
  if (Cp <= 4.4) return calcAQI(Cp, 0, 4.4, 0, 50);
  if (Cp <= 9.4) return calcAQI(Cp, 4.5, 9.4, 51, 100);
  if (Cp <= 12.4) return calcAQI(Cp, 9.5, 12.4, 101, 150);
  if (Cp <= 15.4) return calcAQI(Cp, 12.5, 15.4, 151, 200);
  if (Cp <= 30.4) return calcAQI(Cp, 15.5, 30.4, 201, 300);
  if (Cp <= 40.4) return calcAQI(Cp, 30.5, 40.4, 301, 400);
  if (Cp <= 50.4) return calcAQI(Cp, 40.5, 50.4, 401, 500);
  return 500;
}

function getPollutantCategory(aqi) {
  if (aqi <= 50) return { level: "Good", color: "#00e400" };
  if (aqi <= 100) return { level: "Moderate", color: "#ffff00" };
  if (aqi <= 150) return { level: "USG", color: "#ff7e00" };
  if (aqi <= 200) return { level: "Unhealthy", color: "#ff0000" };
  if (aqi <= 300) return { level: "Very Unhealthy", color: "#8f3f97" };
  return { level: "Hazardous", color: "#7e0023" };
}

function getAQICategory(aqi) {
  if (aqi <= 50) return { level: "Good", color: "#00e400", advice: "Air quality is satisfactory. Enjoy outdoor activities!" };
  if (aqi <= 100) return { level: "Moderate", color: "#ffff00", advice: "Acceptable. Sensitive people should limit prolonged outdoor exertion." };
  if (aqi <= 150) return { level: "Unhealthy for Sensitive Groups", color: "#ff7e00", advice: "Sensitive groups (asthma, elderly, children) should limit outdoor exertion." };
  if (aqi <= 200) return { level: "Unhealthy", color: "#ff0000", advice: "Everyone may experience health effects. Limit outdoor exertion." };
  if (aqi <= 300) return { level: "Very Unhealthy", color: "#8f3f97", advice: "Health alert. Avoid all prolonged outdoor exertion." };
  return { level: "Hazardous", color: "#7e0023", advice: "Health emergency. Avoid all outdoor activities." };
}

export const getAirQuality = async (req, res, next) => {
  try {
    const { lat, lon } = req.params;
    const url = `${AIR_POLLUTION_URL}?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}`;
    const response = await fetchWithRetry(url);
    if (!response.ok) {
      return res.status(response.status).json({ success: false, message: "Error fetching air quality" });
    }
    const data = await response.json();
    if (!data.list || !data.list.length) {
      return res.status(404).json({ success: false, message: "No air quality data available" });
    }
    const c = data.list[0].components;

    const pm25 = pm25AQI(c.pm2_5);
    const pm10 = pm10AQI(c.pm10);
    const o3 = o3AQI(c.o3);
    const no2 = no2AQI(c.no2);
    const so2 = so2AQI(c.so2);
    const co = coAQI(c.co);
    const usAQI = Math.max(pm25, pm10, o3, no2, so2, co);
    const category = getAQICategory(usAQI);

    const allPollutants = [
      { name: "PM2.5", value: c.pm2_5, unit: "ug/m3", aqi: pm25, ...getPollutantCategory(pm25) },
      { name: "PM10", value: c.pm10, unit: "ug/m3", aqi: pm10, ...getPollutantCategory(pm10) },
      { name: "O3", value: c.o3, unit: "ug/m3", aqi: o3, ...getPollutantCategory(o3) },
      { name: "NO2", value: c.no2, unit: "ug/m3", aqi: no2, ...getPollutantCategory(no2) },
      { name: "SO2", value: c.so2, unit: "ug/m3", aqi: so2, ...getPollutantCategory(so2) },
      { name: "CO", value: c.co, unit: "ug/m3", aqi: co, ...getPollutantCategory(co) },
    ];

    const dominant = allPollutants.reduce((max, p) => p.aqi > max.aqi ? p : max, allPollutants[0]);

    res.json({
      success: true,
      data: {
        aqi: usAQI,
        level: category.level,
        color: category.color,
        advice: category.advice,
        pollutants: allPollutants,
        dominantPollutant: dominant.name,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUVIndex = async (req, res, next) => {
  try {
    const { lat, lon } = req.params;
    const url = `${UV_URL}?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}`;
    const response = await fetchWithRetry(url);
    if (!response.ok) {
      return res.status(response.status).json({ success: false, message: "Error fetching UV index" });
    }
    const data = await response.json();
    let level, color, advice;
    if (data.value <= 2) { level = "Low"; color = "#4caf50"; advice = "No protection needed."; }
    else if (data.value <= 5) { level = "Moderate"; color = "#ffeb3b"; advice = "Wear sunscreen."; }
    else if (data.value <= 7) { level = "High"; color = "#ff9800"; advice = "Reduce sun exposure 10am-4pm."; }
    else if (data.value <= 10) { level = "Very High"; color = "#f44336"; advice = "Minimize sun exposure."; }
    else { level = "Extreme"; color = "#9c27b0"; advice = "Avoid all sun exposure."; }
    res.json({ success: true, data: { value: Math.round(data.value * 10) / 10, level, color, advice } });
  } catch (error) {
    next(error);
  }
};

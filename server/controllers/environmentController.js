const AIR_POLLUTION_URL = "https://api.openweathermap.org/data/2.5/air_pollution";
const UV_URL = "https://api.openweathermap.org/data/2.5/uvi";

function calcAQI(Cp, BPLo, BPHi, ILo, IHi) {
  return Math.round(((IHi - ILo) / (BPHi - BPLo)) * (Cp - BPLo) + ILo);
}

// PM2.5 (24-hour, ug/m3) - EPA 2024 breakpoints
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

// PM10 (24-hour, ug/m3) - EPA breakpoints
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
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ success: false, message: "Error fetching air quality" });
    }
    const data = await response.json();
    const c = data.list[0].components;

    const pm25 = pm25AQI(c.pm2_5);
    const pm10 = pm10AQI(c.pm10);
    const usAQI = Math.max(pm25, pm10);
    const category = getAQICategory(usAQI);

    const pollutants = [
      { name: "PM2.5", value: c.pm2_5, unit: "ug/m3", aqi: pm25 },
      { name: "PM10", value: c.pm10, unit: "ug/m3", aqi: pm10 },
      { name: "O3", value: c.o3, unit: "ug/m3", aqi: 0 },
      { name: "NO2", value: c.no2, unit: "ug/m3", aqi: 0 },
      { name: "SO2", value: c.so2, unit: "ug/m3", aqi: 0 },
      { name: "CO", value: c.co, unit: "ug/m3", aqi: 0 },
    ];

    res.json({
      success: true,
      data: {
        aqi: usAQI,
        level: category.level,
        color: category.color,
        advice: category.advice,
        pollutants,
        dominantPollutant: pm25 >= pm10 ? "PM2.5" : "PM10",
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
    const response = await fetch(url);
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

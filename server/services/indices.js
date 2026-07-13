export function calcWindChill(temp, windSpeed) {
  if (temp > 10 || windSpeed < 4.8) return null;
  return Math.round(13.12 + 0.6215 * temp - 11.37 * Math.pow(windSpeed, 0.16) + 0.3965 * temp * Math.pow(windSpeed, 0.16));
}

export function calcHeatIndex(temp, humidity) {
  if (temp < 27) return null;
  const t = temp, h = humidity;
  return Math.round(
    -8.784 + 1.611 * t + 2.339 * h - 0.146 * t * h -
    0.006 * t * t - 0.055 * h * h + 0.001 * t * t * h +
    0.0001 * t * h * h - 0.00001 * t * t * h * h
  );
}

export function calcDewPoint(temp, humidity) {
  const a = 17.27, b = 237.7;
  const alpha = (a * temp) / (b + temp) + Math.log(humidity / 100);
  return Math.round((b * alpha) / (a - alpha));
}

export function getHealthScore(temp, humidity, windSpeed, visibility, pressure, main, aqi, uv) {
  let score = 80;
  if (temp < 0 || temp > 45) score -= 20;
  else if (temp < 5 || temp > 40) score -= 10;
  else if (temp < 10 || temp > 35) score -= 5;
  if (humidity < 20 || humidity > 90) score -= 10;
  else if (humidity < 30 || humidity > 80) score -= 5;
  if (aqi > 200) score -= 25;
  else if (aqi > 150) score -= 15;
  else if (aqi > 100) score -= 8;
  else if (aqi > 50) score -= 3;
  if (uv > 10) score -= 10;
  else if (uv > 7) score -= 5;
  else if (uv > 5) score -= 2;
  if (visibility < 1000) score -= 5;
  if (windSpeed > 25) score -= 5;
  if (["Thunderstorm", "Snow"].includes(main)) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function getHealthCategory(score) {
  if (score >= 80) return { label: "Excellent", color: "#00e400", advice: "Great conditions for outdoor activities." };
  if (score >= 60) return { label: "Good", color: "#ffff00", advice: "Favorable conditions. Enjoy your day!" };
  if (score >= 40) return { label: "Moderate", color: "#ff7e00", advice: "Some precautions needed for sensitive groups." };
  if (score >= 20) return { label: "Poor", color: "#ff0000", advice: "Limit outdoor activities. Stay cautious." };
  return { label: "Hazardous", color: "#7e0023", advice: "Avoid all outdoor activities." };
}

export function getFireRisk(temp, humidity, windSpeed, main, month) {
  let risk = 0;
  if (temp >= 35) risk += 25;
  else if (temp >= 30) risk += 15;
  else if (temp >= 25) risk += 8;
  if (humidity < 30) risk += 25;
  else if (humidity < 50) risk += 10;
  else if (humidity < 70) risk += 3;
  if (windSpeed > 20) risk += 20;
  else if (windSpeed > 10) risk += 8;
  if (main === "Clear") risk += 10;
  if (["Rain", "Drizzle", "Thunderstorm"].includes(main)) risk -= 20;
  if (month >= 3 && month <= 5) risk += 10;
  else if (month >= 9 && month <= 11) risk += 5;
  return Math.max(0, Math.min(100, risk));
}

export function getFireCategory(risk) {
  if (risk >= 80) return { label: "Extreme", color: "#7e0023", advice: "Extreme fire danger. Avoid any outdoor burning." };
  if (risk >= 60) return { label: "Very High", color: "#ff0000", advice: "Very high fire risk. Extreme caution needed." };
  if (risk >= 40) return { label: "High", color: "#ff7e00", advice: "High fire risk. Dispose of cigarettes properly." };
  if (risk >= 20) return { label: "Moderate", color: "#ffff00", advice: "Moderate fire risk. Be mindful of fire safety." };
  return { label: "Low", color: "#00e400", advice: "Low fire risk. Normal precautions apply." };
}

export function getTravelScore(temp, humidity, windSpeed, visibility, main) {
  let score = 80;
  if (temp <= 5 || temp >= 40) score -= 20;
  else if (temp <= 10 || temp >= 35) score -= 10;
  else if (temp <= 15 || temp >= 30) score -= 5;
  if (humidity >= 85) score -= 10;
  else if (humidity >= 70) score -= 5;
  if (windSpeed > 20) score -= 15;
  else if (windSpeed > 10) score -= 5;
  if (visibility < 1000) score -= 20;
  else if (visibility < 5000) score -= 8;
  if (main === "Thunderstorm") score -= 25;
  else if (["Rain", "Drizzle", "Snow"].includes(main)) score -= 10;
  return Math.max(0, Math.min(100, score));
}

export function getTravelAdvice(score, main, temp) {
  if (score >= 80) return ["Perfect weather for travel.", "Ideal conditions for outdoor plans."];
  if (score >= 60) return ["Generally favorable for travel.", "Pack for mild conditions."];
  if (score >= 40) return ["Travel possible with caution.", "Check local weather updates."];
  return ["Travel conditions are poor.", "Consider postponing non-essential travel."];
}

export function getSleepScore(temp, humidity, windSpeed, main, hour) {
  let score = 70;
  if (temp >= 15 && temp <= 30) score += 10;
  else if (temp >= 18 && temp <= 26) score += 5;
  if (temp < 15 || temp > 30) score -= 10;
  if (humidity >= 30 && humidity <= 70) score += 5;
  else if (humidity >= 40 && humidity <= 60) score += 3;
  if (humidity < 30 || humidity > 70) score -= 5;
  if (windSpeed > 15) score -= 8;
  if (main === "Rain" || main === "Drizzle") score += 10;
  if (main === "Thunderstorm") score -= 25;
  if (hour >= 21 || hour <= 5) score += 5;
  return Math.max(0, Math.min(100, score));
}

export function getSleepCategory(score) {
  if (score >= 80) return { label: "Excellent", color: "#00e400", tip: "Perfect sleeping weather tonight." };
  if (score >= 60) return { label: "Good", color: "#ffff00", tip: "Good sleeping conditions." };
  if (score >= 40) return { label: "Fair", color: "#ff7e00", tip: "Sleep may be slightly uncomfortable." };
  return { label: "Poor", color: "#ff0000", tip: "Weather may disrupt sleep. Use AC or fan." };
}

export function getPetScore(temp, humidity, windSpeed, visibility, main) {
  let score = 75;
  if (temp >= 35) score -= 20;
  else if (temp >= 30) score -= 10;
  else if (temp <= 5) score -= 15;
  else if (temp <= 10) score -= 8;
  if (humidity > 85) score -= 10;
  if (windSpeed > 20) score -= 8;
  if (["Thunderstorm", "Snow"].includes(main)) score -= 15;
  if (main === "Rain" || main === "Drizzle") score -= 5;
  if (visibility < 1000) score -= 5;
  return Math.max(0, Math.min(100, score));
}

export function getPetAdvice(score, main, temp) {
  if (score >= 80) return ["Perfect for walks and outdoor play.", "Your pet will love this weather!"];;
  if (score >= 60) return ["Suitable for short outdoor time.", "Keep an eye on your pet's comfort."];
  if (score >= 40) return ["Limit outdoor time for your pet.", "Provide plenty of water and shade."];
  return ["Keep your pet indoors today.", "Weather conditions are unsafe for pets."];
}

export function getSportsScore(temp, humidity, windSpeed, main) {
  let score = 70;
  const idealTemp = { low: 18, high: 28 };
  if (temp >= idealTemp.low && temp <= idealTemp.high) score += 10;
  else if (temp < 10 || temp > 35) score -= 15;
  else if (temp < 15 || temp > 30) score -= 8;
  if (humidity > 60) score -= 5;
  if (windSpeed > 20) score -= 10;
  else if (windSpeed > 10) score -= 3;
  if (["Rain", "Thunderstorm", "Snow"].includes(main)) score -= 30;
  return Math.max(0, Math.min(100, score));
}

export function getLightningRisk(temp, humidity, windSpeed, clouds, main) {
  let risk = 0;
  if (main === "Thunderstorm") risk += 80;
  if (main === "Rain") risk += 20;
  if (temp > 25 && humidity > 60) risk += 15;
  if (windSpeed > 20) risk += 10;
  if (clouds > 70) risk += 10;
  return Math.min(100, risk);
}

export function getHailRisk(temp, humidity, windSpeed, main) {
  let risk = 0;
  if (main === "Thunderstorm") risk += 60;
  if (main === "Snow" || (temp <= 0 && humidity > 70)) risk += 30;
  if (temp > 25 && temp < 40 && humidity > 65) risk += 20;
  if (windSpeed > 25) risk += 15;
  return Math.min(100, risk);
}

export function getFlightRisk(windSpeed, visibility, clouds, pressure, main) {
  let risk = 0;
  if (windSpeed > 25) risk += 25;
  else if (windSpeed > 15) risk += 10;
  if (visibility < 1000) risk += 25;
  else if (visibility < 3000) risk += 10;
  if (main === "Thunderstorm") risk += 40;
  else if (main === "Snow") risk += 25;
  else if (main === "Rain") risk += 10;
  if (clouds > 90) risk += 10;
  if (pressure < 1000) risk += 10;
  return Math.min(100, risk);
}

export function getFlightCategory(risk) {
  if (risk >= 60) return { label: "Very High", color: "#ff0000", advice: "High chance of delays. Check with airline." };
  if (risk >= 40) return { label: "High", color: "#ff7e00", advice: "Possible delays. Allow extra time." };
  if (risk >= 20) return { label: "Moderate", color: "#ffff00", advice: "Minor delays possible. Proceed as planned." };
  return { label: "Low", color: "#00e400", advice: "Weather is favorable for flights." };
}

export function getMoodFromWeather(main, temp) {
  if (main === "Clear" && temp >= 20 && temp <= 30) return { mood: "Happy", emoji: "blush", score: 85 };
  if (main === "Clear" && temp > 30) return { mood: "Energetic", emoji: "hot_face", score: 65 };
  if (main === "Clouds") return { mood: "Calm", emoji: "relieved", score: 70 };
  if (["Rain", "Drizzle"].includes(main)) return { mood: "Cozy", emoji: "smiling_face_with_3_hearts", score: 60 };
  if (main === "Thunderstorm") return { mood: "Anxious", emoji: "cold_sweat", score: 35 };
  if (temp < 10) return { mood: "Lazy", emoji: "yawning_face", score: 45 };
  if (temp > 35) return { mood: "Sluggish", emoji: "melting_face", score: 30 };
  return { mood: "Neutral", emoji: "neutral_face", score: 50 };
}

export function getSurfInfo(windSpeed, windDeg, main, temp) {
  const waveHeight = Math.min(windSpeed * 0.3 + 0.5, 5);
  const shoreDir = windDeg || 180;
  const onshore = Math.abs(shoreDir - 270) < 90;
  const surfable = windSpeed > 8 && main !== "Thunderstorm" && waveHeight > 0.5;
  const waterTemp = Math.max(10, Math.min(30, temp * 0.85 + 4));
  return { waveHeight, onshore, surfable, waterTemp: Math.round(waterTemp), bestTime: "Early morning or late evening" };
}

export function getEnergyCost(temp) {
  const acHours = temp > 30 ? Math.min(18, (temp - 26) * 2) : 0;
  const fanHours = temp >= 25 && temp <= 30 ? (temp - 24) * 1.5 : 0;
  const heaterHours = temp < 15 ? Math.min(16, (20 - temp) * 1.5) : 0;
  const acCost = acHours * 1.5;
  const fanCost = fanHours * 0.15;
  const heaterCost = heaterHours * 2;
  const total = acCost + fanCost + heaterCost;
  let tip = "Energy usage is normal.";
  if (temp > 35) tip = "High AC usage expected. Set thermostat to 24°C for efficiency.";
  else if (temp > 30) tip = "AC usage expected. Use fans to reduce cooling costs.";
  else if (temp < 10) tip = "Heater usage expected. Layer up to reduce costs.";
  else if (temp < 5) tip = "High heating expected. Seal windows and doors.";
  return { acHours: Math.round(acHours), fanHours: Math.round(fanHours), heaterHours: Math.round(heaterHours), acCost: Math.round(acCost), fanCost: Math.round(fanCost), heaterCost: Math.round(heaterCost), total: Math.round(total), tip };
}

export function getCarbonFootprint(transportModes, distances, temp, windSpeed, main) {
  let factor = 1;
  if (temp > 35 || temp < 5) factor += 0.15;
  if (windSpeed > 20) factor += 0.1;
  if (["Rain", "Snow"].includes(main)) factor += 0.08;
  const modes = [
    { id: "car-petrol", label: "Car (Petrol)", co2PerKm: 0.192 },
    { id: "car-diesel", label: "Car (Diesel)", co2PerKm: 0.171 },
    { id: "bus", label: "Bus", co2PerKm: 0.089 },
    { id: "train", label: "Train", co2PerKm: 0.041 },
    { id: "flight", label: "Flight", co2PerKm: 0.255 },
    { id: "bike", label: "Bike", co2PerKm: 0.103 },
    { id: "walking", label: "Walking", co2PerKm: 0 },
  ];
  const details = modes.map((m) => ({
    ...m,
    distance: distances[m.id] || 0,
    co2: Math.round(((distances[m.id] || 0) * m.co2PerKm * factor)),
  }));
  const totalCo2 = details.reduce((s, d) => s + d.co2, 0);
  const trees = Math.round(totalCo2 / 21 * 365);
  return { factor: Math.round(factor * 100) / 100, details, totalCo2, trees };
}

export function getPollenRisk(temp, humidity, windSpeed, main, month) {
  let risk = 0;
  if (temp >= 15 && temp <= 30) risk += 15;
  else if (temp >= 10 && temp <= 35) risk += 8;
  if (humidity >= 40 && humidity <= 70) risk += 10;
  else if (humidity >= 30 && humidity <= 80) risk += 5;
  if (windSpeed < 10) risk += 10;
  else if (windSpeed < 20) risk += 5;
  if (main === "Clear") risk += 15;
  if (main === "Clouds") risk += 10;
  if (["Rain", "Drizzle"].includes(main)) risk -= 20;
  if (month >= 2 && month <= 5) risk += 20;
  else if (month >= 6 && month <= 8) risk += 15;
  else if (month >= 9 && month <= 10) risk += 10;
  return Math.max(0, Math.min(100, risk));
}

export function getPollenCategory(risk) {
  if (risk >= 75) return { label: "Very High", color: "#7e0023", advice: "Avoid outdoor activities. Keep windows closed." };
  if (risk >= 50) return { label: "High", color: "#ff0000", advice: "Limit outdoor time. Take allergy medication." };
  if (risk >= 25) return { label: "Moderate", color: "#ff7e00", advice: "Some allergens present. Monitor symptoms." };
  return { label: "Low", color: "#00e400", advice: "Low pollen count. Safe for outdoor activities." };
}

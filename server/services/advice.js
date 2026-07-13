export function getGardenAdvice(temp, humidity, windSpeed, clouds, main, month) {
  const tips = [];
  if (temp >= 18 && temp <= 30 && humidity >= 40 && humidity <= 70) {
    tips.push({ type: "good", message: "Excellent conditions for planting and garden work." });
  }
  if (main === "Rain" || main === "Drizzle") {
    tips.push({ type: "info", message: "Rain expected. Hold off on watering plants today." });
  }
  if (humidity < 30) {
    tips.push({ type: "warning", message: "Low humidity. Increase watering frequency for plants." });
  }
  if (temp > 35) {
    tips.push({ type: "warning", message: "Extreme heat. Provide shade for sensitive plants." });
  }
  if (windSpeed > 15) {
    tips.push({ type: "warning", message: "Strong winds. Protect young plants and stakes." });
  }
  if (clouds < 30 && temp > 25) {
    tips.push({ type: "info", message: "High sunlight. Ensure adequate soil moisture." });
  }
  if (temp < 10) {
    tips.push({ type: "warning", message: "Cold temperatures. Bring sensitive plants indoors." });
  }
  if (month >= 2 && month <= 4) {
    tips.push({ type: "info", message: "Spring season. Good time for planting and pruning." });
  } else if (month >= 5 && month <= 7) {
    tips.push({ type: "info", message: "Summer season. Focus on watering and pest control." });
  } else if (month >= 8 && month <= 9) {
    tips.push({ type: "info", message: "Monsoon season. Ensure proper drainage for plants." });
  }
  if (tips.length === 0) {
    tips.push({ type: "info", message: "Average gardening conditions. Proceed with routine maintenance." });
  }
  return tips;
}

export function getCommuteAdvice(temp, humidity, windSpeed, visibility, clouds, main, hour) {
  const tips = [];
  const isRushHour = (hour >= 7 && hour <= 10) || (hour >= 17 && hour <= 20);

  if (["Rain", "Drizzle"].includes(main)) {
    tips.push({ type: "warning", message: "Rain expected. Allow extra travel time." });
  }
  if (main === "Thunderstorm") {
    tips.push({ type: "danger", message: "Thunderstorm likely. Delay travel if possible." });
  }
  if (visibility < 1000) {
    tips.push({ type: "danger", message: "Very low visibility. Drive with extreme caution." });
  } else if (visibility < 5000) {
    tips.push({ type: "warning", message: "Reduced visibility. Use fog lights if needed." });
  }
  if (temp > 38) {
    tips.push({ type: "warning", message: "Extreme heat. Carry water and avoid midday travel." });
  }
  if (windSpeed > 20) {
    tips.push({ type: "warning", message: "Strong winds. Be careful on bridges and open roads." });
  }
  if (clouds > 80 && main !== "Rain" && main !== "Thunderstorm") {
    tips.push({ type: "info", message: "Overcast skies. Light conditions may be dim." });
  }
  if (isRushHour) {
    tips.push({ type: "info", message: "Rush hour traffic expected. Plan extra travel time." });
  }
  if (main !== "Rain" && main !== "Thunderstorm" && temp <= 35) {
    tips.push({ type: "good", message: "Clear conditions. Good time for travel." });
  }
  if (tips.length === 0) {
    tips.push({ type: "info", message: "Normal traffic conditions expected." });
  }
  return tips;
}

export function getAgricultureAdvice(temp, humidity, windSpeed, clouds, main, month) {
  const tips = [];
  if (temp < 5) {
    tips.push({ type: "warning", message: "Frost risk. Protect crops with covers." });
  } else if (temp > 40) {
    tips.push({ type: "warning", message: "Extreme heat. Irrigate crops adequately." });
  } else if (temp >= 20 && temp <= 35 && humidity >= 50 && humidity <= 80) {
    tips.push({ type: "good", message: "Favorable conditions for crop growth." });
  }
  if (humidity < 30) {
    tips.push({ type: "warning", message: "Low humidity. Monitor soil moisture levels." });
  } else if (humidity > 85) {
    tips.push({ type: "warning", message: "High humidity. Watch for fungal diseases." });
  }
  if (windSpeed > 20) {
    tips.push({ type: "warning", message: "Strong winds. Secure crop covers and irrigation systems." });
  }
  if (clouds < 20) {
    tips.push({ type: "info", message: "High solar radiation. Ensure adequate irrigation." });
  } else if (clouds > 80) {
    tips.push({ type: "info", message: "Overcast conditions. Reduced photosynthesis." });
  }
  if (month >= 5 && month <= 9) {
    tips.push({ type: "info", message: "Monsoon/Kharif season. Plan sowing accordingly." });
  } else if (month >= 10 && month <= 11) {
    tips.push({ type: "info", message: "Rabi season. Prepare for winter crop sowing." });
  } else if (month >= 2 && month <= 4) {
    tips.push({ type: "info", message: "Summer/Zaid season. Suitable for short-duration crops." });
  }
  if (main === "Rain" || main === "Drizzle") {
    tips.push({ type: "info", message: "Rainfall expected. Delay fertilizer application." });
  }
  if (tips.length === 0) {
    tips.push({ type: "info", message: "Normal agricultural conditions. Proceed with routine." });
  }
  return tips;
}

export function getWorkoutAdvice(temp, humidity, windSpeed, main) {
  const ideal = { temp: { min: 18, max: 28 }, humidity: { max: 60 }, wind: { max: 20 } };
  const issues = [];
  let score = 80;
  if (main === "Thunderstorm") { score -= 40; issues.push("Thunderstorm — exercise indoors."); }
  else if (main === "Snow") { score -= 20; issues.push("Snow — dress warmly, watch for ice."); }
  else if (main === "Rain" || main === "Drizzle") { score -= 10; issues.push("Light rain — okay with waterproof gear."); }
  if (temp > 35) { score -= 25; issues.push("Extreme heat — avoid strenuous activity."); }
  else if (temp > 30) { score -= 15; issues.push("Very hot — exercise in early morning or evening."); }
  else if (temp < 10) { score -= 10; issues.push("Cold — layer up and warm up properly."); }
  if (humidity > 60) { score -= 5; issues.push("High humidity — pace yourself."); }
  if (windSpeed > 20) { score -= 8; issues.push("Strong winds — be careful of debris."); }
  const recommendations = getActivities(temp, main);
  return { score: Math.max(0, score), issues, recommendations };
}

function getActivities(temp, main) {
  if (main === "Rain" || main === "Thunderstorm" || main === "Snow" || temp > 35) {
    return ["Gym", "Yoga", "Swimming"];
  }
  const outdoor = [];
  if (temp >= 18 && temp <= 28) outdoor.push("Running", "Cycling");
  if (temp >= 15 && temp <= 30) outdoor.push("Walking");
  if (temp >= 20 && temp <= 32) outdoor.push("Cricket");
  if (temp >= 15 && temp <= 35) outdoor.push("Swimming");
  outdoor.push("Yoga");
  return outdoor.length > 0 ? outdoor : ["Yoga", "Walking"];
}

export function getPhotographyAdvice(clouds, main) {
  if (clouds > 70) return { rating: "good", tip: "Overcast — great for soft, diffused light and portraits." };
  if (clouds > 40) return { rating: "great", tip: "Partial clouds — dramatic skies possible." };
  return { rating: "fair", tip: "Clear sky — harsh light, use ND filters. Best at golden hour." };
}

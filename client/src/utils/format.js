export const formatTime = (ts) => {
  if (!ts) return "--:--";
  const date = ts instanceof Date ? ts : new Date(ts * 1000);
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
};

export const formatHour = (dtTxt) => {
  const hour = parseInt(dtTxt.split(" ")[1].split(":")[0]);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h = hour % 12 || 12;
  return `${h}${ampm}`;
};

export const isNow = (dtTxt) => {
  const now = new Date();
  const entry = new Date(dtTxt.replace(" ", "T"));
  return Math.abs(now - entry) < 2 * 60 * 60 * 1000;
};

export const getWindDirection = (deg) => {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round((deg || 0) / 45) % 8];
};

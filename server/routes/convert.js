import { Router } from "express";

const router = Router();

const unitDefs = {
  temperature: [
    { id: "celsius", label: "Celsius", symbol: "°C", toBase: (v) => v, fromBase: (v) => v },
    { id: "fahrenheit", label: "Fahrenheit", symbol: "°F", toBase: (v) => (v - 32) * 5/9, fromBase: (v) => v * 9/5 + 32 },
    { id: "kelvin", label: "Kelvin", symbol: "K", toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
  ],
  speed: [
    { id: "kmh", label: "km/h", symbol: "km/h", toBase: (v) => v, fromBase: (v) => v },
    { id: "mph", label: "mph", symbol: "mph", toBase: (v) => v * 1.60934, fromBase: (v) => v / 1.60934 },
    { id: "ms", label: "m/s", symbol: "m/s", toBase: (v) => v * 3.6, fromBase: (v) => v / 3.6 },
  ],
  pressure: [
    { id: "hpa", label: "hPa", symbol: "hPa", toBase: (v) => v, fromBase: (v) => v },
    { id: "inhg", label: "inHg", symbol: "inHg", toBase: (v) => v * 33.8639, fromBase: (v) => v / 33.8639 },
    { id: "mmhg", label: "mmHg", symbol: "mmHg", toBase: (v) => v * 1.33322, fromBase: (v) => v / 1.33322 },
  ],
  distance: [
    { id: "km", label: "Kilometers", symbol: "km", toBase: (v) => v, fromBase: (v) => v },
    { id: "miles", label: "Miles", symbol: "mi", toBase: (v) => v * 1.60934, fromBase: (v) => v / 1.60934 },
  ],
};

router.get("/units", (req, res) => {
  res.json({ success: true, data: unitDefs });
});

router.post("/convert", (req, res) => {
  try {
    const { value, from, to, type } = req.body;
    const defs = unitDefs[type];
    if (!defs) return res.status(400).json({ success: false, message: "Invalid type" });
    const fromUnit = defs.find((u) => u.id === from);
    const toUnit = defs.find((u) => u.id === to);
    if (!fromUnit || !toUnit) return res.status(400).json({ success: false, message: "Invalid unit" });
    const base = fromUnit.toBase(value);
    const result = toUnit.fromBase(base);
    res.json({ success: true, data: { value: Math.round(result * 100) / 100, symbol: toUnit.symbol } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

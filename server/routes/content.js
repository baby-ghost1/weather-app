import { Router } from "express";
import {
  weatherFacts, quizQuestions, recipes, playlists, sounds,
  seasonalEvents, festivals, themes,
} from "../services/content.js";

const router = Router();

router.get("/facts", (req, res) => {
  res.json({ success: true, data: weatherFacts });
});

router.get("/quiz", (req, res) => {
  const count = Math.min(parseInt(req.query.count) || 5, quizQuestions.length);
  const shuffled = [...quizQuestions].sort(() => Math.random() - 0.5).slice(0, count);
  res.json({ success: true, data: shuffled });
});

router.get("/recipes", (req, res) => {
  const category = req.query.category || "default";
  const filtered = recipes.filter((r) => r.category === category);
  res.json({ success: true, data: filtered });
});

router.get("/playlists", (req, res) => {
  const condition = req.query.condition || "default";
  const list = playlists.find((p) => p.condition === condition) || playlists.find((p) => p.condition === "default");
  res.json({ success: true, data: list?.songs || [] });
});

router.get("/sounds", (req, res) => {
  const recommended = req.query.weather || "";
  let recId = "white-noise";
  if (["Rain", "Drizzle"].includes(recommended)) recId = "rain";
  else if (recommended === "Thunderstorm") recId = "thunder";
  else if ((parseFloat(req.query.wind) || 0) > 20) recId = "wind";
  else if (recommended === "Clear") recId = (new Date().getHours() >= 6 && new Date().getHours() <= 18) ? "forest" : "night";
  const recSound = sounds.find((s) => s.id === recId);
  res.json({ success: true, data: { all: sounds, recommended: recSound ? [recSound] : [] } });
});

router.get("/events", (req, res) => {
  res.json({ success: true, data: { astronomical: seasonalEvents, festivals } });
});

router.get("/themes", (req, res) => {
  res.json({ success: true, data: themes });
});

export default router;

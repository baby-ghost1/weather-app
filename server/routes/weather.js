import { Router } from "express";
const router = Router();
import { getWeatherByCity, getWeatherByCoords } from "../controllers/weatherController.js";

router.get("/city/:city", getWeatherByCity);
router.get("/coords/:lat/:lon", getWeatherByCoords);

export default router;

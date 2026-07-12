import { Router } from "express";
const router = Router();
import { getForecastByCity, getForecastByCoords } from "../controllers/forecastController.js";

router.get("/city/:city", getForecastByCity);
router.get("/coords/:lat/:lon", getForecastByCoords);

export default router;

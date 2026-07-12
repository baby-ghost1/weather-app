import { Router } from "express";
const router = Router();
import { getAirQuality, getUVIndex } from "../controllers/environmentController.js";

router.get("/aqi/:lat/:lon", getAirQuality);
router.get("/uv/:lat/:lon", getUVIndex);

export default router;

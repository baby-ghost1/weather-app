import { Router } from "express";
const router = Router();
import { getHistory, addHistory, deleteHistory, clearHistory } from "../controllers/historyController.js";

router.get("/", getHistory);
router.post("/", addHistory);
router.delete("/:id", deleteHistory);
router.delete("/", clearHistory);

export default router;

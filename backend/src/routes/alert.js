import express from "express";
import { checkUserAuth } from "../middleware/index.js";
import {
	getAlertById,
	getAlerts,
	getAlertStats,
} from "../controllers/alertController.js";
const router = express.Router();

router.get("/", checkUserAuth, getAlerts);
router.get("/alert-stats", checkUserAuth, getAlertStats);
router.get("/:id", checkUserAuth, getAlertById);

export default router;

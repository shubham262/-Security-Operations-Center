import express from "express";
import { checkUserAuth } from "../middleware/index.js";
import {
	getAlertById,
	getAlerts,
	getAlertStats,
	updateAlertById,
} from "../controllers/alertController.js";
const router = express.Router();

router.get("/", checkUserAuth, getAlerts);
router.get("/alert-stats", checkUserAuth, getAlertStats);
router.get("/:id", checkUserAuth, getAlertById);
router.patch("/:id", checkUserAuth, updateAlertById);
export default router;

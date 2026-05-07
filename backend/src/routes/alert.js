import express from "express";
import { checkUserAuth } from "../middleware/index.js";
import {
	getAlertById,
	getAlerts,
	getAlertStats,
	handleEventStream,
	updateAlertById,
} from "../controllers/alertController.js";
const router = express.Router();

router.get("/", checkUserAuth, getAlerts);
router.get("/alert-stats", checkUserAuth, getAlertStats);
router.get("/:id", checkUserAuth, getAlertById);
router.patch("/:id", checkUserAuth, updateAlertById);
router.get("/event/stream", handleEventStream);
export default router;

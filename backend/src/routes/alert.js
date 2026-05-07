import express from "express";
import { checkUserAuth } from "../middleware/index.js";
import { getAlertById, getAlerts } from "../controllers/alertController.js";
const router = express.Router();

router.get(
	"/",
	//  checkUserAuth,
	getAlerts
);

router.get("/:id", getAlertById);

export default router;

import express from "express";
import { checkUserAuth } from "../middleware/index.js";
import { getAlerts } from "../controllers/alertController.js";
const router = express.Router();

router.get(
	"/fetch-alerts",
	//  checkUserAuth,

	getAlerts
);

export default router;

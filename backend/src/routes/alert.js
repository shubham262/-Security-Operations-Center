import express from "express";
import { checkUserAuth } from "../middleware/index.js";
import {
	getAlertById,
	getAlerts,
	getAlertStats,
	updateAlertById,
} from "../controllers/alertController.js";
import eventHub from "../lib/eventHub.js";
const router = express.Router();

router.get("/", checkUserAuth, getAlerts);
router.get("/alert-stats", checkUserAuth, getAlertStats);
router.get("/:id", checkUserAuth, getAlertById);
router.patch("/:id", checkUserAuth, updateAlertById);




router.get("/event/stream", (req, res) => {

	res.setHeader("Content-Type", "text/event-stream");
	res.setHeader("Cache-Control", "no-cache");
	res.setHeader("Connection", "keep-alive");
	res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

	
	const onAlertUpdate = () => {
		res.write(`data: ${JSON.stringify({ type: "REVALIDATE_LIST" })}\n\n`);
	};

	// Start listening to the hub
	eventHub.on("ALERT_UPDATED", onAlertUpdate);

	// Clean up when the client closes the connection
	req.on("close", () => {
		eventHub.off("ALERT_UPDATED", onAlertUpdate);
	});
});
export default router;

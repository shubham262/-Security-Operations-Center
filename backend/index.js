import express from "express";
import cors from "cors";
import { handleBetterAuth } from "./src/config/auth.js";
import { toNodeHandler } from "better-auth/node";
const app = express();

const auth = await handleBetterAuth();

app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
	})
);
app.use(express.json());
app.use("/api/auth", toNodeHandler(auth));
app.listen(3001, () => {
	console.log("Server started at port 3001");
});

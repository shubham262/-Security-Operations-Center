import express from "express";
import cors from "cors";
import { handleBetterAuth } from "./src/config/auth.js";
import { toNodeHandler } from "better-auth/node";
import alertRoute from "./src/routes/alert.js";

const app = express();
const auth = await handleBetterAuth();
const PORT = process.env.PORT || 3001;

app.set("trust proxy", 1);

const corsOptions = {
	origin: [
		"https://security-operations-center.vercel.app",
		"http://localhost:3000",
		/^https:\/\/.*\.vercel\.app$/,
	],
	credentials: true,
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use("/api/auth", toNodeHandler(auth));

app.use("/api/alert", alertRoute);

app.listen(PORT, () => {
	console.log(`Server started at port ${PORT}`);
});

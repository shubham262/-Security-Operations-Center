import { betterAuth } from "better-auth";
import { handleMongoDBConnection } from "./index.js";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { seedInitialAlerts } from "../helpers/seedAlert.js";

let auth = null;
export const handleBetterAuth = async () => {
	if (auth) return auth;
	const { db } = await handleMongoDBConnection();
	auth = betterAuth({
		database: mongodbAdapter(db),
		emailAndPassword: {
			enabled: true,
		},
		secret: process.env.BETTER_AUTH_SECRET,
		baseURL:
			process.env.ENVIRONMENT === "prod"
				? process.env.BETTER_AUTH_URL
				: "http://localhost:3001",
		trustedOrigins: [
			"https://security-operations-center.vercel.app",
			"https://security-operations-center-git-master-shubham262s-projects.vercel.app",
			"https://security-operations-center-ijypcse3c-shubham262s-projects.vercel.app",
			"https://*.vercel.app",
			"http://localhost:3000",
		],
		advanced: {
			defaultCookieAttributes: {
				sameSite: "none",
				secure: true,
				httpOnly: true,
			},
		},
		databaseHooks: {
			user: {
				create: {
					after: async (user) => {
						await seedInitialAlerts(user?.id);
					},
				},
			},
		},
	});
	return auth;
};

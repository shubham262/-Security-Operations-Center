import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
	baseURL:
		process.env.NEXT_PUBLIC_ENVIRONMENT === "prod"
			? "https://soc-api.aetherr.in"
			: "http://localhost:3001",
	fetchOptions: {
		credentials: "include",
	},
});

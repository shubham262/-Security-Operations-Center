import axios from "axios";

const api = axios.create({
	baseURL:
		process.env.NEXT_PUBLIC_ENVIRONMENT === "prod"
			? "https://soc-api.aetherr.in"
			: "http://localhost:3001",
	headers: {
		"Content-type": "application/json",
	},
	withCredentials: true,
});

export default api;

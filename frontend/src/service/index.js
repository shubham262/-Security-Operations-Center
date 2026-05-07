import axios from "axios";

const api = axios.create({
	baseURL:
		process.env.NEXT_PUBLIC_ENVIRONMENT === "prod"
			? process.env.NEXT_PUBLIC_BACKEND_URL
			: "http://localhost:3001",
	headers: {
		"Content-type": "application/json",
	},
	withCredentials: true,
});

export default api;

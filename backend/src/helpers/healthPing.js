import axios from "axios";

const pingHealthRoute = async () => {
	try {
		await axios.get("https://soc-api.aetherr.in/api/health");
		console.log("Health route pinged successfully");
	} catch (error) {
		console.error("Error pinging health route:", error);
	}
};

export const initiateHealthPingMechanism = () => {
	setInterval(pingHealthRoute, 90000);
};

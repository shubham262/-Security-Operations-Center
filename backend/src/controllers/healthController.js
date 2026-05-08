export const healthController = async (req, res) => {
	try {
		res.status(200).json({ message: "Healthy" });
	} catch (error) {
		return res.status(500).json({
			success: false,
			error: "Failed to fetch health",
		});
	}
};

import db from "../models/index.js";
const { Alert } = db;

export const getAlerts = async (req, res) => {
	try {
		const {
			page = 1,
			limit = 50,
			severity, //"critical", "high", "medium", "low", "info"
			status, //"new", "investigating", "resolved", "false_positive"
			category, //malware,phishing,unauthorized_access,data_exfiltration,policy_violation,suspicious_login,
			sortBy = "timestamp", //timestamp,severity
			sortOrder = "desc", // asc, desc
			search,
		} = req.query;

		const query = {};

		if (severity) query.severity = { $in: severity.split(",") };
		if (status) query.status = { $in: status.split(",") };
		if (category) query.category = { $in: category.split(",") };

		if (search) {
			query.$or = [
				{ title: { $regex: search, $options: "i" } },
				{ affected_asset: { $regex: search, $options: "i" } },
			];
		}

		const sortOptions = {};
		sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

		const skip = (parseInt(page) - 1) * parseInt(limit);

		const alerts = await Alert.find(query)
			.sort(sortOptions)
			.skip(skip)
			.limit(parseInt(limit))
			.select("-raw_event -__v")
			.populate("assignee", "name email");

		const total = await Alert.countDocuments(query);

		// 4. Return standard paginated response
		return res.status(200).json({
			data: alerts,
			meta: {
				total,
				page: parseInt(page),
				limit: parseInt(limit),
				totalPages: Math.ceil(total / parseInt(limit)),
			},
		});
	} catch (error) {
		console.error("Error fetching alerts:", error);
		return res.status(500).json({ error: "Failed to fetch alerts" });
	}
};

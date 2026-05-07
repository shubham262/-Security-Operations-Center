import db from "../models/index.js";
const { Alert } = db;

export const getAlerts = async (req, res) => {
	try {
		const {
			page = 1,
			limit = 50,
			sortBy = "timestamp",
			sortOrder = "desc",
			search,
		} = req.query;

		const query = {};

		const severityParam = req.query.severity || req.query["severity[]"];
		const statusParam = req.query.status || req.query["status[]"];
		const categoryParam = req.query.category || req.query["category[]"];

		if (severityParam) {
			query.severity = {
				$in: Array.isArray(severityParam)
					? severityParam
					: severityParam.split(","),
			};
		}
		if (statusParam) {
			query.status = {
				$in: Array.isArray(statusParam) ? statusParam : statusParam.split(","),
			};
		}
		if (categoryParam) {
			query.category = {
				$in: Array.isArray(categoryParam)
					? categoryParam
					: categoryParam.split(","),
			};
		}

		if (search) {
			query.$or = [
				{ title: { $regex: search, $options: "i" } },
				{ affected_asset: { $regex: search, $options: "i" } },
				{ description: { $regex: search, $options: "i" } },
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

export const getAlertById = async (req, res) => {
	try {
		const { id } = req.params || {};

		if (!id) {
			return res.status(400).json({ error: "Invalid alert ID format" });
		}

		const alert = await Alert.findById(id).populate("assignee", "name email");

		if (!alert) {
			return res.status(404).json({ error: "Alert not found" });
		}

		return res.status(200).json({ data: alert });
	} catch (error) {
		console.error("Error fetching alert details:", error);
		return res
			.status(500)
			.json({ error: "Internal server error while fetching alert details" });
	}
};

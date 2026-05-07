import { formatName } from "../helpers/index.js";
import eventHub from "../lib/eventHub.js";
import db from "../models/index.js";
import moment from "moment";
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

export const updateAlertById = async (req, res) => {
	try {
		const { id } = req.params || {};
		const updates = req.body;

		if (!id) {
			return res.status(400).json({ error: "Invalid alert ID format" });
		}
		const allowedUpdates = ["status", "severity", "assignee", "description"];
		const filteredUpdates = Object.keys(updates)
			.filter((key) => allowedUpdates.includes(key))
			.reduce((obj, key) => {
				obj[key] = updates[key];
				return obj;
			}, {});

		if (Object.keys(filteredUpdates).length === 0) {
			return res.status(400).json({ error: "No valid update fields provided" });
		}
		const alert = await Alert.findByIdAndUpdate(id, filteredUpdates, {
			new: true,
			runValidators: true,
		}).populate("assignee", "name email");

		if (!alert) {
			return res.status(404).json({ error: "Alert not found" });
		}
		eventHub.emit("ALERT_UPDATED");
		return res.status(200).json({
			success: true,
			message: "Alert updated successfully",
			data: alert,
		});
	} catch (error) {
		console.error("Error fetching alert details:", error);
		return res
			.status(500)
			.json({ error: "Internal server error while fetching alert details" });
	}
};

export const getAlertStats = async (req, res) => {
	try {
		const oneDayAgo = moment().subtract(24, "hours").toDate();

		const [aggregationResult] = await Alert.aggregate([
			{
				$facet: {
					severityStats: [
						{ $group: { _id: "$severity", count: { $sum: 1 } } },
						{ $sort: { count: -1 } },
					],
					categoryStats: [
						{ $group: { _id: "$category", count: { $sum: 1 } } },
						{ $sort: { count: -1 } },
					],
					statusStats: [
						{ $group: { _id: "$status", count: { $sum: 1 } } },
						{ $sort: { count: -1 } },
					],
					totalOpen: [
						{ $match: { status: { $in: ["new", "investigating"] } } },
						{ $count: "count" },
					],
					resolved24h: [
						{ $match: { status: "resolved", timestamp: { $gte: oneDayAgo } } },
						{ $count: "count" },
					],
				},
			},
		]);

		const formatForCharts = (data) =>
			data.map((item) => ({
				id: item._id,
				name: formatName(item._id),
				value: item.count,
			}));

		const severityData = formatForCharts(aggregationResult.severityStats);

		const criticalCount =
			severityData.find((s) => s.id === "critical")?.value || 0;
		const highCount = severityData.find((s) => s.id === "high")?.value || 0;
		const openCount = aggregationResult.totalOpen[0]?.count || 0;
		const resolved24hCount = aggregationResult.resolved24h[0]?.count || 0;

		return res.status(200).json({
			success: true,
			data: {
				charts: {
					severity: severityData,
					category: formatForCharts(aggregationResult.categoryStats),
					status: formatForCharts(aggregationResult.statusStats),
				},
				kpis: {
					totalOpen: openCount,
					critical: criticalCount,
					high: highCount,
					resolved24h: resolved24hCount,
				},
			},
		});
	} catch (error) {
		console.error("Error fetching overview stats:", error);
		return res
			.status(500)
			.json({ success: false, error: "Failed to fetch dashboard statistics" });
	}
};

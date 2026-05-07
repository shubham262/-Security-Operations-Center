import mongoose, { Schema } from "mongoose";

const alertSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		timestamp: {
			type: Date,
			required: true,
			default: Date.now,
		},
		severity: {
			type: String,
			enum: ["critical", "high", "medium", "low", "info"],
			required: true,
		},
		status: {
			type: String,
			enum: ["new", "investigating", "resolved", "false_positive"],
			default: "new",
			required: true,
		},
		category: {
			type: String,
			enum: [
				"malware",
				"phishing",
				"unauthorized_access",
				"data_exfiltration",
				"policy_violation",
				"suspicious_login",
			],
			required: true,
		},
		source: {
			type: String,
			required: true,
			trim: true, // e.g., 'endpoint-agent', 'email-gateway', 'firewall', 'cloud-audit'
		},
		affected_asset: {
			type: String,
			required: true,
			trim: true, // Hostname, user, or IP involved
		},
		assignee: {
			type: Schema.Types.ObjectId,
			ref: "User",
			default: null,
		},
		description: {
			type: String,
			required: true,
		},
		raw_event: {
			type: Schema.Types.Mixed,
			required: true,
		},
	},
	{ timestamps: true }
);

const Alert = mongoose.model("Alert", alertSchema);

export default Alert;

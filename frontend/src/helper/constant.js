export const severityOptions = [
	{ value: "critical", label: "Critical" },
	{ value: "high", label: "High" },
	{ value: "medium", label: "Medium" },
	{ value: "low", label: "Low" },
	{ value: "info", label: "Info" },
];

export const categoryOptions = [
	{ value: "malware", label: "Malware" },
	{ value: "phishing", label: "Phishing" },
	{ value: "unauthorized_access", label: "Unauthorized Access" },
	{ value: "data_exfiltration", label: "Data Exfiltration" },
	{ value: "policy_violation", label: "Policy Violation" },
	{ value: "suspicious_login", label: "Suspicious Login" },
];
export const statusOptions = [
	{ value: "new", label: "New" },
	{ value: "investigating", label: "Investigating" },
	{ value: "resolved", label: "Resolved" },
	{ value: "false_positive", label: "False Positive" },
];

export const getSeverityStyles = (severity) => {
	switch (severity) {
		case "critical":
			return {
				dot: "bg-red-500",
				text: "text-red-700",
				border: "border-l-red-500",
			};
		case "high":
			return {
				dot: "bg-orange-500",
				text: "text-orange-700",
				border: "border-l-orange-500",
			};
		case "medium":
			return {
				dot: "bg-blue-500",
				text: "text-blue-700",
				border: "border-l-blue-500",
			};
		case "low":
			return {
				dot: "bg-slate-400",
				text: "text-slate-600",
				border: "border-l-slate-300",
			};
		case "info":
			return {
				dot: "bg-cyan-500",
				text: "text-cyan-700",
				border: "border-l-cyan-500",
			};
		default:
			return {
				dot: "bg-slate-300",
				text: "text-slate-500",
				border: "border-l-transparent",
			};
	}
};

export const getStatusColor = (status) => {
	switch (status) {
		case "new":
			return "processing";
		case "investigating":
			return "warning";
		case "resolved":
			return "success";
		default:
			return "default";
	}
};

export const severityDataMapper = {
	critical: "#ef4444",
	high: "#f97316",
	medium: "#3b82f6",
	low: "#94a3b8",
	info: "#06b6d4",
};
export const categoryDataMapper = {
	phishing: "#6366f1",
	suspicious_login: "#8b5cf6",
	policy_violation: "#a855f7",
	malware: "#d946ef",
	unauthorized_access: "#ec4899",
	data_exfiltration: "#f43f5e",
};

export const statusDataMapper = {
	new: "#3b82f6",
	investigating: "#eab308",
	resolved: "#22c55e",
	false_positive: "#64748b",
};

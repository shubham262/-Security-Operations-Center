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

export const statusStyles = {
	new: "processing",
	investigating: "warning",
	resolved: "success",
	false_positive: "default",
};

export const severityStyles = {
	critical: { color: "red", label: "CRITICAL" },
	high: { color: "volcano", label: "HIGH" },
	medium: { color: "blue", label: "MEDIUM" },
	low: { color: "default", label: "LOW" },
	info: { color: "cyan", label: "INFO" },
};

import db from "../models/index.js";
const { Alert } = db;

// --- Mock Data Pools & Helpers ---
const ASSETS = [
	"192.168.1.15",
	"10.0.0.42",
	"172.16.254.1",
	"win-desktop-04",
	"macbook-pro-jdoe",
	"srv-db-prod-01",
	"srv-web-02",
	"alice.smith@soc.local",
	"bob.jones@soc.local",
	"aws-ec2-jumpbox",
	"10.100.5.22",
];

const getWeightedRandom = (options) => {
	const totalWeight = options.reduce((sum, opt) => sum + opt.weight, 0);
	let random = Math.random() * totalWeight;
	for (const option of options) {
		if (random < option.weight) return option.value;
		random -= option.weight;
	}
};

const getRandomDate = (daysBack) => {
	const now = new Date();
	const past = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
	return new Date(
		past.getTime() + Math.random() * (now.getTime() - past.getTime())
	);
};

const CATEGORY_SOURCE_MAP = {
	malware: ["endpoint-agent"],
	phishing: ["email-gateway"],
	unauthorized_access: ["firewall", "cloud-audit"],
	data_exfiltration: ["firewall", "endpoint-agent", "cloud-audit"],
	policy_violation: ["endpoint-agent", "cloud-audit"],
	suspicious_login: ["cloud-audit", "firewall"],
};

const generateMockAlert = (userId) => {
	const severity = getWeightedRandom([
		{ value: "info", weight: 45 },
		{ value: "low", weight: 30 },
		{ value: "medium", weight: 15 },
		{ value: "high", weight: 8 },
		{ value: "critical", weight: 2 },
	]);

	const category = getWeightedRandom([
		{ value: "suspicious_login", weight: 25 },
		{ value: "policy_violation", weight: 25 },
		{ value: "phishing", weight: 20 },
		{ value: "malware", weight: 15 },
		{ value: "unauthorized_access", weight: 10 },
		{ value: "data_exfiltration", weight: 5 },
	]);

	const allowedSources = CATEGORY_SOURCE_MAP[category];
	const source =
		allowedSources[Math.floor(Math.random() * allowedSources.length)];
	const asset = ASSETS[Math.floor(Math.random() * ASSETS.length)];
	const timestamp = getRandomDate(30);
	const title = `${category
		.replace("_", " ")
		.toUpperCase()} detected on ${asset}`;

	// Randomly assign ~5% of new alerts directly to this new user so their queue isn't completely empty
	const isAssignedToUser = Math.random() < 0.05;

	let status;
	if (isAssignedToUser) {
		status = "investigating";
	} else {
		status = getWeightedRandom([
			{ value: "resolved", weight: 40 },
			{ value: "false_positive", weight: 30 },
			{ value: "new", weight: 20 },
		]);
	}

	const raw_event = {
		event_id: `evt_${Math.random().toString(36).substring(2, 9)}`,
		sensor: source,
		captured_at: timestamp.toISOString(),
		metadata: {
			process_id: Math.floor(Math.random() * 10000),
			bytes_transferred: Math.floor(Math.random() * 500000),
			flags: ["auto-triaged", "rule-match"],
		},
	};

	return {
		title,
		timestamp,
		severity,
		status,
		category,
		source,
		affected_asset: asset,
		assignee: isAssignedToUser ? userId : null,
		description: `Automated detection triggered for ${category} behavior originating from ${source}. Analyst review recommended.`,
		raw_event,
	};
};

export const seedInitialAlerts = async (userId) => {
	try {
		const alertBatch = [];
		const TARGET_COUNT = 1000;

		for (let i = 0; i < TARGET_COUNT; i++) {
			alertBatch.push(generateMockAlert(userId));
		}

		await Alert.insertMany(alertBatch);
		console.log(
			`✅ Successfully seeded ${TARGET_COUNT} alerts after user signup.`
		);

		return { success: true, count: TARGET_COUNT };
	} catch (error) {
		console.error("❌ Error seeding initial alerts:", error);
		throw new Error("Failed to seed alert dataset");
	}
};

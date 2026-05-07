"use client";
import React, { useCallback } from "react";
import { Button, Card, Typography } from "antd";
import {
	FiShield,
	FiActivity,
	FiList,
	FiMaximize,
	FiArrowRight,
} from "react-icons/fi";
import Logo from "@/components/Logo";
import { useRouter } from "next/navigation";

const { Title, Paragraph } = Typography;

const Landing = () => {
	const router = useRouter();
	const handleLogin = useCallback(() => {
		return router.push("/signin");
	}, [router]);
	return (
		<div className="flex flex-col min-h-screen bg-white text-gray-800 font-sans items-center overflow-x-hidden">
			{/* Navigation Bar - Constrained Width */}
			<nav className="flex justify-between items-center py-5 px-6 w-full max-w-6xl border-b border-gray-100">
				<Logo />

				<div className="flex items-center space-x-4">
					<Button
						type="primary"
						className="bg-blue-600 flex items-center space-x-2 h-10 px-4 rounded-lg"
						onClick={handleLogin}
					>
						<span className="font-medium">Analyst Login</span>
						<FiArrowRight />
					</Button>
				</div>
			</nav>

			{/* Main Content Wrapper */}
			<main className="flex flex-col items-center w-full flex-grow">
				{/* Centered Hero Section */}
				<section className="flex flex-col items-center text-center pt-20 pb-16 px-6 w-full max-w-3xl">
					<div className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-8 border border-blue-100">
						<span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
						<span>Live Threat Monitoring</span>
					</div>

					<Title
						level={1}
						className="!m-0 !text-gray-900 !text-4xl sm:!text-5xl md:!text-6xl !leading-tight font-extrabold tracking-tight"
					>
						Triage security alerts with{" "}
						<span className="text-blue-600">confidence.</span>
					</Title>

					<Paragraph className="!text-lg sm:!text-xl !text-gray-500 !mt-6 !mb-0 max-w-2xl">
						Cut through the noise. Provide your security operations center with
						an at-a-glance dashboard, powerful filtering, and actionable
						drill-down views.
					</Paragraph>

					{/* Responsive Buttons */}
					<div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-10 w-full sm:w-auto">
						<Button
							type="primary"
							size="large"
							className="bg-blue-600 h-14 px-8 text-lg rounded-lg w-full sm:w-auto font-medium shadow-md shadow-blue-600/20"
						>
							Go to Dashboard
						</Button>
					</div>
				</section>

				{/* Abstract UI Preview - Centered & Responsive */}
				<section className="flex flex-col items-center w-full max-w-4xl px-6 pb-24">
					<Card
						className="w-full shadow-2xl border-0 rounded-2xl overflow-hidden bg-white ring-1 ring-gray-100"
						styles={{ body: { padding: 0 } }}
					>
						<div className="bg-blue-600 p-4 flex justify-between items-center text-white">
							<span className="font-semibold flex items-center space-x-2">
								<FiActivity /> <span>Incoming Alerts Queue</span>
							</span>
							<span className="text-xs bg-white/20 px-2 py-1 rounded font-medium">
								Last 24h
							</span>
						</div>
						<div className="flex flex-col">
							<div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 border-b border-gray-50 space-y-2 sm:space-y-0">
								<div className="flex flex-col">
									<span className="text-sm sm:text-base font-semibold text-gray-900">
										Unauthorized Access Attempt
									</span>
									<span className="text-xs sm:text-sm text-gray-500">
										source: firewall • 2 mins ago
									</span>
								</div>
								<span className="w-fit px-2.5 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-md border border-red-100">
									Critical
								</span>
							</div>
							<div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 border-b border-gray-50 space-y-2 sm:space-y-0 bg-gray-50/50">
								<div className="flex flex-col">
									<span className="text-sm sm:text-base font-semibold text-gray-900">
										Suspicious Login Location
									</span>
									<span className="text-xs sm:text-sm text-gray-500">
										source: cloud-audit • 15 mins ago
									</span>
								</div>
								<span className="w-fit px-2.5 py-1 bg-orange-50 text-orange-600 text-xs font-bold rounded-md border border-orange-100">
									High
								</span>
							</div>
							<div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 space-y-2 sm:space-y-0">
								<div className="flex flex-col">
									<span className="text-sm sm:text-base font-semibold text-gray-900">
										Multiple Failed Phishing Drops
									</span>
									<span className="text-xs sm:text-sm text-gray-500">
										source: email-gateway • 1 hr ago
									</span>
								</div>
								<span className="w-fit px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-md border border-blue-100">
									Medium
								</span>
							</div>
						</div>
					</Card>
				</section>

				{/* Features Section */}
				<section className="flex flex-col w-full max-w-5xl px-6 pb-24 items-center">
					<div className="text-center mb-12 max-w-2xl">
						<Title level={2} className="!text-gray-900 !font-bold !mb-4">
							Core SOC Workflows
						</Title>
						<Paragraph className="!text-gray-500 !text-base">
							Built specifically for security analysts, providing the essential
							views to aggregate, investigate, and resolve incidents.
						</Paragraph>
					</div>

					<div className="flex flex-col md:flex-row w-full space-y-6 md:space-y-0 md:space-x-6 items-stretch justify-center gap-4">
						{/* Feature 1 */}
						<Card
							className="flex-1 shadow-sm hover:shadow-md transition-shadow border-gray-100 rounded-xl"
							variant="outlined"
						>
							<div className="flex flex-col h-full items-start">
								<div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-5 border border-blue-100">
									<FiActivity size={24} />
								</div>
								<Title level={4} className="!mb-3 !text-gray-900">
									Alerts Dashboard
								</Title>
								<Paragraph className="text-gray-500 flex-grow !mb-0 leading-relaxed">
									Get an at-a-glance summary of the alert landscape. View
									aggregated counts and breakdowns by severity, category, and
									status.
								</Paragraph>
							</div>
						</Card>

						{/* Feature 2 */}
						<Card
							className="flex-1 shadow-sm hover:shadow-md transition-shadow border-gray-100 rounded-xl"
							variant="outlined"
						>
							<div className="flex flex-col h-full items-start">
								<div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-5 border border-blue-100">
									<FiList size={24} />
								</div>
								<Title level={4} className="!mb-3 !text-gray-900">
									Filterable List
								</Title>
								<Paragraph className="text-gray-500 flex-grow !mb-0 leading-relaxed">
									Dive into the queue with a highly functional list view. Filter
									by severity or status, and sort to prioritize critical
									incidents.
								</Paragraph>
							</div>
						</Card>

						{/* Feature 3 */}
						<Card
							className="flex-1 shadow-sm hover:shadow-md transition-shadow border-gray-100 rounded-xl"
							variant="outlined"
						>
							<div className="flex flex-col h-full items-start">
								<div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-5 border border-blue-100">
									<FiMaximize size={24} />
								</div>
								<Title level={4} className="!mb-3 !text-gray-900">
									Deep Drill-down
								</Title>
								<Paragraph className="text-gray-500 flex-grow !mb-0 leading-relaxed">
									Inspect every detail of a single alert. Read the raw event
									JSON, reassign severity, update status, or dismiss false
									positives.
								</Paragraph>
							</div>
						</Card>
					</div>
				</section>
			</main>

			{/* Footer */}
			<footer className="flex flex-col sm:flex-row justify-between items-center py-8 px-6 w-full max-w-6xl border-t border-gray-100 mt-auto">
				<div className="flex items-center space-x-2 text-gray-500 mb-4 sm:mb-0">
					<FiShield size={20} />
					<span className="font-semibold text-gray-700">SOCTriage</span>
				</div>
			</footer>
		</div>
	);
};

export default Landing;

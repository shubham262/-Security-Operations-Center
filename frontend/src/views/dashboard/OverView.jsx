/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/immutability */
"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Spin, message } from "antd";
import {
	FiShield,
	FiActivity,
	FiAlertTriangle,
	FiCheckCircle,
	FiRefreshCw,
} from "react-icons/fi";
import {
	PieChart,
	Pie,
	Cell,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip as RechartsTooltip,
	ResponsiveContainer,
	Legend,
} from "recharts";
import { fetchStats } from "@/service/alerts";
import {
	categoryDataMapper,
	severityDataMapper,
	statusDataMapper,
} from "@/helper/constant";

const CustomTooltip = ({ active, payload }) => {
	if (active && payload && payload.length) {
		return (
			<div className="bg-slate-900 border border-slate-700 text-white p-3 rounded-md shadow-xl text-[13px] font-sans">
				<p className="font-semibold mb-1">{payload[0].payload.name}</p>
				<p className="text-slate-300">
					Count:{" "}
					<span className="text-white font-mono font-medium ml-1">
						{payload[0].value}
					</span>
				</p>
			</div>
		);
	}
	return null;
};

const OverView = () => {
	const router = useRouter();

	const [info, setInfo] = useState({
		critical: 0,
		high: 0,
		resolved24h: 0,
		totalOpen: 0,
		severityData: [],
		categoryData: [],
		statusData: [],
	});

	useEffect(() => {
		handleFetchStats();
	}, []);
	const handleFetchStats = useCallback(async () => {
		try {
			const { data } = await fetchStats();
			const { charts, kpis } = data || {};

			setInfo((prev) => ({
				...prev,
				...(kpis || {}),
				severityData: charts?.severity?.map((ele) => ({
					...ele,
					color: severityDataMapper?.[ele?.id],
				})),
				categoryData: charts?.category?.map((ele) => ({
					...ele,
					color: categoryDataMapper?.[ele?.id],
				})),
				statusData: charts?.status?.map((ele) => ({
					...ele,
					color: statusDataMapper?.[ele?.id],
				})),
				loading: false,
			}));
		} catch (error) {
			console.log("error==>handleFetchStats", error);
			message.error(error?.message || "Something went wrong");
		}
	}, []);

	const handleRefresh = () => {
		setInfo((prev) => ({ ...prev, loading: true }));
		handleFetchStats();
	};

	const navigateToFilteredList = (filterType, filterId) => {
		router.push(`/dashboard/alerts?${filterType}=${filterId}`);
	};

	if (info?.loading) {
		return (
			<div className="flex flex-col gap-6 max-w-[100vw] font-sans antialiased text-slate-800">
				<Spin size="large" />
			</div>
		);
	}
	return (
		<div className="flex flex-col gap-6 max-w-[100vw] font-sans antialiased text-slate-800">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
				<div className="flex items-center gap-3">
					<div className="w-8 h-8 bg-slate-900 text-white rounded flex items-center justify-center">
						<FiActivity size={16} />
					</div>
					<div>
						<h1 className="text-lg font-semibold text-slate-900 m-0 leading-none">
							Security Posture Overview
						</h1>
						<span className="text-[13px] text-slate-500 font-medium">
							Aggregated metrics and landscape analysis
						</span>
					</div>
				</div>
				<Button
					size="small"
					className="text-[13px] font-medium border-slate-300 text-slate-600 shadow-sm rounded flex items-center gap-1.5"
					onClick={handleRefresh}
				>
					<FiRefreshCw
						className={info?.loading ? "animate-spin" : ""}
						size={12}
					/>
					Refresh Data
				</Button>
			</div>

			{/* KPI Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{/* Total Active */}
				<Card
					variant="borderless"
					className="border border-slate-200 shadow-sm cursor-pointer hover:border-blue-400 transition-colors group"
					styles={{ body: { padding: "20px" } }}
					onClick={() => navigateToFilteredList("status", "new,investigating")}
				>
					<div className="flex justify-between items-start">
						<div className="flex flex-col">
							<span className="text-slate-500 text-[13px] font-medium uppercase tracking-wide mb-1">
								Open Alerts
							</span>
							<span className="text-3xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
								{info?.totalOpen}
							</span>
						</div>
						<div className="p-2 bg-blue-50 text-blue-500 rounded">
							<FiShield size={20} />
						</div>
					</div>
				</Card>

				{/* Critical Status */}
				<Card
					className="border border-slate-200 shadow-sm cursor-pointer hover:border-red-400 transition-colors group"
					styles={{ body: { padding: "20px" } }}
					onClick={() => navigateToFilteredList("severity", "critical")}
				>
					<div className="flex justify-between items-start">
						<div className="flex flex-col">
							<span className="text-slate-500 text-[13px] font-medium uppercase tracking-wide mb-1">
								Critical
							</span>
							<span className="text-3xl font-bold text-slate-900 group-hover:text-red-600 transition-colors">
								{info?.critical}
							</span>
						</div>
						<div className="p-2 bg-red-50 text-red-500 rounded">
							<FiAlertTriangle size={20} />
						</div>
					</div>
				</Card>

				{/* High Status */}
				<Card
					variant="borderless"
					className="border border-slate-200 shadow-sm cursor-pointer hover:border-orange-400 transition-colors group"
					styles={{ body: { padding: "20px" } }}
					onClick={() => navigateToFilteredList("severity", "high")}
				>
					<div className="flex justify-between items-start">
						<div className="flex flex-col">
							<span className="text-slate-500 text-[13px] font-medium uppercase tracking-wide mb-1">
								High Severity
							</span>
							<span className="text-3xl font-bold text-slate-900 group-hover:text-orange-500 transition-colors">
								{info?.high}
							</span>
						</div>
						<div className="p-2 bg-orange-50 text-orange-500 rounded">
							<FiActivity size={20} />
						</div>
					</div>
				</Card>

				{/* Resolved Last 24h */}
				<Card
					variant="borderless"
					className="border border-slate-200 shadow-sm cursor-pointer hover:border-green-400 transition-colors group"
					styles={{ body: { padding: "20px" } }}
					onClick={() => navigateToFilteredList("status", "resolved")}
				>
					<div className="flex justify-between items-start">
						<div className="flex flex-col">
							<span className="text-slate-500 text-[13px] font-medium uppercase tracking-wide mb-1">
								Resolved (24h)
							</span>
							<span className="text-3xl font-bold text-slate-900 group-hover:text-green-500 transition-colors">
								{info?.resolved24h}
							</span>
						</div>
						<div className="p-2 bg-green-50 text-green-500 rounded">
							<FiCheckCircle size={20} />
						</div>
					</div>
				</Card>
			</div>

			{/* Charts Row 1: Severity & Status */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				{/* Severity Breakdown (Donut Chart) */}
				<Card
					variant="borderless"
					className="border border-slate-200 shadow-sm"
					styles={{ body: { padding: "20px" } }}
				>
					<h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-wide mb-6">
						Alerts by Severity
					</h2>
					<div className="h-[280px] w-full">
						<ResponsiveContainer width="100%" height="100%">
							<PieChart>
								<Pie
									data={info?.severityData}
									cx="50%"
									cy="50%"
									innerRadius={70}
									outerRadius={100}
									paddingAngle={3}
									dataKey="value"
									onClick={(data) =>
										navigateToFilteredList("severity", data.id)
									}
									className="cursor-pointer outline-none"
								>
									{info?.severityData?.map((entry, index) => (
										<Cell
											key={`cell-${index}`}
											fill={entry.color}
											className="hover:opacity-80 transition-opacity"
										/>
									))}
								</Pie>
								<RechartsTooltip content={<CustomTooltip />} />
								<Legend
									verticalAlign="bottom"
									height={36}
									iconType="circle"
									formatter={(value) => (
										<span className="text-[13px] text-slate-600 font-medium">
											{value}
										</span>
									)}
								/>
							</PieChart>
						</ResponsiveContainer>
					</div>
				</Card>

				{/* Status Breakdown (Vertical Bar Chart) */}
				<Card
					className="border border-slate-200 shadow-sm"
					styles={{ body: { padding: "20px" } }}
				>
					<h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-wide mb-6">
						Pipeline Status
					</h2>
					<div className="h-[280px] w-full">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart
								data={info?.statusData}
								margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
							>
								<CartesianGrid
									strokeDasharray="3 3"
									vertical={false}
									stroke="#e2e8f0"
								/>
								<XAxis
									dataKey="name"
									tickLine={false}
									axisLine={false}
									tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
									dy={10}
								/>
								<YAxis
									tickLine={false}
									axisLine={false}
									tick={{ fill: "#64748b", fontSize: 12 }}
								/>
								<RechartsTooltip
									content={<CustomTooltip />}
									cursor={{ fill: "#f8fafc" }}
								/>
								<Bar
									dataKey="value"
									radius={[4, 4, 0, 0]}
									onClick={(data) => navigateToFilteredList("status", data.id)}
									className="cursor-pointer"
								>
									{info?.statusData?.map((entry, index) => (
										<Cell
											key={`cell-${index}`}
											fill={entry.color}
											className="hover:opacity-80 transition-opacity"
										/>
									))}
								</Bar>
							</BarChart>
						</ResponsiveContainer>
					</div>
				</Card>
			</div>

			{/* Charts Row 2: Category Breakdown */}
			<div className="grid grid-cols-1 gap-4">
				<Card
					variant="borderless"
					className="border border-slate-200 shadow-sm"
					styles={{ body: { padding: "20px" } }}
				>
					<h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-wide mb-6">
						Threat Categories
					</h2>
					<div className="h-[300px] w-full min-w-0">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart
								data={info?.categoryData}
								layout="vertical"
								margin={{ top: 0, right: 30, left: 40, bottom: 0 }}
							>
								<CartesianGrid
									strokeDasharray="3 3"
									horizontal={false}
									stroke="#e2e8f0"
								/>
								<XAxis
									type="number"
									tickLine={false}
									axisLine={false}
									tick={{ fill: "#64748b", fontSize: 12 }}
								/>
								<YAxis
									type="category"
									dataKey="name"
									tickLine={false}
									axisLine={false}
									tick={{ fill: "#475569", fontSize: 12, fontWeight: 500 }}
									dx={-10}
								/>
								<RechartsTooltip
									content={<CustomTooltip />}
									cursor={{ fill: "#f8fafc" }}
								/>
								<Bar
									dataKey="value"
									radius={[0, 4, 4, 0]}
									barSize={24}
									onClick={(data) =>
										navigateToFilteredList("category", data.id)
									}
									className="cursor-pointer"
								>
									{info?.categoryData?.map((entry, index) => (
										<Cell
											key={`cell-${index}`}
											fill={entry.color}
											className="hover:opacity-80 transition-opacity"
										/>
									))}
								</Bar>
							</BarChart>
						</ResponsiveContainer>
					</div>
				</Card>
			</div>
		</div>
	);
};

export default OverView;

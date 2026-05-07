/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Input, Select, Button, Tag, Space, Pagination } from "antd";
import {
	FiSearch,
	FiRefreshCw,
	FiChevronRight,
	FiTerminal,
	FiShield,
	FiArrowDown,
	FiArrowUp,
	FiClock,
	FiFilter,
	FiUser,
} from "react-icons/fi";
import Link from "next/link";
import moment from "moment"; // Added moment.js
import { fetchAllAlerts } from "@/service/alerts";
import {
	categoryOptions,
	severityOptions,
	statusOptions,
	getStatusColor,
	getSeverityStyles,
} from "@/helper/constant";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

const { Option } = Select;

const AlertList = () => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [info, setInfo] = useState({
		loading: true,
		refreshLoading: false,
		totalRecords: 0,
		data: [],
	});

	const [params, setParams] = useState({
		page: Number(searchParams.get("page")) || 1,
		limit: Number(searchParams.get("limit")) || 15,
		search: searchParams.get("search") || "",
		severity: searchParams.get("severity")
			? searchParams.get("severity").split(",")
			: [],
		status: searchParams.get("status")
			? searchParams.get("status").split(",")
			: [],
		category: searchParams.get("category")
			? searchParams.get("category").split(",")
			: [],
		sortBy: searchParams.get("sortBy") || "timestamp",
		sortOrder: searchParams.get("sortOrder") || "desc",
	});

	useEffect(() => {
		const timeout = setTimeout(() => {
			getAllAlerts();
		}, 500);

		return () => clearTimeout(timeout);
	}, [params]);

	useEffect(() => {
		const query = new URLSearchParams();

		Object.entries(params).forEach(([key, value]) => {
			if (
				value !== undefined &&
				value !== null &&
				value !== "" &&
				!(Array.isArray(value) && value.length === 0)
			) {
				query.set(
					key,
					Array.isArray(value) ? value.join(",") : value.toString()
				);
			}
		});

		router.replace(`${pathname}?${query.toString()}`);
	}, [params, router, pathname]);

	const getAllAlerts = useCallback(async () => {
		try {
			if (info?.refreshLoading) return;
			setInfo((prev) => ({ ...prev, loading: true, refreshLoading: true }));
			const { data = [], meta = {} } = await fetchAllAlerts({ ...params });
			setInfo((prev) => ({
				...prev,
				data,
				totalRecords: meta?.total || 0,
				refreshLoading: false,
			}));
		} catch (error) {
			console.error("Failed to fetch alerts:", error);
		} finally {
			setInfo((prev) => ({ ...prev, loading: false, refreshLoading: false }));
		}
	}, [params]);

	const handleFilterChange = (key, value) => {
		setParams((prev) => ({ ...prev, [key]: value, page: 1 }));
	};

	const handlePageChange = (page, pageSize) => {
		setParams((prev) => ({ ...prev, page, limit: pageSize }));
	};

	return (
		<div className="flex flex-col gap-5 max-w-[100vw] font-sans antialiased text-slate-800">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
				<div className="flex items-center gap-3">
					<div className="w-8 h-8 bg-slate-900 text-white rounded flex items-center justify-center">
						<FiShield size={16} />
					</div>
					<div>
						<h1 className="text-lg font-semibold text-slate-900 m-0 leading-none">
							Alert Triage Queue
						</h1>
						<span className="text-[13px] text-slate-500 font-medium">
							Real-time threat monitoring
						</span>
					</div>
				</div>
				<Button
					size="small"
					className="text-[13px] font-medium border-slate-300 text-slate-600 shadow-sm rounded flex items-center gap-1.5"
					onClick={getAllAlerts}
				>
					<FiRefreshCw
						className={info?.refreshLoading ? "animate-spin" : ""}
						size={12}
					/>
					Refresh
				</Button>
			</div>

			{/* Command Bar (Filters) */}
			<div className="bg-slate-50 border border-slate-200 rounded-md p-3 flex flex-col gap-3">
				<div className="flex flex-col lg:flex-row gap-3">
					<Input
						placeholder="Search title, IP, or hostname..."
						prefix={<FiSearch className="text-slate-400 mr-1" />}
						className="lg:max-w-md rounded text-[13px] border-slate-300 hover:border-blue-400 focus:border-blue-500"
						allowClear
						value={params.search}
						onChange={(e) => handleFilterChange("search", e.target.value)}
					/>

					<div className="flex flex-1 flex-col sm:flex-row gap-3">
						<Select
							mode="multiple"
							allowClear
							placeholder={
								<span className="text-[13px]">
									<FiFilter className="inline mr-1" /> Severity
								</span>
							}
							className="flex-1 [&_.ant-select-selector]:rounded [&_.ant-select-selection-item]:text-[12px]"
							maxTagCount="responsive"
							onChange={(val) => handleFilterChange("severity", val)}
							options={severityOptions}
							value={params?.severity}
						/>
						<Select
							mode="multiple"
							allowClear
							placeholder={
								<span className="text-[13px]">
									<FiFilter className="inline mr-1" /> Category
								</span>
							}
							className="flex-1 [&_.ant-select-selector]:rounded [&_.ant-select-selection-item]:text-[12px]"
							maxTagCount="responsive"
							onChange={(val) => handleFilterChange("category", val)}
							options={categoryOptions}
							value={params?.category}
						/>
						<Select
							mode="multiple"
							allowClear
							placeholder={
								<span className="text-[13px]">
									<FiFilter className="inline mr-1" /> Status
								</span>
							}
							className="flex-1 [&_.ant-select-selector]:rounded [&_.ant-select-selection-item]:text-[12px]"
							maxTagCount="responsive"
							onChange={(val) => handleFilterChange("status", val)}
							options={statusOptions}
							value={params?.status}
						/>
					</div>
				</div>

				<div className="flex justify-end items-center gap-2 text-[12px] text-slate-500 font-medium">
					<span>Sort:</span>
					<Select
						size="small"
						value={params.sortBy}
						onChange={(val) => handleFilterChange("sortBy", val)}
						className="w-28 [&_.ant-select-selector]:rounded-sm"
					>
						<Option value="timestamp">Timestamp</Option>
						<Option value="severity">Severity</Option>
					</Select>
					<Select
						size="small"
						value={params.sortOrder}
						onChange={(val) => handleFilterChange("sortOrder", val)}
						className="w-20 [&_.ant-select-selector]:rounded-sm"
					>
						<Option value="desc">
							Desc <FiArrowDown className="inline text-[10px]" />
						</Option>
						<Option value="asc">
							Asc <FiArrowUp className="inline text-[10px]" />
						</Option>
					</Select>
				</div>
			</div>

			{/* High-Density Data List */}
			<div className="flex flex-col border border-slate-200 rounded-md bg-white">
				{/* List Header (Desktop Only) */}
				<div className="hidden lg:flex items-center px-4 py-2 bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
					<div className="w-24 shrink-0">Severity</div>
					<div className="flex-1 min-w-0 pr-4">Alert Details</div>
					<div className="w-48 shrink-0">Affected Asset</div>
					<div className="w-36 shrink-0">Status</div>
					<div className="w-28 shrink-0">Detected</div>
					<div className="w-10 shrink-0"></div>
				</div>

				{info?.loading ? (
					<div className="flex items-center justify-center h-40 text-[13px] text-slate-500">
						<FiRefreshCw className="animate-spin mr-2" /> Fetching latest
						events...
					</div>
				) : info?.data?.length === 0 ? (
					<div className="flex flex-col items-center justify-center h-40 text-slate-400">
						<span className="text-[13px] font-medium">
							No alerts match the current filters.
						</span>
					</div>
				) : (
					<div className="flex flex-col divide-y divide-slate-100">
						{info?.data?.map((alert) => {
							const sevStyle = getSeverityStyles(alert.severity);
							return (
								<Link
									href={`/dashboard/alerts/${alert._id}`}
									key={alert._id}
									className={`flex flex-col lg:flex-row lg:items-center px-4 py-3 bg-white hover:bg-slate-50 border-l-[3px] transition-colors cursor-pointer group ${sevStyle.border}`}
								>
									{/* 1. Severity */}
									<div className="flex items-center w-full lg:w-24 shrink-0 mb-2 lg:mb-0">
										<div
											className={`w-2 h-2 rounded-full ${sevStyle.dot} mr-2`}
										></div>
										<span
											className={`text-[12px] font-bold uppercase tracking-wider ${sevStyle.text}`}
										>
											{alert.severity}
										</span>
									</div>

									{/* 2. Title, Category & Description */}
									<div className="flex flex-col flex-1 min-w-0 mb-3 lg:mb-0 pr-6">
										<span className="text-[14px] font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
											{alert.title}
										</span>
										<div className="flex items-center gap-2 mt-0.5">
											<span className="text-[12px] text-slate-500 capitalize shrink-0">
												{alert.category?.replace(/_/g, " ")} • src:{" "}
												{alert.source}
											</span>
										</div>
										{/* Muted Description added here */}
										<span className="text-[11px] text-slate-400 truncate mt-1 max-w-full">
											{alert.description || "No further details provided."}
										</span>
									</div>

									{/* 3. Asset (Monospace) */}
									<div className="flex items-center w-full lg:w-48 shrink-0 mb-2 lg:mb-0 pr-4">
										<span className="flex items-center gap-1.5 font-mono text-[12px] text-slate-700 bg-slate-100/80 px-2 py-0.5 rounded border border-slate-200 truncate max-w-full">
											<FiTerminal
												className="text-slate-400 shrink-0"
												size={10}
											/>
											<span className="truncate">{alert.affected_asset}</span>
										</span>
									</div>

									{/* 4. Status & Assignee */}
									<div className="flex flex-col items-start w-full lg:w-36 shrink-0 mb-2 lg:mb-0 pr-4">
										<Tag
											color={getStatusColor(alert.status)}
											className="m-0 text-[11px] font-medium uppercase tracking-wide border-0 px-2"
										>
											{alert.status?.replace(/_/g, " ")}
										</Tag>
										{/* Assignee display added here */}
										{alert.assignee ? (
											<div className="flex items-center mt-1 text-[11px] text-slate-500 max-w-full truncate">
												<FiUser className="mr-1 shrink-0" size={10} />
												<span className="truncate">
													{alert.assignee.name ||
														alert.assignee.email ||
														"Assigned"}
												</span>
											</div>
										) : (
											<span className="text-[10px] text-slate-400 mt-1 italic">
												Unassigned
											</span>
										)}
									</div>

									{/* 5. Timestamp (Using moment) */}
									<div className="flex items-start w-full lg:w-32 shrink-0 text-[12px] text-slate-500 font-medium">
										<FiClock className="mr-1.5 mt-0.5 shrink-0 opacity-70" />
										<div className="flex flex-col min-w-0">
											<span className="truncate text-slate-700">
												{moment(alert.timestamp).fromNow()}
											</span>
											<span className="text-[10px] text-slate-400 truncate">
												{moment(alert.timestamp).format("MMM D, HH:mm:ss")}
											</span>
										</div>
									</div>

									{/* 6. Action Arrow */}
									<div className="hidden lg:flex justify-end w-10 shrink-0 text-slate-300 group-hover:text-blue-500">
										<FiChevronRight size={18} />
									</div>
								</Link>
							);
						})}
					</div>
				)}
			</div>

			{/* Pagination */}
			{info?.totalRecords > 0 && (
				<div className="flex justify-between items-center py-2 px-1 mb-4">
					<span className="hidden sm:block text-[13px] text-slate-500 font-medium">
						Displaying{" "}
						{Math.min((params.page - 1) * params.limit + 1, info.totalRecords)}{" "}
						- {Math.min(params.page * params.limit, info.totalRecords)} of{" "}
						{info.totalRecords}
					</span>
					<Pagination
						current={params.page}
						pageSize={params.limit}
						total={info?.totalRecords}
						onChange={handlePageChange}
						showSizeChanger={true}
					/>
				</div>
			)}
		</div>
	);
};

export default AlertList;

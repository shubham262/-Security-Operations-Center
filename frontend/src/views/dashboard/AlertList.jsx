/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Table, Input, Select, Button, Tag, Space, Card, Dropdown } from "antd";
import {
	FiSearch,
	FiRefreshCw,
	FiChevronRight,
	FiServer,
	FiShield,
	FiFilter,
	FiArrowDown,
	FiArrowUp,
} from "react-icons/fi";
import Link from "next/link";
import { fetchAllAlerts } from "@/service/alerts";
import { refresh } from "next/cache";
import {
	categoryOptions,
	severityOptions,
	statusOptions,
	severityStyles,
	statusStyles,
} from "@/helper/constant";

const { Option } = Select;

const AlertList = () => {
	const [info, setInfo] = useState({
		loading: true,
		refreshLoading: false,
		totalRecords: 0,
		data: null,
	});

	const [params, setParams] = useState({
		page: 1,
		limit: 10,
		search: "",
		severity: [],
		status: [],
		category: [],
		sortBy: "timestamp",
		sortOrder: "desc",
	});

	useEffect(() => {
		getAllAlerts();
	}, [params]);

	const getAllAlerts = useCallback(async () => {
		try {
			if (info?.refreshLoading) {
				return;
			}
			setInfo((prev) => ({ ...prev, loading: true, refreshLoading: true }));
			const paramsPayload = {
				...params,
			};
			const { data = [], meta = {} } = await fetchAllAlerts(paramsPayload);
			setInfo((prev) => ({
				...prev,
				data,
				totalRecords: meta?.total,
				refreshLoading: false,
			}));
		} catch (error) {
		} finally {
			setInfo((prev) => ({
				...prev,
				loading: false,
				refreshLoading: false,
			}));
		}
	}, [params]);

	const handleFilterChange = (key, value) => {
		setParams((prev) => ({ ...prev, [key]: value, page: 1 }));
	};

	const handleTableChange = (pagination) => {
		setParams((prev) => ({
			...prev,
			page: pagination.current,
			limit: pagination.pageSize,
		}));
	};

	const columns = [
		{
			title: "Severity",
			dataIndex: "severity",
			key: "severity",
			width: 100,
			render: (sev) => (
				<Tag
					color={severityStyles[sev]?.color}
					className="m-0 text-xs font-semibold border-0 px-2 py-0.5 rounded shadow-sm"
				>
					{severityStyles[sev]?.label}
				</Tag>
			),
		},
		{
			title: "Alert Details",
			key: "details",
			width: 250,
			render: (_, record) => (
				<div className="flex flex-col">
					<span className="font-medium text-gray-900">{record.title}</span>
					<span className="text-xs text-gray-500 capitalize">
						{record.category.replace(/_/g, " ")}
					</span>
				</div>
			),
		},
		{
			title: "Affected Asset",
			dataIndex: "affected_asset",
			key: "asset",
			width: 200,
			render: (asset) => (
				<div className="flex items-center text-sm text-gray-600">
					<FiServer className="mr-2 opacity-60" />
					<span className="truncate">{asset}</span>
				</div>
			),
		},
		{
			title: "Source",
			dataIndex: "source",
			key: "source",
			width: 140,
			render: (src) => <span className="text-sm text-gray-500">{src}</span>,
		},
		{
			title: "Status",
			dataIndex: "status",
			key: "status",
			width: 130,
			render: (status) => (
				<Tag
					color={statusStyles[status]}
					className="capitalize m-0 font-medium"
				>
					{status.replace(/_/g, " ")}
				</Tag>
			),
		},
		{
			title: "Detected",
			dataIndex: "timestamp",
			key: "timestamp",
			width: 130,
			render: (ts) => (
				<span className="text-sm text-gray-500 whitespace-nowrap">{ts}</span>
			),
		},
		{
			title: "",
			key: "action",
			width: 60,
			fixed: "right", // Keeps the arrow visible when scrolling horizontally
			align: "center",
			render: (_, record) => (
				<Link href={`/dashboard/alerts/${record._id}`}>
					<Button
						type="text"
						icon={
							<FiChevronRight
								className="text-gray-400 hover:text-blue-600"
								size={18}
							/>
						}
					/>
				</Link>
			),
		},
	];

	return (
		<div className="flex flex-col gap-6 max-w-[100vw]">
			<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
				<div>
					<h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2 m-0">
						<FiShield className="text-blue-600" /> Triage Queue
					</h1>
					<p className="text-gray-500 text-sm mt-1 mb-0">
						Investigate and respond to security events.
					</p>
				</div>
				<Button
					icon={
						<FiRefreshCw
							className={info?.refreshLoading ? "animate-spin" : ""}
						/>
					}
					onClick={getAllAlerts}
				>
					Refresh
				</Button>
			</div>

			{/* Comprehensive Filter Bar - Clean Enterprise Look */}
			<Card
				className="shadow-sm border-gray-200"
				styles={{ body: { padding: "16px" } }}
			>
				<div className="flex flex-col gap-4">
					<div className="flex flex-col md:flex-row gap-4 justify-between">
						<Input
							size="middle"
							placeholder="Search title or asset..."
							prefix={<FiSearch className="text-gray-400" />}
							className="md:max-w-md"
							allowClear
							value={params.search}
							onChange={(e) => handleFilterChange("search", e.target.value)}
						/>

						<Space className="w-full md:w-auto flex-wrap">
							<span className="text-sm text-gray-500">Sort by:</span>
							<Select
								size="middle"
								value={params.sortBy}
								onChange={(val) => handleFilterChange("sortBy", val)}
								className="w-32"
							>
								<Option value="timestamp">Timestamp</Option>
								<Option value="severity">Severity</Option>
							</Select>
							<Select
								size="middle"
								value={params.sortOrder}
								onChange={(val) => handleFilterChange("sortOrder", val)}
								className="w-24"
							>
								<Option value="desc">
									Desc <FiArrowDown className="inline text-xs ml-1" />
								</Option>
								<Option value="asc">
									Asc <FiArrowUp className="inline text-xs ml-1" />
								</Option>
							</Select>
						</Space>
					</div>

					{/* Bottom Row: Multi-Select Filters */}
					<div className="flex flex-col md:flex-row gap-4">
						<Select
							mode="multiple"
							allowClear
							placeholder="All Severities"
							className="flex-1 min-w-[150px]"
							maxTagCount="responsive"
							onChange={(val) => handleFilterChange("severity", val)}
							options={severityOptions}
						/>
						<Select
							mode="multiple"
							allowClear
							placeholder="All Categories"
							className="flex-1 min-w-[150px]"
							maxTagCount="responsive"
							onChange={(val) => handleFilterChange("category", val)}
							options={categoryOptions}
						/>
						<Select
							mode="multiple"
							allowClear
							placeholder="All Statuses"
							className="flex-1 min-w-[150px]"
							maxTagCount="responsive"
							onChange={(val) => handleFilterChange("status", val)}
							options={statusOptions}
						/>
					</div>
				</div>
			</Card>

			<div className="bg-white border border-gray-200 rounded-xl shadow-sm">
				<Table
					columns={columns}
					dataSource={info?.data}
					loading={info?.loading}
					onChange={handleTableChange}
					pagination={{
						current: params.page,
						pageSize: params.limit,
						total: info?.totalRecords,
						showSizeChanger: true,
						showTotal: (total) => `Total ${total} alerts`,
						className: "px-4 pb-4 mt-4",
					}}
					rowKey={"_id"}
					scroll={{ x: 1000 }}
					rowClassName="cursor-pointer hover:bg-slate-50 transition-colors"
					size="middle"
				/>
			</div>
		</div>
	);
};

export default AlertList;

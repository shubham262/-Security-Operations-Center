/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/immutability */
"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
	Button,
	Tag,
	Select,
	Card,
	Space,
	Breadcrumb,
	Divider,
	message,
	Spin,
	Empty,
	Tooltip,
} from "antd";
import {
	FiArrowLeft,
	FiShield,
	FiClock,
	FiServer,
	FiTerminal,
	FiUser,
	FiCheckCircle,
	FiXCircle,
	FiActivity,
} from "react-icons/fi";
import Link from "next/link";
import moment from "moment";
import { fetchAlertInformation, updateAlert } from "@/service/alerts";
import {
	severityOptions,
	statusOptions,
	severityStyles,
	statusStyles,
} from "@/helper/constant";

const AlertDetails = () => {
	const params = useParams();
	const router = useRouter();
	const { id } = params;

	// Maintain unified state as requested
	const [info, setInfo] = useState({
		loading: true,
		data: null,
		updating: false,
	});

	useEffect(() => {
		fetchAlertInfo();
	}, []);

	const fetchAlertInfo = useCallback(async () => {
		try {
			setInfo((prev) => ({ ...prev, loading: true }));
			const { data } = await fetchAlertInformation(id);
			setInfo((prev) => ({ ...prev, data }));
		} catch (error) {
			message.error(error.message || "Failed to load alert details");
		} finally {
			setInfo((prev) => ({ ...prev, loading: false }));
		}
	}, [id]);

	const handleUpdate = async (key, value) => {
		setInfo((prev) => ({ ...prev, updating: true }));
		try {
			console.log(`Payload to update: { ${key}: ${value} }`);
			await updateAlert(id, { [key]: value });

			setInfo((prev) => ({
				...prev,
				data: { ...prev.data, [key]: value },
			}));
			message.success(`Alert ${key} updated successfully`);
		} catch (error) {
			message.error("Failed to update alert");
		} finally {
			setInfo((prev) => ({ ...prev, updating: false }));
		}
	};

	if (info.loading) {
		return (
			<div className="flex flex-col items-center justify-center h-[60vh] gap-4">
				<Spin size="large" />
				<span className="text-slate-500 font-medium animate-pulse">
					Gathering incident evidence...
				</span>
			</div>
		);
	}

	if (!info.data) {
		return (
			<div className="flex flex-col items-center mt-20">
				<Empty description="No alert record found" />
				<Link href="/dashboard/alerts">
					<Button type="primary" className="mt-4">
						Back to Queue
					</Button>
				</Link>
			</div>
		);
	}

	const alert = info.data;

	return (
		<div className="flex flex-col gap-6 max-w-[1400px] mx-auto pb-10">
			{/* 1. Header & Quick Actions */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
				<div className="flex flex-col gap-2">
					<Breadcrumb
						className="text-[12px] font-medium"
						items={[
							{
								title: (
									<Link href="/dashboard/overview" className="text-slate-400">
										Overview
									</Link>
								),
							},
							{
								title: (
									<Link href="/dashboard/alerts" className="text-slate-400">
										Alerts
									</Link>
								),
							},
							{
								title: (
									<span className="text-slate-900 font-mono">{alert._id}</span>
								),
							},
						]}
					/>
					<div className="flex items-center gap-3">
						<Button
							type="text"
							icon={<FiArrowLeft />}
							onClick={() => router.back()}
							className="hover:bg-slate-100"
						/>
						<h1 className="text-xl font-bold text-slate-900 m-0 tracking-tight">
							{alert.title}
						</h1>
					</div>
				</div>

				<Space size="middle">
					<Button
						icon={<FiXCircle />}
						onClick={() => handleUpdate("status", "false_positive")}
						disabled={info.updating}
					>
						False Positive
					</Button>
					<Button
						type="primary"
						icon={<FiCheckCircle />}
						className="bg-blue-600 hover:!bg-blue-700 border-none flex items-center gap-2 font-medium"
						onClick={() => handleUpdate("status", "resolved")}
						loading={info.updating}
					>
						Resolve Alert
					</Button>
				</Space>
			</div>

			{/* 2. Main Content Layout (8/4 Grid) */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
				{/* Left Side: Technical Evidence */}
				<div className="lg:col-span-8 flex flex-col gap-6">
					{/* Narrative/Description */}
					<Card
						title={
							<div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-slate-500">
								<FiActivity /> Incident Narrative
							</div>
						}
						className="shadow-sm border-slate-200"
					>
						<p className="text-[14px] leading-relaxed text-slate-700 whitespace-pre-wrap m-0">
							{alert.description || "No narrative provided for this incident."}
						</p>
					</Card>

					{/* Raw Event Data (The Technical Core) */}
					<Card
						title={
							<div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-slate-500">
								<FiTerminal /> Raw JSON Evidence
							</div>
						}
						className="shadow-sm border-slate-200 overflow-hidden"
						styles={{ body: { padding: 0 } }}
					>
						<div className="bg-[#0f172a] p-5 max-h-[500px] overflow-auto custom-scrollbar">
							<pre className="text-emerald-400 font-mono text-[13px] leading-relaxed m-0">
								{JSON.stringify(alert.raw_event || {}, null, 2)}
							</pre>
						</div>
					</Card>
				</div>

				{/* Right Side: Triage Metadata & Controls */}
				<div className="lg:col-span-4 flex flex-col gap-6">
					{/* Control Panel */}
					<Card className="shadow-sm border-slate-200 sticky top-6">
						<h3 className="text-[12px] font-bold uppercase tracking-wider text-slate-500 mb-6">
							Investigation Metadata
						</h3>

						<div className="flex flex-col gap-6">
							{/* Editable Selects */}
							<div className="space-y-4">
								<div>
									<label className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5 ml-1">
										Current Status
									</label>
									<Select
										className="w-full"
										size="large"
										value={alert.status}
										loading={info.updating}
										onChange={(val) => handleUpdate("status", val)}
										options={statusOptions}
									/>
								</div>
								<div>
									<label className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5 ml-1">
										Urgency / Severity
									</label>
									<Select
										className="w-full"
										size="large"
										value={alert.severity}
										loading={info.updating}
										onChange={(val) => handleUpdate("severity", val)}
										options={severityOptions}
									/>
								</div>
							</div>

							<Divider className="my-2" />

							{/* Immutable Metadata */}
							<div className="space-y-4">
								<div className="flex justify-between items-center group">
									<span className="text-slate-500 text-[13px] font-medium flex items-center gap-2">
										<FiShield size={14} /> Category
									</span>
									<Tag
										color="blue"
										className="m-0 border-0 bg-blue-50 text-blue-600 font-semibold px-2 py-0.5 rounded uppercase text-[10px]"
									>
										{alert.category?.replace(/_/g, " ")}
									</Tag>
								</div>

								<div className="flex justify-between items-center">
									<span className="text-slate-500 text-[13px] font-medium flex items-center gap-2">
										<FiServer size={14} /> Asset ID
									</span>
									<span className="font-mono text-[12px] text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 max-w-[180px] truncate">
										{alert.affected_asset}
									</span>
								</div>

								<div className="flex justify-between items-center">
									<span className="text-slate-500 text-[13px] font-medium flex items-center gap-2">
										<FiTerminal size={14} /> Log Source
									</span>
									<span className="text-[13px] font-semibold text-slate-700">
										{alert.source}
									</span>
								</div>

								<div className="flex justify-between items-start">
									<span className="text-slate-500 text-[13px] font-medium flex items-center gap-2 mt-1">
										<FiClock size={14} /> Timeline
									</span>
									<div className="text-right">
										<div className="text-[13px] font-bold text-slate-900">
											{moment(alert.timestamp).fromNow()}
										</div>
										<div className="text-[11px] text-slate-400 mt-0.5 font-medium">
											{moment(alert.timestamp).format(
												"MMM DD, YYYY • HH:mm:ss"
											)}
										</div>
									</div>
								</div>

								<div className="flex justify-between items-center">
									<span className="text-slate-500 text-[13px] font-medium flex items-center gap-2">
										<FiUser size={14} /> Assignee
									</span>
									<span className="text-[13px] font-semibold text-slate-700 flex items-center gap-2">
										{alert.assignee?.name || "Unassigned"}
									</span>
								</div>
							</div>
						</div>
					</Card>

					{/* Bottom Utility Card */}
					<div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
						<div className="flex gap-3">
							<FiActivity className="text-blue-500 mt-1 shrink-0" />
							<div>
								<h4 className="text-[12px] font-bold text-slate-800 mb-1">
									Analyst Note
								</h4>
								<p className="text-[11px] text-slate-500 leading-normal m-0">
									Changing severity will trigger a notification to the system
									administrator. Ensure all findings are documented in the
									narrative before resolving.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AlertDetails;

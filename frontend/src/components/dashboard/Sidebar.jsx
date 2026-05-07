import Link from "next/link";
import React from "react";
import { FiShield, FiActivity, FiList, FiLogOut } from "react-icons/fi";
const SidebarContent = ({ pathname, handleLogout, onLinkClick }) => {
	const navLinks = [
		{ href: "/dashboard/overview", icon: FiActivity, label: "Dashboard" },
		{ href: "/dashboard/alerts", icon: FiList, label: "Alerts Queue" },
	];

	return (
		<div className="flex flex-col h-full bg-white">
			{/* Logo Area */}
			<div className="flex items-center space-x-2 px-6 py-6 border-b border-gray-50">
				<FiShield size={28} className="text-blue-600" />
				<span className="text-xl font-bold tracking-tight text-gray-900">
					SOC<span className="text-blue-600">Triage</span>
				</span>
			</div>

			{/* Navigation Links */}
			<div className="flex-1 px-4 py-4 overflow-y-auto space-y-1 mt-2">
				{navLinks.map((link) => {
					const isActive = pathname?.includes(link.href);
					const Icon = link.icon;
					return (
						<Link
							key={link.href}
							href={link.href}
							onClick={onLinkClick}
							className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors font-medium ${
								isActive
									? "bg-blue-50 text-blue-600"
									: "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
							}`}
						>
							<Icon size={20} />
							<span>{link.label}</span>
						</Link>
					);
				})}
			</div>

			{/* Logout Area */}
			<div className="p-4 border-t border-gray-100">
				<button
					onClick={handleLogout}
					className="flex items-center space-x-3 px-4 py-3 w-full text-left text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors font-medium"
				>
					<FiLogOut size={20} />
					<span>Sign Out</span>
				</button>
			</div>
		</div>
	);
};

export default SidebarContent;

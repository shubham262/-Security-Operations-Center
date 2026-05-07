import Link from "next/link";
import React, { useCallback } from "react";
import { FiActivity, FiList, FiLogOut } from "react-icons/fi";
import Logo from "../Logo";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/config/auth";
const navLinks = [
	{ href: "/dashboard/overview", icon: FiActivity, label: "Dashboard" },
	{ href: "/dashboard/alerts", icon: FiList, label: "Alerts " },
];
const SidebarContent = ({}) => {
	const pathname = usePathname();
	const router = useRouter();
	const handleLogout = useCallback(async () => {
		await authClient.signOut();
		localStorage.clear();
		router.push(`/`);
	}, [router]);

	return (
		<div className="flex flex-col h-full bg-white">
			<div className="flex items-center space-x-2 px-6 py-4.5 border-b border-gray-50">
				<Logo />
			</div>

			<div className="flex-1 px-4 py-4 overflow-y-auto space-y-1 mt-2">
				{navLinks.map((link) => {
					const isActive = pathname?.includes(link.href);
					const Icon = link.icon;
					return (
						<Link
							key={link.href}
							href={link.href}
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

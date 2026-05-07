import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback } from "react";
import { FiShield } from "react-icons/fi";

const Logo = () => {
	return (
		<Link
			href="/"
			className="flex items-center space-x-2 text-blue-600  hover:opacity-80 transition-opacity"
		>
			<FiShield size={28} />
			<span className="text-xl font-bold tracking-tight text-gray-900">
				SOC<span className="text-blue-600">Triage</span>
			</span>
		</Link>
	);
};

export default Logo;

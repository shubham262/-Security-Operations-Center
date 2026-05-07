import { useRouter } from "next/navigation";
import React, { useCallback } from "react";
import { FiShield } from "react-icons/fi";

const Logo = () => {
	const router = useRouter();
	const handleClick = useCallback(() => {
		return router.push("/");
	}, [router]);
	return (
		<div
			className="flex items-center space-x-2 text-blue-600"
			onClick={handleClick}
		>
			<FiShield size={28} />
			<span className="text-xl font-bold tracking-tight text-gray-900">
				SOC<span className="text-blue-600">Triage</span>
			</span>
		</div>
	);
};

export default Logo;

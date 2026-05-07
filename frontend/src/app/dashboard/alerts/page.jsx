import AlertList from "@/views/dashboard/AlertList";
import { Spin } from "antd";
import { Suspense } from "react";

export const metadata = {
	title: "Alert List",
	description: "Find all your alerts",
};

export default function Home() {
	return (
		<Suspense
			fallback={
				<div className="flex flex-col gap-5 max-w-[100vw] font-sans antialiased text-slate-800">
					<Spin />
				</div>
			}
		>
			<AlertList />
		</Suspense>
	);
}

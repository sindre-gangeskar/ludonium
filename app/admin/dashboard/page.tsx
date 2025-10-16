import DashboardData from "@/components/admin/DashboardData";
import Loader from "@/components/ui/Loader";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = { title: "Admin Dashboard" };
export default function Page() {
	return (
		<Suspense fallback={<Loader />}>
			<DashboardData />
		</Suspense>
	);
}

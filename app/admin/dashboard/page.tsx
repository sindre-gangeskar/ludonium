import DashboardData from "@/components/admin/DashboardData";
import Loader from "@/components/ui/Loader";
import { Suspense } from "react";

export default function Page() {
	return (
		<Suspense fallback={<Loader/>}>
			<DashboardData />
		</Suspense>
	);
}

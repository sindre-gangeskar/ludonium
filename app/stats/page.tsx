import { DonationsData } from "@/components/stats/DonationsData";
import Loader from "@/components/ui/Loader";
import { Suspense } from "react";

export default function Page() {
	return (
		<Suspense fallback={<Loader />}>
			<DonationsData />
		</Suspense>
	);
}

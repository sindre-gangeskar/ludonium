import { DonationsData } from "@/components/stats/DonationsData";
import { Typography } from "@mui/joy";
import { Suspense } from "react";

export default function Page() {
	return (
		<Suspense
			fallback={
				<Typography level="h3" textAlign={"center"}>
					Fetching data...
				</Typography>
			}>
			<DonationsData />
		</Suspense>
	);
}

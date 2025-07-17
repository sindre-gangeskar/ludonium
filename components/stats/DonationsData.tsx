import { getDonations } from "@/app/stats/actions";
import { auth } from "@/auth";
import DonationsDisplay from "./DonationsDisplay";
import { DonationProps } from "@/lib/definitions";
import { Typography } from "@mui/joy";
export async function DonationsData() {
	const session = await auth();
	if (session && session.user && session.user.id) {
		const donations = (await getDonations(session?.user?.id)) as DonationProps[];
		return <DonationsDisplay donations={donations}></DonationsDisplay>;
	} else return <Typography>No donations available</Typography>;
}

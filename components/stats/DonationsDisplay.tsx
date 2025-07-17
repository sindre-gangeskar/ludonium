"use client";
import { DonationProps } from "@/lib/definitions";
import { Stack, Typography } from "@mui/joy";
import DonationStat from "./DonationStat";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
export default function DonationsDisplay({ donations }: { donations: DonationProps[] }) {
	const pcDonations = donations.filter(donation => donation.platformType === "pc");
	const consoleDonations = donations.filter(donation => donation.platformType === "console");
	const pcFiltered = filterDonations(pcDonations);
	const consoleFiltered = filterDonations(consoleDonations);

	useGSAP(() => {
		gsap.set(" #title, #donations-stack > *", { opacity: 0, y: -50 });
		gsap.to("#title, #donations-stack > *", { opacity: 1, y: 0, duration: 1.5, ease: "back.out", stagger: 0.3 });
	});

	return (
		<>
			<Typography id="title" variant="plain" textAlign={"center"} level="h1" sx={{ p: 2, mt: 10, mx: "auto" }}>
				Donation Stats
			</Typography>
			<Stack id="donations-stack" direction={"row"} gap={2} sx={{ width: "sm", mx: "auto", maxWidth: 'md' }}>
				<DonationStat name="PC" donations={pcFiltered} />
				<DonationStat name="Console" donations={consoleFiltered} />
			</Stack>
		</>
	);
}

function filterDonations(donations: DonationProps[]) {
	const data: { [key: string]: number } = {};
	donations.forEach(donation => {
		const platformName = donation?.platform;

		if (data[platformName]) data[platformName] += 1;
		else data[platformName] = 1;
	});

	console.log(data);
	return data;
}

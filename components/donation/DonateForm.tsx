"use client";
import { Card, CardContent, Typography } from "@mui/joy";
import { useSession } from "next-auth/react";

export default function DonateForm() {
	const { status } = useSession();

	return status === "authenticated" ? (
		<Card variant="soft" sx={{ maxWidth: 500, mx: "auto" }}>
			<CardContent>
				<Typography>Donation form here</Typography>
			</CardContent>
		</Card>
	) : null;
}

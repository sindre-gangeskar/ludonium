"use client";
import { Card, CardContent, CardActions, Button } from "@mui/joy";
import { useSession } from "next-auth/react";

export default function DonateForm() {
	const { status } = useSession();

	return status === "authenticated" ? (
		<Card variant="soft" sx={{ maxWidth: 500, mx: "auto" }}>
			<CardContent>
				<CardContent></CardContent>
				<CardActions>
					<Button>Submit</Button>
				</CardActions>
			</CardContent>
		</Card>
	) : null;
}

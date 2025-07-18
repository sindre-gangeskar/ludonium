"use client";
import { useGSAP } from "@gsap/react";
import { Card, CardContent, Typography } from "@mui/joy";
import gsap from "gsap";
export default function FormError() {
	useGSAP(() => {
		gsap.set("#thank-you", { opacity: 0, y: -80 });
		gsap.to("#thank-you", { opacity: 1, y: 0, duration: 1.2, ease: "back.out" });
	});
	return (
		<Card id="thank-you" color="danger" variant="solid" invertedColors sx={{ maxWidth: "md", mx: "auto", my: 5 }}>
			<CardContent>
				<Typography level="h3">Uh oh! An unexpected error has occurred!</Typography>
				<Typography level="title-md">Please contact the moderators or admins of the server for help.</Typography>
			</CardContent>
		</Card>
	);
}

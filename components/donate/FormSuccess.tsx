"use client";
import { useGSAP } from "@gsap/react";
import { Button, Card, CardActions, CardContent, Typography } from "@mui/joy";
import Link from "next/link";
import gsap from "gsap";
import { MouseEventHandler } from "react";
export default function FormSuccess({ onClick }: { onClick: MouseEventHandler<HTMLAnchorElement> }) {
	useGSAP(() => {
		gsap.set("#thank-you", { opacity: 0, y: -80 });
		gsap.to("#thank-you", { opacity: 1, y: 0, duration: 1.2, ease: "back.out" });
	});
	return (
	<Card size="lg" id="thank-you" color="neutral" variant="soft" sx={{ maxWidth: "md", mx: "auto", my: 5 }}>
		<CardContent>
			<Typography level="h3">Thank you so much!</Typography>
			<Typography level="title-md">This generous donation does not go unnoticed.</Typography>
			<Typography color="warning" level="title-sm">
				The donation is awaiting approval by a moderator.
			</Typography>
		</CardContent>
		<CardActions sx={{ justifyContent: "center" }}>
			<Button onClick={onClick} variant="solid" color="primary">
				Donate a game
			</Button>
			<Button component={Link} href="/stats" variant="solid" color="secondary">
				View donation stats
			</Button>
		</CardActions>
	</Card>
);
}

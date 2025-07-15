"use client";
import { useGSAP } from "@gsap/react";
import { Button, Card, CardActions, CardContent, Typography } from "@mui/joy";
import Link from "next/link";
import gsap from 'gsap';
export default function DonationSuccess() {
 
  useGSAP(() => {
    gsap.set('#thank-you', { opacity: 0, y: -80 });
    gsap.to('#thank-you', { opacity: 1, y: 0, duration: 1.2, ease: 'back.out' })
    
  });
	return (
		<Card id="thank-you" color="primary" variant="solid" invertedColors sx={{ maxWidth: "md", mx: "auto", my: 5, }}>
			<CardContent>
				<Typography level="h3">Thank you so much!</Typography>
				<Typography level="title-md">This generous donation does not go unnoticed.</Typography>
			</CardContent>
			<CardActions sx={{ justifyContent: "center" }}>
				<Button variant="solid" color="success">
					Click here if you would like to donate another game
				</Button>
				<Button component={Link} href="/donations" variant="solid" color="primary">
					Click here to see your donations
				</Button>
			</CardActions>
		</Card>
	);
}

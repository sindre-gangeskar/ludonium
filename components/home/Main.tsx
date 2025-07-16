"use client";
import { Box, Stack, Typography, Button, Card, CardContent, CardActions } from "@mui/joy";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Login from "../auth/Login";
import { SxProps } from "@mui/joy/styles/types";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Tile from "./Tile";
export default function Main() {
	const { status } = useSession();
	const cardSx: SxProps = { backdropFilter: "blur(4px)" };

	useGSAP(() => {
		gsap.set("#title, .detail, #sub", { opacity: 0, y: -100 });
		gsap.to("#title, .detail, #sub", { opacity: 1, duration: 1.7, delay: 0, ease: "back.out", stagger: 0.1, y: 0 });
	});

	return (
		<Box component={"section"} sx={{ my: 2 }}>
			<Typography id="title" level="h1" textAlign={"center"} sx={{ my: 4 }}>
				Giving back to your own discord community
			</Typography>

			<Stack gap={3} direction={"row"} sx={{ maxWidth: "lg", mx: "auto", justifyContent: "center", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 0fr))" }}>
				<Tile className="detail" title="Donate Games" description="Donate your games back to your own Discord community." />
				<Tile className="detail" title="No Ghosting" description="Prevents players from taking keys and ghosting the donator." />
				<Tile className="detail" title="No Scraping" description="Using this system will help prevent bots from scraping the Discord server chat for keys." />
				<Tile className="detail" title="Giveaway" description="Gives everyone an equal chance at participating." />
				<Tile className="detail" title="Winning & Feedback" description="The winner receives the key via a DM from a bot and gets the option to provide feedback on the key's validity." />
				<Tile className="detail" title="Unique Role" description="Receive a unique role to showcase your generosity." />
			</Stack>

			<Stack id="sub" direction={"column"} sx={{ alignItems: "center", justifyContent: "center", mt: 2, my: 4 }}>
				{status == "authenticated" ? (
					<Card size="lg" variant="soft" color="neutral" sx={{ ...cardSx }}>
						<CardContent sx={{ px: 2 }}>
							<Typography level="title-md">If this sounds interesting, click on the button below to start the donation process!</Typography>
						</CardContent>
						<CardActions>
							<Button size="lg" sx={{ maxWidth: "fit-content", mx: "auto" }} variant="solid" color="secondary" component={Link} href="/donate">
								Take me to the donation page
							</Button>
						</CardActions>
					</Card>
				) : (
					<Login />
				)}
			</Stack>
		</Box>
	);
}

"use client";
import { Box, Stack, Typography, Button } from "@mui/joy";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Login from "../auth/Login";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Tile from "./Tile";
import Header from "../ui/Header";
export default function Main() {
	const { status } = useSession();

	useGSAP(() => {
		gsap.set("#title > *, .detail, #sub", { opacity: 0, y: -100 });
		gsap.set("#title > *, .detail, #sub", { filter: "blur(16px)" });
		gsap.to("#title > *, .detail, #sub", { filter: "blur(0px)", duration: 1.2, ease: "power4.out", stagger: 0.1 });
		gsap.to("#title > *, .detail, #sub", { opacity: 1, duration: 1.7, delay: 0, ease: "back.out", stagger: 0.1, y: 0 });
	});

	return (
		<Box component={"section"} sx={{ my: 2 }}>
			<Header id="title" title="Giving back to your own Discord community" description="Your generosity should never be taken for granted."></Header>
			<Stack gap={3} direction={"row"} sx={{ maxWidth: "lg", mx: "auto", justifyContent: "center", display: "grid", gridTemplateColumns: {xs: '', md: "repeat(auto-fit, minmax(500px, 0fr))" } }}>
				<Tile className="detail" title="Donate Games" description="Donate your games back to your own Discord community." />
				<Tile color="secondary" className="detail" title="No Ghosting" description="Prevents players from taking keys and ghosting the donator." />
				<Tile color="warning" className="detail" title="No Scraping" description="Using this system will help prevent bots from scraping the Discord server chat for keys." />
				<Tile color="neutral" className="detail" title="Giveaway" description="Gives everyone an equal chance at participating and winning." />
				<Tile color="success" className="detail" title="Winning & Feedback" description="The winner receives the key via a DM from a bot and gets the option to provide feedback on the key's validity." />
				<Tile color="danger" className="detail" title="Unique Role" description="Receive a unique role to showcase your generosity." />
			</Stack>
			<Stack id="sub" direction={"column"} sx={{ alignItems: "center", justifyContent: "center", mt: 2, my: 10 }}>
				{status == "authenticated" ? (
					<Stack gap={1}>
						<Typography level="title-md" sx={{ mx: "auto" }}>
							Click on the button below if you would like to make a donation.
						</Typography>
						<Button size="lg" sx={{ maxWidth: "fit-content", mx: "auto" }} variant="solid" color="primary" component={Link} href="/donate">
							Take me to the donation page
						</Button>
					</Stack>
				) : (
					<Login />
				)}
			</Stack>
		</Box>
	);
}

"use client";
import { Box, List, ListItem, Stack, Typography, Button, Card, CardContent, CardActions } from "@mui/joy";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Login from "../auth/Login";
import { SxProps } from "@mui/joy/styles/types";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
export default function Main() {
	const { status } = useSession();
	const cardSx: SxProps = { backdropFilter: "blur(4px)" };

	useGSAP(() => {
		gsap.set("#title, #hero, #sub", { opacity: 0, y: -100 });
		gsap.to('#title, #hero, #sub', {opacity: 1, duration: 1.7, delay: 0, ease: "back.out", stagger: 0.1, y: 0})
	});

	return (
		<Box component={"section"} sx={{ my: 2 }}>
			<Typography id="title" level="h1" textAlign={"center"} sx={{ my: 4 }}>
				Giving back to your own discord community
			</Typography>

			{/* Hero Card */}
			<Card id="hero" color="primary" invertedColors variant="solid" sx={{ maxWidth: "md", mx: "auto", gap: 0, ...cardSx, p: { xs: 0, md: 2 } }}>
				<Typography color="primary" variant="plain" level="h2" p={2} m={0} sx={{ borderRadius: "inherit", borderEndStartRadius: 0, borderEndEndRadius: 0, mb: 0, textAlign: { xs: "center", md: "inherit" } }}>
					How does it work?
				</Typography>
				<CardContent sx={{ p: 2 }}>
					<List marker="disc">
						<ListItem>
							<Typography level="title-sm">
								Give away game keys to the members of your discord community. By donating using this system you will give every member of the discord community a fair chance to win. 👑
							</Typography>
						</ListItem>
						<ListItem>
							<Typography level="title-sm">
								Once you have donated, a giveaway will be initiated on the discord server for each member to participate in. This prevents bots from scraping keys and members from redeeming and ghosting the donator.{" "}
								👻
							</Typography>
						</ListItem>
						<ListItem>
							<Typography level="title-sm">
								Receive a <strong>unique</strong> role as a donator in the server for the people in the community to recognize your generosity. 💝
							</Typography>
						</ListItem>
						<ListItem>
							<Typography level="title-sm">The giveaway itself will not reveal any information about the donator to maintain anonomity for each donation. 🎭</Typography>
						</ListItem>
					</List>
				</CardContent>
			</Card>

			<Stack id="sub" direction={"column"} sx={{ alignItems: "center", justifyContent: "center", mt: 2, my: 4 }}>
				{status == "authenticated" ? (
					<Card size="sm" variant="solid" invertedColors color="primary" sx={{ ...cardSx }}>
						<CardContent sx={{ px: 2 }}>
							<Typography level="title-sm">If this sounds interesting, click on the button below to start the donation process!</Typography>
						</CardContent>
						<CardActions>
							<Button variant="solid" component={Link} href="/donate">
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

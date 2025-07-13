"use client";
import { Box, List, ListItem, Stack, Typography, Button, Card, CardContent, CardActions } from "@mui/joy";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Login from "../auth/Login";
import { SxProps } from "@mui/joy/styles/types";

export default function Main() {
	const { status } = useSession();
	const cardSx: SxProps = { background: 'transparent', backdropFilter: 'blur(4px)' };
	return (
		<Box component={"section"}>
			<Stack justifyContent={"center"} direction={"column"}>
				<Typography level="h1" textAlign={"center"} sx={{ fontSize: "4rem" }}>
					Giving back to your own discord community
				</Typography>
			</Stack>
			<Card variant="outlined" sx={{ maxWidth: "md", p: 0, mx: "auto", my: 4, gap: 0, ...cardSx }}>
				<Typography
					color="primary"
					variant="solid"
					level="h1"
					p={2}
					m={0}
					sx={{ borderRadius: "inherit", borderEndStartRadius: 0, borderEndEndRadius: 0, textTransform: "uppercase", fontWeight: "900", mb: 0 }}>
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

			<Stack direction={"column"} sx={{ alignItems: "center", justifyContent: "center", mt: 2 }}>
				<Stack gap={2}>
					{status == "authenticated" ? (
						<>
							<Card variant="outlined" sx={{...cardSx}}>
								<CardContent sx={{px: 2}}>
									<Typography level="title-md">If this sounds interesting, click on the button below to start the donation process!</Typography>
								</CardContent>
								<CardActions>
									<Button size="lg" variant="solid" component={Link} href="/donate">
										Take me to the donation page
									</Button>
								</CardActions>
							</Card>
						</>
					) : (
						<Login />
					)}
				</Stack>
			</Stack>
		</Box>
	);
}

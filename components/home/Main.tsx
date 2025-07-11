"use client";
import { Box, List, ListItem, Stack, Typography, Button, Card, CardContent } from "@mui/joy";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Login from "../auth/Login";

export default function Main() {
	const { status } = useSession();
	return (
		<Box component={"section"}>
			<Stack justifyContent={"center"} direction={"column"}>
				<Typography level="h1" textAlign={"center"} sx={{ fontSize: "4rem" }}>
					Giving back to your own discord community
				</Typography>
			</Stack>
			<Card variant="plain" sx={{ maxWidth: "md", p: 0, mx: "auto", my: 4, gap: 0 }}>
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
							<Typography level="body-sm">
								Give away game keys to the members of your discord community. By donating using this system you will give every member of the discord community a fair chance to win.{" "}
							</Typography>
						</ListItem>
						<ListItem>
							<Typography level="body-sm">
								Once you have donated, a giveaway will be initiated on the discord server for each member to participate in. This prevents bots from scraping keys and members from redeeming and ghosting the donator.{" "}
							</Typography>
						</ListItem>
						<ListItem>
							<Typography level="body-sm">
								Receive a <strong>unique</strong> role as a donator in the server for the people in the community to recognize your generosity.
							</Typography>
						</ListItem>
						<ListItem>
							<Typography level="body-sm">The giveaway itself will not reveal any information about the donator to maintain anonomity for each donation.</Typography>
						</ListItem>
					</List>
				</CardContent>
			</Card>

			<Stack direction={"column"} sx={{ alignItems: "center", justifyContent: "center", mt: 2 }}>
				<Stack gap={2}>
					{status == "authenticated" ? (
						<>
							<Typography>If this sounds interesting, click on the button below to start the donation process!</Typography>
							<Button size="lg" variant="solid" component={Link} href="/donate">
								Take me to the donation page
							</Button>
						</>
					) : (
						<Login />
					)}
				</Stack>
			</Stack>
		</Box>
	);
}

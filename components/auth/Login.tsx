"use client";
import { Button, Card, CardActions, CardContent, List, ListItem, Typography } from "@mui/joy";
import { login } from "@/app/auth/actions";
import { useSession } from "next-auth/react";
export default function Login() {
	const { status } = useSession();
	return status === "unauthenticated" ? (
		<form action={login}>
			<Card variant="plain" color="primary" size="md" sx={{ width: "fit-content", mt: 5, maxWidth: "sm", background: 'transparent' }}>
				<Typography level="title-md">
					In order to donate, logging in via your <strong>Discord</strong> account is necessary. <br /> {"Here's why:"}
				</Typography>
				<CardContent>
					<List marker={"disc"}>
						<ListItem>
							<Typography level={"title-md"}>Ensure you are a part of the Discord server.</Typography>
						</ListItem>
						<ListItem>
							<Typography level={"title-md"}>Keep track of your donations and update your unique role in the server after a set amount of donations have been made.</Typography>
						</ListItem>
					</List>
				</CardContent>
				<CardActions>
					<Button size="lg" sx={{ mx: "auto", maxWidth: 'fit-content' }} type="submit" color="primary">
						Sign in via Discord{" "}
					</Button>
				</CardActions>
			</Card>
		</form>
	) : null;
}

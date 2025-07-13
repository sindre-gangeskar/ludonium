"use client";
import { Button, Card, CardActions, CardContent, List, ListItem, Typography } from "@mui/joy";
import { login } from "@/app/auth/actions";
import { useSession } from "next-auth/react";
export default function Login() {
	const { status } = useSession();

	return status === "unauthenticated" ? (
		<form action={login}>
			<Card sx={{ width: "fit-content", mt: 5, maxWidth: "sm", background: 'transparent', backdropFilter: 'blur(4px)'}}>
				<Typography>
					In order to donate, logging in via your <strong>Discord</strong> account is necessary. {"Here's why:"}
				</Typography>
				<CardContent>
					<List marker={"disc"}>
						<ListItem>
							<Typography>Ensure you are a part of the Discord server.</Typography>
						</ListItem>
						<ListItem>
							<Typography>Keep track of your donations and update your unique role in the server after a set amount of donations have been made.</Typography>
						</ListItem>
					</List>
				</CardContent>
				<CardActions>
					<Button size="lg" sx={{ mx: "auto", fontFamily: "var(--font-ginto-discord)" }} type="submit">
						Sign in via Discord{" "}
					</Button>
				</CardActions>
			</Card>
		</form>
	) : null;
}

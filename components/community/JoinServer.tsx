"use client";
import { Stack, Button, Typography } from "@mui/joy";
import { redirectToInviteLink } from "../../app/community/actions";
export default function JoinServer() {
	return (
	<Stack component={"form"} action={redirectToInviteLink} gap={2}>
		<Typography level="title-sm">{"It doesn't seem like you're a member of this server."}</Typography>
		<Button size="sm" sx={{maxWidth: 'fit-content', mx: 'auto'}} type="submit">Click here to join</Button>
	</Stack>
);
}

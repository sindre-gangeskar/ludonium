"use client";
import { Box, Button } from "@mui/joy";
import { login } from "@/app/auth/actions";
import { useSession } from "next-auth/react";
export default function Login() {
	const { status } = useSession();

	return status === "unauthenticated" ? (
		<form action={login}>
			<Box component={"div"} mx={"auto"} sx={{ width: "fit-content" }}>
				<Button type="submit">Sign in with Discord</Button>
			</Box>
		</form>
	) : null;
}

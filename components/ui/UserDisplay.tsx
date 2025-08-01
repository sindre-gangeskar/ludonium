"use client";

import { Skeleton, Avatar, Tooltip, Typography, Button, Stack } from "@mui/joy";
import { LogoutRounded } from "@mui/icons-material";
import { SxProps } from "@mui/joy/styles/types";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";
export default function UserDisplay({ status, data }: { status: "authenticated" | "unauthenticated" | "loading"; data: Session | null }) {
	const avatarSx: SxProps = { width: 50, height: 50 };
	const stackSx: SxProps = {gap: 1,  p: 0, px: 2, alignItems: "center", flexDirection: { xs: "column", md: "row" }, background: "transparent", flexShrink: 1 };
	if (status === "authenticated") {
		return (
			<Stack direction="row" sx={{ ...stackSx }}>
				<Avatar src={data?.user?.image ? data.user.image : ""} sx={{ ...avatarSx }} alt="profile"></Avatar>
				<Typography level="title-sm" sx={{ px: 1, display: { xs: "none", lg: "inherit" } }}>
					{data?.user?.name}
				</Typography>
				<form
					action={async () => {
						await signOut();
					}}>
					<Tooltip color="neutral" variant="soft" title={"Log out"} arrow={true}>
						<Button type="submit" color={"neutral"} variant="soft">
							<LogoutRounded />
						</Button>
					</Tooltip>
				</form>
			</Stack>
		);
	} else if (status === "loading") {
		return (
			<Stack direction={"row"} sx={{ ...stackSx }}>
				<Skeleton width={"inherit"} variant="circular" sx={{ ...avatarSx }}></Skeleton>
				<Skeleton sx={{ flex: 1 }} width={"fit-content"} variant="text"></Skeleton>
			</Stack>
		);
	}
}

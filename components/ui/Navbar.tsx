"use client";
import { Avatar, Box, Button, Card, Container, Skeleton, Stack, Typography, Tooltip } from "@mui/joy";
import ThemeToggler from "../theme/ThemeToggler";
import { signOut, useSession } from "next-auth/react";
import { SxProps } from "@mui/joy/styles/types";
import { LogoutRounded } from "@mui/icons-material";
import Link from "next/link";
export default function Navbar() {
	const { status, data } = useSession();

	const locations: { name: string; href: string }[] = [
		{ name: "Home", href: "/" },
		{ name: "Discord Community", href: "/community" },
		...(status === "authenticated" ? [{ name: "Donate", href: "/donate" }] : []),
	];

	const avatarSx: SxProps = { width: 50, height: 50 };
	const cardSx: SxProps = { minWidth: 200, height: 80, display: "flex", alignItems: "center", flexDirection: "row", background: "transparent" };

	return (
		<Box component={"nav"} sx={{ backdropFilter: "blur(4px)", background: "transparent", height: "80px", alignItems: "center", display: "flex" }}>
			<Container maxWidth={"lg"}>
				<Stack direction={"row"} sx={{ alignItems: "center", width: "100%", my: "auto", justifyContent: "space-between" }}>
					{status === "loading" && (
						<Card orientation="horizontal" color="primary" variant="plain" sx={{ ...cardSx }}>
							<Skeleton width={"inherit"} variant="circular" sx={{ ...avatarSx }}></Skeleton>
							<Skeleton sx={{ flex: 1 }} width={"fit-content"} variant="text"></Skeleton>
						</Card>
					)}
					{status === "authenticated" && (
						<>
							<Card orientation="horizontal" color="neutral" variant="plain" sx={{ ...cardSx }}>
								<Avatar src={data?.user?.image ? data.user.image : ""} sx={{ ...avatarSx }} alt="profile"></Avatar>
								<Typography>{data?.user?.name}</Typography>
								<form
									action={async () => {
										await signOut();
									}}>
									<Tooltip variant="soft" title={"Log out"} arrow={true}>
										<Button type="submit" color={"primary"} variant="solid" popover="auto">
											<LogoutRounded />
										</Button>
									</Tooltip>
								</form>
							</Card>
						</>
					)}

					<Stack direction={"row"} sx={{ position: "absolute", mx: "auto", left: "50%", transform: "translateX(-50%)" }}>
						{locations.map(item => (
							<Button variant="plain" color="neutral" size="lg" key={item.name} component={Link} href={item.href}>
								{item.name}
							</Button>
						))}
					</Stack>
					<ThemeToggler />
				</Stack>
			</Container>
		</Box>
	);
}

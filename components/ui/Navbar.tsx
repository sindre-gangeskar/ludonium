"use client";
import { Avatar, Box, Button, Card, Container, Dropdown, Menu, MenuButton, Skeleton, Stack, Typography } from "@mui/joy";
import ThemeToggler from "../theme/ThemeToggler";
import { signOut, useSession } from "next-auth/react";
import { SxProps } from "@mui/joy/styles/types";
import { LogoutRounded, Settings } from "@mui/icons-material";
export default function Navbar() {
	const { status, data } = useSession();

	const avatarSx: SxProps = { width: 50, height: 50 };
	const cardSx: SxProps = { minWidth: 200, height: 80, display: "flex", alignItems: "center", flexDirection: "row", background: 'transparent' };

	return (
		<Box component={"nav"}>
			<Container maxWidth={'xl'}>
				<Stack p={2} direction={"row"} sx={{alignItems: 'center'}}>
					{status === "loading" && (
						<Card color="primary" variant="plain" sx={{ ...cardSx }}>
							<Skeleton width={"inherit"} variant="circular" sx={{ ...avatarSx }}></Skeleton>
							<Skeleton sx={{ flex: 1 }} width={"fit-content"} variant="text"></Skeleton>
						</Card>
					)}

					{status === "authenticated" && (
						<>
							<Card color="neutral" variant="plain" sx={{ ...cardSx }}>
								<Avatar src={data?.user?.image ? data.user.image : ""} sx={{ ...avatarSx }} alt="profile"></Avatar>
								<Typography>{data?.user?.name}</Typography>

								<Dropdown>
									<MenuButton>
										<Settings />
									</MenuButton>
									<Menu variant="plain" placement="bottom" sx={{ borderRadius: "1rem", p: 1 }}>
										<form
											action={async () => {
												await signOut();
											}}>
											<Button type="submit" color={"neutral"} variant="plain" endDecorator={<LogoutRounded />}>
												Log out
											</Button>
										</form>
									</Menu>
								</Dropdown>
							</Card>
						</>
					)}

					<Box component={"span"} sx={{ ml: "auto" }}>
						<ThemeToggler />
					</Box>
				</Stack>
			</Container>
		</Box>
	);
}

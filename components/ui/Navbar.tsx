"use client";
import { Box, Button, Container, Stack, useColorScheme } from "@mui/joy";
import ThemeToggler from "../theme/ThemeToggler";
import { useSession } from "next-auth/react";
import Link from "next/link";
import UserDisplay from "./UserDisplay";
import { LocationProps } from "@/lib/definitions";
import NavCollapsedMenu from "./NavCollapsedMenu";
import { useState } from "react";
import { Menu } from "@mui/icons-material";
import { usePathname } from "next/navigation";
export default function Navbar() {
	const { mode } = useColorScheme();
	const pathname = usePathname();
	const [collapsed, setCollapsed] = useState<boolean>(true);
	const { status, data } = useSession();
	const locations: LocationProps[] = [
		{ name: "Home", href: "/" },
		{ name: "Discord Community", href: "/community" },
		...(status === "authenticated"
			? [
					{ name: "Donate", href: "/donate" },
					{ name: "My Stats", href: "/stats" },
			  ]
			: []),
	];

	return (
	<Box
		component={"nav"}
		sx={{ zIndex: 100, position: "sticky", top: 0, backdropFilter: "blur(4px)", background: "transparent", height: "auto", alignItems: "center", display: "flex", flexDirection: "column", py: 2 }}>
		<Container maxWidth={"lg"}>
			<Stack direction={"row"} sx={{ alignContent: "center", alignItems: "center", justifyContent: "center" }}>
				<Box sx={{ display: { xs: "none", md: "inherit" } }}>
					<UserDisplay status={status} data={data}></UserDisplay>
				</Box>
				{/* Navigation */}
				<Stack
					direction={"row"}
					sx={theme => ({
						backgroundColor: mode === "dark" ? `${theme.palette.neutral[800]}` : `${theme.palette.neutral[100]}`,
						borderRadius: "1.5rem",
						justifyContent: "center",
						position: "absolute",
						left: "50%",
						transform: "translateX(-50%)",
						flex: 1,
						flexGrow: 2,
						flexBasis: "fit-content",
						gap: 2,
						display: { xs: "none", md: "inherit" },
					})}>
					{locations.map(item => (
						<Button
							size="lg"
							variant={pathname === `${item.href}` ? "solid" : "plain"}
							color={pathname === `${item.href}` ? "secondary" : "neutral"}
							key={item.name}
							component={Link}
							href={item.href}
							sx={{ textWrap: "nowrap" }}>
							{item.name}
						</Button>
					))}
				</Stack>
					<Button
						color="secondary"
					variant="soft"
					size="lg"
					sx={{ display: { md: "none", pointerEvents: { md: "none" } } }}
					onClick={() => {
						setCollapsed(prev => !prev);
					}}>
					<Menu></Menu>
				</Button>
				<ThemeToggler />
			</Stack>
		</Container>
		<Container maxWidth={"sm"}>
			<NavCollapsedMenu locations={locations} collapsed={collapsed} />
		</Container>
	</Box>
);
}

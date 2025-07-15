"use client";
import { Box, Button, Container, Stack } from "@mui/joy";
import ThemeToggler from "../theme/ThemeToggler";
import { useSession } from "next-auth/react";
import Link from "next/link";
import UserDisplay from "./UserDisplay";
import { LocationProps } from "@/lib/definitions";
import NavCollapsedMenu from "./NavCollapsedMenu";
import { useState } from "react";
import { Menu } from "@mui/icons-material";
export default function Navbar() {
	const [collapsed, setCollapsed] = useState<boolean>(true);
	const { status, data } = useSession();
	const locations: LocationProps[] = [
		{ name: "Home", href: "/" },
		{ name: "Discord Community", href: "/community" },
		...(status === "authenticated"
			? [
					{ name: "Donate", href: "/donate" },
					{ name: "My donations", href: "/donations" },
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
						sx={{
							justifyContent: "center",
							position: "absolute",
							left: "50%",
							transform: "translateX(-50%)",
							flex: 1,
							flexGrow: 2,
							flexBasis: "fit-content",
							gap: 2,
							display: { xs: "none", md: "inherit" },
						}}>
						{locations.map(item => (
							<Button variant="plain" color="primary" key={item.name} component={Link} href={item.href} sx={{ textWrap: "nowrap" }}>
								{item.name}
							</Button>
						))}
					</Stack>
					<Button
						variant="plain"
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

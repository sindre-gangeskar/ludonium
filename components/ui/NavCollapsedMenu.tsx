"use client";
import { LocationProps } from "@/lib/definitions";
import { Button, List, ListItem } from "@mui/joy";
import Link from "next/link";
import UserDisplay from "./UserDisplay";
import { useSession } from "next-auth/react";
export default function NavCollapsedMenu({ locations, collapsed }: { locations: LocationProps[]; collapsed: boolean }) {
	const { status, data } = useSession();
	return (
		<List
			variant="soft"
			sx={{
				mt: 3,
				p: 0,
				borderRadius: "1.5rem",
				width: "100%",
				height: { xs: collapsed ? 0 : "350px", md: 0 },
				overflowY: 'hidden',
				justifyContent: 'center',
				transition: "height 250ms ease",
				display: { xs: "flex", md: "none" },
			}}>
			{locations.map(location => (
				<ListItem key={location.name}>
					<Button size="lg" color="secondary" component={Link} href={location.href} variant="plain" sx={{ width: "100%" }}>
						{location.name}
					</Button>
				</ListItem>
			))}
			{status === "authenticated" && (
				<ListItem sx={{ display: "flex", justifyContent: "center" }}>
					<UserDisplay data={data} status={status} />
				</ListItem>
			)}
		</List>
	);
}

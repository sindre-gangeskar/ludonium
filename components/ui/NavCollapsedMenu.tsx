"use client";
import { LocationProps } from "@/lib/definitions";
import { Button, List, ListItem } from "@mui/joy";
import Link from "next/link";

export default function NavCollapsedMenu({ locations, collapsed }: { locations: LocationProps[]; collapsed: boolean }) {
	return (
		<List sx={{ bottom: 0, width: "100%", height: collapsed ? 0 : "max-content", overflowY: "hidden", transition: "height 250ms ease", p: collapsed ? 0 : 2 }}>
			{locations.map(location => (
				<ListItem key={location.name}>
					<Button component={Link} href={location.href} variant="soft" sx={{ width: "100%" }}>
						{location.name}
					</Button>
				</ListItem>
			))}
		</List>
	);
}

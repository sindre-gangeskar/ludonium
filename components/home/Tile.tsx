"use client";
import { Card, CardContent, ColorPaletteProp, Typography } from "@mui/joy";
import { useColorScheme } from "@mui/joy";
export default function Tile({ color = "primary", title, description, className }: { color?: ColorPaletteProp; title: string; description: string; className?: string }) {
	const { mode } = useColorScheme();
	return (
		<Card
			className={className}
			variant="plain"
			size="lg"
			sx={{
				width: { xs: "100%", md: "500px" },
				position: "relative",
				overflow: "hidden",
				...(mode === "dark" ? { background: "transparent" } : null),
			}}>
			<CardContent>
				<Typography color={color} level="h4">
					{title}
				</Typography>
				<Typography level="title-md">{description}</Typography>
			</CardContent>
		</Card>
	);
}

"use client";
import { Card, CardContent, Typography } from "@mui/joy";

export default function Tile({ title, description, className }: { title: string; description: string; className?: string }) {
	return (
		<Card className={className} color="neutral" variant="soft" size="lg" sx={{ width: "350px", maxWidth: "sm", aspectRatio: 2 / 1 }}>
			<CardContent>
				<Typography color="primary" level="h3">
					{title}
				</Typography>
				<Typography level="title-md">{description}</Typography>
			</CardContent>
		</Card>
	);
}

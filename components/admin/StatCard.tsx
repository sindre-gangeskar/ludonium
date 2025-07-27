"use client";
import { Card, CardContent, Box, Typography, Stack } from "@mui/joy";
import { ColorPaletteProp } from "@mui/joy";
export default function StatCard({ title, color = "primary", count }: { title: string; color?: ColorPaletteProp; count: number }) {
	return (
		<Card variant="outlined" sx={{ maxWidth: "400px", flex: 1 }}>
			<CardContent>
				<Stack direction={"row"} sx={{ justifyContent: "space-evenly" }}>
					<Box
						sx={theme => ({
							mr: "auto",
							borderRadius: "50%",
							border: `2px solid ${theme.palette[color][400]}`,
							boxShadow: `0px 0px 0.6rem ${theme.palette[color][500]}`,
							width: "100%",
							p: 2,
							maxWidth: "5rem",
							aspectRatio: 1,
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						})}>
						<Typography level="title-sm">{title}</Typography>
					</Box>
					<Stack my={"auto"} gap={1} sx={{ alignItems: "end" }}>
						<Typography level="title-sm">
							Donations Available: {count ?? 0}
						</Typography>
					</Stack>
				</Stack>
			</CardContent>
		</Card>
	);
}

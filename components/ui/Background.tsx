"use client";
import { BackgroundProps } from "@/lib/definitions";
import { Box, ColorPaletteProp, useColorScheme } from "@mui/joy";
import { Theme } from "@mui/joy";

export default function Background({ style = "circle", maskSize = 60 }: BackgroundProps) {
	const { mode } = useColorScheme();
	return (
		<Box id="background-wrapper" sx={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: -1 }}>
			<Box
				sx={theme => ({
					position: "relative",
					width: "100%",
					height: "100%",
					mx: "auto",
					maskImage: `radial-gradient(${style} ellipse at center, rgba(0,0,0, 1) 0%, rgba(0,0,0,0) ${maskSize}%)`,
					zIndex: -1,
					transition: "250ms ease",
					overflow: "hidden",
					"&::before": {
						transition: "inherit",
						content: '""',
						display: "block",
						position: "absolute",
						height: "100%",
						width: "100%",
						background: `
						radial-gradient(circle at 150% 120%, ${applyGradientColors(theme, mode).center} 0%, ${applyGradientColors(theme, mode).edge} 50%, transparent),
						radial-gradient(circle at 0% 0%, ${applyGradientColors(theme, mode, "secondary").center} 0%, ${applyGradientColors(theme, mode).edge} 50%, transparent)`,
						zIndex: -5,
					},
				})}></Box>
		</Box>
	);
}

function applyGradientColors(theme: Theme, mode: "dark" | "light" | "system" | undefined, color: ColorPaletteProp | "secondary" = "primary") {
	if (mode === "dark") {
		return { center: theme.palette[color][600], edge: theme.palette[color][900] };
	} else return { center: theme.palette[color][50], edge: theme.palette[color][200] };
}

"use client";
import { Box, useColorScheme } from "@mui/joy";
import { applyGradientColors } from "@/lib/utils";
export default function Background() {
	const { mode } = useColorScheme();
	return (
		<Box id="background-wrapper" sx={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: -1 }}>
			<Box
				sx={theme => ({
					position: "relative",
					width: "100%",
					height: "100%",
					mx: "auto",
					zIndex: -1,
					transition: "250ms ease",
					overflow: "hidden",
					background: "var(--joy-palette-neutral-softBg)",
					"&::before": {
						transition: "inherit",
						content: '""',
						display: "block",
						position: "absolute",
						height: "100%",
						width: "100%",
						background: `
						radial-gradient(circle at 160% 150%, ${applyGradientColors(theme, mode).center} 0%, ${applyGradientColors(theme, mode).edge} 50%, transparent),
						radial-gradient(circle at -50% 0%, ${applyGradientColors(theme, mode, "secondary").center} 0%, ${applyGradientColors(theme, mode).edge} 50%, transparent)`,
						zIndex: -5,
					},
				})}></Box>
		</Box>
	);
}

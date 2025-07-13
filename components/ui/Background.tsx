"use client";
import { BackgroundProps } from "@/lib/definitions";
import { Box } from "@mui/joy";
export default function Background({ style = "circle", gridSize = 40, color = "neutral", maskSize = 60, dotSize = 1 }: BackgroundProps) {
	return (
		<Box
			sx={theme => ({
				animation: "slide 5s linear infinite",
				position: "absolute",
				width: "100%",
				height: "100%",
				background: `radial-gradient(circle, ${theme.palette[color].outlinedColor} ${dotSize}px, transparent 1px)`,
				backgroundSize: `${gridSize}px ${gridSize}px`,
				backgroundRepeat: "repeat",
				mx: "auto",
				left: "50%",
				top: "50%",
				transform: "translate(-50%, -50%)",
				maskImage: `radial-gradient(${style} at center, rgba(0,0,0, 1) 0%, rgba(0,0,0,0) ${maskSize}%)`,
				zIndex: -1,
				"@keyframes slide": {
					"0%": { backgroundPosition: `0 0` },
					"100%": { backgroundPosition: `${gridSize}px ${gridSize}px` },
				},
			})}></Box>
	);
}

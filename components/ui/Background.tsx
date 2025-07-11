"use client"
import { BackgroundProps } from "@/lib/definitions";
import { Box } from "@mui/joy";

export default function Background({style = "circle", gridSize = 40, color= 'primary'}: BackgroundProps) {
	return (
		<Box
			sx={theme => ({
				position: "absolute",
				width: "100%",
				height: "100%",
        background: `linear-gradient(to right, ${theme.palette[color].outlinedColor}, transparent 1px),
                     linear-gradient(to top, ${theme.palette[color].outlinedColor}, transparent 1px)`,
        backgroundSize: `${gridSize}px ${gridSize}px`,
        backgroundRepeat: 'repeat',
        mx: 'auto',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        maskImage: `radial-gradient(${style} at center, rgba(0,0,0, 1) 0%, rgba(0,0,0,0) 60%)`,
        zIndex: -1
      })}>
      </Box>
    
	);
}

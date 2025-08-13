import { ColorPaletteProp, Theme } from "@mui/joy";

export function applyGradientColors(theme: Theme, mode: "dark" | "light" | "system" | undefined, color: ColorPaletteProp = "primary") {
	if (mode === "dark") {
		return { center: theme.palette[color][700], edge: theme.palette[color][900] };
	} else return { center: theme.palette[color][50], edge: theme.palette[color][200] };
}

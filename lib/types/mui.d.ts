import { PaletteRange } from "@mui/joy";
declare module "@mui/joy/styles" {
	interface Palette {
		secondary: PaletteRange;
	}
	interface ColorPalettePropOverrides {
		secondary: true;
	}
}

"use client";
import { CssVarsProvider } from "@mui/joy";
import { extendTheme, useTheme } from "@mui/joy";
import { ColorPaletteProp } from "@mui/joy";
import { useEffect, useState } from "react";
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
	const theme = useTheme();
	const customTheme = extendTheme({
		fontFamily: { body: "var(--font-noto-sans)" },

		colorSchemes: {
			dark: {
				palette: {
					background: {
						body: theme.palette.neutral[900],
						surface: theme.palette.neutral[800],
					},
					secondary: {
						...getCustomColorRGBValues("secondary"),
						...generateColorVariables("secondary").dark,
					},
				},
			},
			light: {
				palette: {
					background: {
						body: theme.palette.neutral[200],
						surface: theme.palette.neutral[100],
					},
					secondary: {
						...getCustomColorRGBValues("secondary"),
						...generateColorVariables("secondary").light,
					},
				},
			},
		},
		components: {
			JoyButton: {
				styleOverrides: {
					root: {
						borderRadius: "1.5rem",
						transition: "background-color 250ms ease, color 250ms ease",
						fontFamily: "var(--font-noto-sans)",
					},
				},
			},
			JoyInput: {
				styleOverrides: {
					root: {
						borderRadius: "1.5rem",
						overflow: "hidden",
					},
				},
			},
			JoyTypography: {
				styleOverrides: {
					root: {
						transition: "background-color 250ms ease, color 250ms ease",
					},
				},
			},
		},
	});

	const [isHydrated, setIsHydrated] = useState(false);
	useEffect(() => {
		setIsHydrated(true);
	}, []);

	return !isHydrated ? null : (
		<CssVarsProvider colorSchemeStorageKey="mui-mode" theme={customTheme} disableNestedContext>
			{children}
		</CssVarsProvider>
	);
}

function generateColorVariables(color: ColorPaletteProp) {
	return {
		dark: {
			solidBg: `var(--joy-palette-${color}-600)`,
			solidColor: "var(--joy-palette-neutral-50)",
			solidActiveBg: `var(--joy-palette-${color}-500)`,
			outlinedBorder: `var(--joy-palette-${color}-500)`,
			outlinedColor: `var(--joy-palette-${color}-50)`,
			outlinedActiveBg: `var(--joy-palette-${color}-100)`,
			softColor: `var(--joy-palette-${color}-400)`,
			softBg: `var(--joy-palette-${color}-900)`,
			softActiveBg: `var(--joy-palette-${color}-500)`,
			plainColor: `var(--joy-palette-${color}-700)`,
			plainActiveBg: `var(--joy-palette-${color}-100)`,
			disabledBg: `var(--joy-palette-${color}-900)`,
			solidDisabledColor: `var(--joy-palette-${color}-200)`,
			solidDisabledBg: `var(--joy-palette-${color}-900)`,
		},
		light: {
			solidBg: `var(--joy-palette-${color}-400)`,
			solidColor: "var(--joy-palette-neutral-50)",
			solidActiveBg: `var(--joy-palette-${color}-500)`,
			outlinedBorder: `var(--joy-palette-${color}-500)`,
			outlinedColor: `var(--joy-palette-${color}-700)`,
			outlinedActiveBg: `var(--joy-palette-${color}-100)`,
			softColor: `var(--joy-palette-${color}-500)`,
			softBg: `var(--joy-palette-${color}-50)`,
			softActiveBg: `var(--joy-palette-${color}-300)`,
			plainColor: `var(--joy-palette-${color}-700)`,
			plainActiveBg: `var(--joy-palette-${color}-100)`,
			disabledBg: `var(--joy-palette-${color}-50)`,
			solidDisabledColor: `var(--joy-palette-${color}-200)`,
			solidDisabledBg: `var(--joy-palette-${color}-50)`,
		},
	};
}

function getCustomColorRGBValues(color: ColorPaletteProp) {
	switch (color) {
		case "secondary": {
			return {
				50: "rgb(248, 243, 254)",
				100: "rgb(206, 179, 231)",
				200: "rgb(170, 135, 205)",
				300: "rgb(176, 134, 219)",
				400: "rgb(160, 107, 213)",
				500: "rgb(143, 95, 192)",
				600: "rgb(140, 72, 208)",
				700: "rgb(125, 65, 186)",
				800: "rgb(68, 33, 103)",
				900: "rgb(43, 25, 62)",
			};
		}
		default:
			break;
	}
}

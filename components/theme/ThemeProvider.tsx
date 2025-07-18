"use client";
import { CssVarsProvider } from "@mui/joy";
import { extendTheme, useTheme } from "@mui/joy";
import { ColorPaletteProp } from "@mui/joy";
import { useEffect, useState } from "react";
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
	const theme = useTheme();
	const customTheme = extendTheme({
		fontFamily: { body: "var(--font-noto-sans)" },
		typography: {
			h1: { fontFamily: "var(--font-comfortaa)" },
			h2: { fontFamily: "var(--font-comfortaa)", fontWeight: 900 },
			h3: { fontFamily: "var(--font-comfortaa)", fontWeight: 900 },
			h4: { fontFamily: "var(--font-comfortaa)", fontWeight: 900 },
		},
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
						minHeight: "2.8rem",
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
		softColor: `var(--joy-palette-${color}-100)`,
		softHoverColor: `var(--joy-palette-${color}-50)`,
		softBg: `var(--joy-palette-${color}-900)`,
		softHoverBg: `var(--joy-palette-${color}-800)`,
		softActiveBg: `var(--joy-palette-${color}-500)`,
		plainColor: `var(--joy-palette-${color}-200)`,
		plainActiveBg: `var(--joy-palette-${color}-100)`,
		plainHoverBg: `var(--joy-palette-${color}-700)`,
		disabledBg: `var(--joy-palette-${color}-900)`,
		solidDisabledColor: `var(--joy-palette-neutral-500)`,
		solidDisabledBg: `var(--joy-palette-neutral-800)`,
	},
	light: {
		solidBg: `var(--joy-palette-${color}-500)`,
		solidColor: "var(--joy-palette-neutral-50)",
		solidActiveBg: `var(--joy-palette-${color}-500)`,
		outlinedBorder: `var(--joy-palette-${color}-500)`,
		outlinedColor: `var(--joy-palette-${color}-700)`,
		outlinedActiveBg: `var(--joy-palette-${color}-100)`,
		softColor: `var(--joy-palette-${color}-500)`,
		softHoverColor: `var(--joy-palette-${color}-50)`,
		softBg: `var(--joy-palette-${color}-50)`,
		softActiveBg: `var(--joy-palette-${color}-300)`,
		softHoverBg: `var(--joy-palette-${color}-100)`,
		plainColor: `var(--joy-palette-${color}-700)`,
		plainHoverBg: `var(--joy-palette-${color}-50)`,
		plainActiveBg: `var(--joy-palette-${color}-100)`,
		disabledBg: `var(--joy-palette-${color}-50)`,
		solidDisabledColor: `var(--joy-palette-neutral-400)`,
		solidDisabledBg: `var(--joy-palette-neutral-100)`,
	},
};
}

function getCustomColorRGBValues(color: ColorPaletteProp) {
	switch (color) {
		case "secondary": {
			return {
				50: "rgb(232, 223, 244)",
				100: "rgb(206, 179, 231)",
				200: "rgb(170, 135, 205)",
				300: "rgb(144, 103, 184)",
				400: "rgb(138, 87, 189)",
				500: "rgb(125, 73, 176)",
				600: "rgb(94, 44, 144)",
				700: "rgb(76, 44, 109)",
				800: "rgb(48, 26, 69)",
				900: "rgb(29, 20, 39)",
			};
		}
		default:
			break;
	}
}

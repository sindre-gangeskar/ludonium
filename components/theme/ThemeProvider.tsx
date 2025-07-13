"use client";
import { CssVarsProvider } from "@mui/joy";
import { extendTheme, useTheme } from "@mui/joy";
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
				},
			},
			light: {
				palette: {
					background: {
						body: theme.palette.neutral[200],
						surface: theme.palette.neutral[100],
					},
				},
			},
		},
		components: {
			JoyButton: {
				styleOverrides: {
					root: {
						transition: "background-color 250ms ease, color 250ms ease",
						fontFamily: "var(--font-ginto-discord)",
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
		<CssVarsProvider defaultColorScheme={"dark"} modeStorageKey="mui-mode" theme={customTheme} disableNestedContext>
			{children}
		</CssVarsProvider>
	);
}

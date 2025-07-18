"use client";
import { Button } from "@mui/joy";
import { useColorScheme } from "@mui/joy";
import { Brightness1Rounded, Brightness2Rounded } from "@mui/icons-material";
export default function ThemeToggler() {
	const { mode, setMode } = useColorScheme();

	const toggleTheme = () => {
		if (mode === "dark") setMode("light");
		else setMode("dark");
	};

	return (
		<Button onClick={toggleTheme} color="neutral" variant="soft" sx={{ borderRadius: "1rem", ml: 'auto', flexGrow: 0 }}>
			{mode === "dark" ? <Brightness1Rounded/> : <Brightness2Rounded/>}
		</Button>
	);
}

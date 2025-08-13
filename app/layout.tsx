import type { Metadata } from "next";
import { Geist, Geist_Mono, REM, Funnel_Sans } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/theme/ThemeProvider";
import { Container } from "@mui/joy";
import Navbar from "@/components/ui/Navbar";
import { SessionProvider } from "next-auth/react";
import Background from "@/components/ui/Background";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const funnelSans = Funnel_Sans({
	variable: "--font-funnel-sans",
	subsets: ["latin"],
});

const rem = REM({
	variable: "--font-rem",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Ludonium",
	description: "A giveaway system utilizing donated game keys for giving back to the community",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<noscript>JavaScript must be enabled in order to use this website.</noscript>
				<link rel="icon" type="image/svg+xml" href="/icon.svg"></link>
			</head>
			<body className={`${geistSans.variable} ${geistMono.variable} ${rem.variable} ${funnelSans.variable} antialiased`}>
				<SessionProvider>
					<ThemeProvider>
						<Navbar />
						<Container maxWidth={"xl"}>{children}</Container>
						<Background />
					</ThemeProvider>
				</SessionProvider>
			</body>
		</html>
	);
}

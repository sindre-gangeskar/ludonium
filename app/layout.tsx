import type { Metadata } from "next";
import { Comfortaa, Geist, Geist_Mono, Noto_Sans, Noto_Sans_Display } from "next/font/google";
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

const comfortaa = Comfortaa({
	variable: "--font-comfortaa",
	subsets: ["latin"],
});

const notoSans = Noto_Sans({
	variable: "--font-noto-sans",
	subsets: ["latin"],
});

const notoSansDisplay = Noto_Sans_Display({
	variable: "--font-noto-sans-display",
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
				<link rel="icon" type="image/svg+xml" href="icon.svg"></link>
			</head>
			<body className={`${geistSans.variable} ${geistMono.variable} ${comfortaa.variable} ${notoSans.variable} ${notoSansDisplay.variable} antialiased`}>
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

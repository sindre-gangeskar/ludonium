import type { Metadata } from "next";
import { Comfortaa, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/theme/ThemeProvider";
import { Container } from "@mui/joy";
import Navbar from "@/components/ui/Navbar";
import { SessionProvider } from "next-auth/react";

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

export const metadata: Metadata = {
	title: "Project Giveaway",
	description: "Giveaway application that gives away donated game keys",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${geistSans.variable} ${geistMono.variable} ${comfortaa.variable} antialiased`}>
				<SessionProvider>
					<ThemeProvider>
						<Navbar />
						<Container maxWidth={'xl'}>{children}</Container>
					</ThemeProvider>
				</SessionProvider>
			</body>
		</html>
	);
}

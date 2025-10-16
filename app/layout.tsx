import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/theme/ThemeProvider";
import { Container } from "@mui/joy";
import Navbar from "@/components/ui/Navbar";
import { SessionProvider } from "next-auth/react";
import Background from "@/components/ui/Background";

const roboto = Roboto({
	variable: "--font-roboto",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: { default: "Ludonium", template: "Ludonium | %s" },
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
			<body className={`${roboto.variable} antialiased`}>
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

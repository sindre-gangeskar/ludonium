import type { Metadata } from "next";
import { Comfortaa, Geist, Geist_Mono, Noto_Sans } from "next/font/google";
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
	variable: '--font-noto-sans',
	subsets: ['latin']
})


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
			<body className={`${geistSans.variable} ${geistMono.variable} ${comfortaa.variable} ${notoSans.variable} antialiased`}>
				<SessionProvider>
					<ThemeProvider>
						<Navbar />
						<Container maxWidth={"xl"}>{children}</Container>
						<Background gridSize={40} maskSize={80} dotSize={1.5}/>
					</ThemeProvider>
				</SessionProvider>
			</body>
		</html>
	);
}

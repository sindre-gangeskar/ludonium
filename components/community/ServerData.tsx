"use client";
import { Typography } from "@mui/joy";
import useDiscord from "@/hooks/useDiscord";
import { useSession } from "next-auth/react";
import ServerDisplay from "./ServerDisplay";
export default function ServerData() {
	const { isLoading } = useDiscord();
	const { status } = useSession();
	if (isLoading || status === "loading") return <Typography>Loading server data...</Typography>;
	return <ServerDisplay />;
}

"use client";
import { Typography } from "@mui/joy";
import useDiscord from "@/hooks/useDiscord";
import { useSession } from "next-auth/react";
import ServerDisplay from "./ServerDisplay";
export default function ServerData() {
	const { status, data: sessionData } = useSession();
	const { isLoading, data: discordData } = useDiscord();

	if (isLoading || status === "loading" || !discordData || !sessionData) return <Typography>Loading server data...</Typography>;
	return <ServerDisplay discordData={discordData} sessionData={sessionData} status={status} />
}

"use client";
import useDiscord from "@/hooks/useDiscord";
import { useSession } from "next-auth/react";
import ServerDisplay from "./ServerDisplay";
import Loader from "../ui/Loader";
export default function ServerData() {
	const { isLoading } = useDiscord();
	const { status } = useSession();
	if (isLoading || status === "loading") return <Loader/>
	return <ServerDisplay />;
}

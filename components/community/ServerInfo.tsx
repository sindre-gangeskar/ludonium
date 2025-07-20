"use client";
import { Typography, Stack, Avatar, Box, Button } from "@mui/joy";
import useDiscord from "@/hooks/useDiscord";
import Header from "../ui/Header";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useSession } from "next-auth/react";
import MemberStatus from "./MemberStatus";
import JoinServer from "./JoinServer";
import { pingDiscordChannel } from "@/app/community/actions";
export default function ServerInfo() {
	const { status, data: discordData } = useSession();

	useGSAP(() => {
		gsap.set("#content > *, #content-box *", { opacity: 0, x: -150, filter: "blur(16px)" });
		gsap.to("#content > *, #content-box *", { opacity: 1, x: 0, duration: 1.5, stagger: 0.2, filter: "blur(0px)", ease: "power4.out" });
	});

	const { isLoading, data } = useDiscord();
	if (isLoading || status === "loading") return <Typography>Loading server data...</Typography>;

	return (
	<Stack id="content" maxWidth={"lg"} mt={5} sx={{ mx: "auto" }}>
		<Header title={data.name} />
		<Stack gap={3} direction={"column"} width={"fit-content"} sx={{ mx: "auto", alignItems: "center" }}>
			<Avatar sx={{ width: 120, height: 120, aspectRatio: 1 / 1, mx: "auto" }} size="lg" src={data.icon}></Avatar>
			<MemberStatus />
			{!discordData?.isMemberOfGuild && status === "authenticated" && <JoinServer />}
		</Stack>
		<Stack maxWidth={"sm"} mx={"auto"} mt={5}>
			<Box id="content-box">
				<Typography level="h2" color="secondary">
					Description
				</Typography>
				<Typography level="title-md">{data.description}</Typography>
			</Box>
			</Stack>
			
			<form action={pingDiscordChannel}>
				<Button type="submit">Ping Bot</Button>
			</form>
	</Stack>
);
}
